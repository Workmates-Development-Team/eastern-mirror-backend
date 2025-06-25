import videoModels from "../models/video.models.js";
import adsModels from "../models/ads.models.js";
import sliderModels from "../models/slider.models.js";
import { getFilePath3 } from "../utils/helper.js";
import path from "path";
import fs from "fs";
import mongoose from "mongoose";
import { s3Client, uploadToS3 } from "../utils/uploadToS3.js";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";

class AdsController {
  static async addAds(req, res) {
    try {
      const { link } = req.body;

      if (!req.file) {
        return res.status(404).json({ message: "File is required" });
      }

      if (!link) {
        return res.status(400).json({ message: "Name is required" });
      }

      const relativePath = await uploadToS3(
        req.file.buffer,
        req.file.originalname,
        "ads"
      );

      const newAd = new adsModels({ imageUrl: relativePath, link });
      await newAd.save();

      // Find or create the single Slider document
      let slider = await sliderModels.findOne();
      if (!slider) {
        slider = new sliderModels({ items: [] });
      }

      // Add new Ad to the beginning of items array
      slider.items.unshift(newAd._id);
      await slider.save();

      res.json({
        message: "Ad uploaded successfully",
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async updateAds(req, res) {
    try {
      const { id } = req.params;
      const { link } = req.body;

      const existingAd = await adsModels.findById(id);
      if (!existingAd) {
        return res.status(404).json({ message: "Ads not found" });
      }

      const updateData = {
        link,
      };

      if (req.file) {
        if (existingAd.imageUrl) {
          const oldS3Key = `images${existingAd.imageUrl}`;
          try {
            await s3Client.send(
              new DeleteObjectCommand({
                Bucket: process.env.AWS_S3_BUCKET_NAME,
                Key: oldS3Key,
              })
            );
          } catch (err) {
            console.error("Failed to delete old S3 image:", err);
          }
        }

        const newImagePath = await uploadToS3(
          req.file.buffer,
          req.file.originalname,
          "ads"
        );
        updateData.imageUrl = newImagePath;
      }

      // Update the author
      const ads = await adsModels.findByIdAndUpdate(id, updateData, {
        new: true,
      });

      res.json({
        message: "Ad updated successfully",
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async deleteAds(req, res) {
    try {
      const { id } = req.params;

      // Validate if ID is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid ad ID" });
      }

      const ads = await adsModels.findById(id);
      if (!ads) return res.status(404).json({ message: "Ad not found" });

      // Remove the ad ID from Slider items array if present
      await sliderModels.updateMany({ items: id }, { $pull: { items: id } });

      // Delete the ad
      await adsModels.findByIdAndDelete(id);

      // Delete associated image file
      if (ads.imageUrl) {
        const s3Key = `images${ads.imageUrl}`;
        try {
          await s3Client.send(
            new DeleteObjectCommand({
              Bucket: process.env.AWS_S3_BUCKET_NAME,
              Key: s3Key,
            })
          );
        } catch (err) {
          console.error("Failed to delete S3 ad image:", err);
        }
      }

      res.json({ message: "Ad deleted successfully" });
    } catch (error) {
      console.log(error);

      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async getAds(req, res) {
    try {
      const {
        sortBy = "createdAt",
        sortOrder = "-1",
        page = 1,
        limit = 10,
      } = req.query;

      const pageNumber = parseInt(page, 10);
      const pageSize = parseInt(limit, 10);

      const skip = (pageNumber - 1) * pageSize;

      const ads = await adsModels
        .find()
        .sort({ [sortBy]: Number(sortOrder) })
        .skip(skip)
        .limit(pageSize);

      const totalItems = await adsModels.countDocuments();

      const totalPages = Math.ceil(totalItems / pageSize);

      res.status(200).json({
        ads,
        totalItems,
        totalPages,
        currentPage: pageNumber,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async getSlider(req, res) {
    try {
      const ads = await sliderModels.findOne().populate("items");

      res.status(200).json(ads);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async updateSlider(req, res) {
    try {
      const { items } = req.body;

      if (!items || !Array.isArray(items)) {
        return res.status(400).json({ message: "Invalid items array" });
      }

      // Update the slider with the new items array
      const updatedSlider = await sliderModels
        .findOneAndUpdate(
          {}, // Assuming there's only one slider document
          { $set: { items } },
          { new: true }
        )
        .populate("items");

      if (!updatedSlider) {
        return res.status(404).json({ message: "Slider not found" });
      }

      res.status(200).json(updatedSlider);
    } catch (error) {
      console.error("Error updating slider:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async addToSlider(req, res) {
    try {
      const { id } = req.body;

      if (!id) {
        return res.status(400).json({ message: "ID is required" });
      }

      // Find the slider document (assuming there’s only one)
      let slider = await sliderModels.findOne();

      if (!slider) {
        return res.status(404).json({ message: "Slider not found" });
      }

      // Check if the ID already exists in the `items` array
      if (slider.items.includes(id)) {
        return res.status(200).json({ message: "Already exists" });
      }

      // Add the new ID to the first position of `items` array
      slider.items.unshift(id);

      // Save the updated document
      await slider.save();

      // Populate and return the updated slider
      const updatedSlider = await sliderModels
        .findById(slider._id)
        .populate("items");

      res.status(200).json(updatedSlider);
    } catch (error) {
      console.error("Error updating slider:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async removeFromSlider(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ message: "ID is required" });
      }

      // Find the slider document (assuming there’s only one)
      let slider = await sliderModels.findOne();

      if (!slider) {
        return res.status(404).json({ message: "Slider not found" });
      }

      // Check if the ID already exists in the `items` array
      if (!slider.items.includes(id)) {
        return res.status(200).json({ message: "Already removed" });
      }

      await sliderModels.updateOne({}, { $pull: { items: id } });

      res.status(200).json({ message: "Updated" });
    } catch (error) {
      console.error("Error updating slider:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
}
export default AdsController;
