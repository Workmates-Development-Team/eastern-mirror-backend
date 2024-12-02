import galleryModels from "../models/gallery.models.js";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import { unlink } from "fs/promises";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class GalleryController {
  static async upload(req, res) {
    try {
      const { name, caption } = req.body;

      if (!req.file) {
        return res.status(404).json({ message: "File is required" });
      }

      if (!name) {
        return res.status(400).json({ message: "Name is required" });
      }

      let url = `/article/${req.file.filename}`;

      const newImage = new galleryModels({
        url,
        name,
        caption,
      });

      await newImage.save();

      res.status(201).json({ message: "File uploaded successfully" });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      const image = await galleryModels.findById(id);

      if (!image) {
        return res.status(404).json({ message: "Image not found" });
      }
      const filePath = path.join(__dirname, "../uploads", image.url);

      await unlink(filePath);
      await galleryModels.findByIdAndDelete(id);

      res.status(200).json({ message: "Image deleted successfully" });
    } catch (error) {
      if (error.code === "ENOENT") {
        return res.status(404).json({ message: "File not found on server" });
      }
      res
        .status(500)
        .json({ message: "Internal Server Error", error: error.message });
    }
  }

  static async getAll(req, res) {
    try {
      const { page = 1, limit = 5, search = "" } = req.query;

      // Add search by name feature
      const query = search ? { name: { $regex: search, $options: "i" } } : {};

      const images = await galleryModels
        .find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit));

      const totalImages = await galleryModels.countDocuments(query);

      res.status(200).json({
        images,
        totalPages: Math.ceil(totalImages / limit),
        currentPage: parseInt(page),
      });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
  }

  static async updateCaption(req, res) {
    try {
      const { id } = req.params;
      const { caption } = req.body;

      if (!caption) {
        return res.status(400).json({ message: "Caption is required" });
      }

      const updatedImage = await galleryModels.findByIdAndUpdate(
        id,
        { caption },
        { new: true }
      );

      if (!updatedImage) {
        return res.status(404).json({ message: "Image not found" });
      }

      res.status(200).json({ 
        message: "Caption updated successfully", 
        updatedImage 
      });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
  }
}

export default GalleryController;
