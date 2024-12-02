import { z } from "zod";
import { videoSchema } from "../middlewares/inputValidation.js";
import videoModels from "../models/video.models.js";

class VideoController {
  static async addVideo(req, res) {
    try {
      const { link, thumbnail } = videoSchema.parse(req.body);

      const newVideo = new videoModels({
        link,
        thumbnail,
      });

      await newVideo.save();

      res.json({
        message: "Video uploaded successfully",
      });
    } catch (error) {
      console.log(error);
      if (error instanceof z.ZodError) {
        return res
          .status(400)
          .json({ message: error.errors[0]?.message || "Validation error" });
      }

      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async updateVideo(req, res) {}

  static async deleteVideo(req, res) {
    try {
      const { id } = req.params;

      const video = await videoModels.findById(id);

      if (!video) return res.status(404).json({ message: "Video not found" });

      await videoModels.findOneAndDelete(id);

      res.json({
        message: "Video deleted successfully",
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async getVideos(req, res) {
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

      const videos = await videoModels
        .find()
        .sort({ [sortBy]: Number(sortOrder) })
        .skip(skip)
        .limit(pageSize);

      const totalItems = await videoModels.countDocuments();

      const totalPages = Math.ceil(totalItems / pageSize);

      res.status(200).json({
        videos,
        totalItems,
        totalPages,
        currentPage: pageNumber,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
}
export default VideoController;
