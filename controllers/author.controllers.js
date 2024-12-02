import { z } from "zod";
import authorModels from "../models/author.models.js";
import { authorSchema } from "../middlewares/inputValidation.js";
import { getFilePath } from "../utils/helper.js";
import path from "path";
import fs from "fs";

const generateUniqueUsername = async (baseUsername) => {
  let username = baseUsername;
  let count = 1;
  let exists = await authorModels.exists({ username });

  while (exists) {
    username = `${baseUsername}-${Math.floor(100 + Math.random() * 900)}`; // Add random 3-digit number
    exists = await authorModels.exists({ username });
    count++;
  }

  return username;
};

class AuthorController {
  static async add(req, res) {
    try {
      const userId = req.user?._id;
      const { name, email } = authorSchema.parse(req.body);

      const existingAuthor = await authorModels.findOne({ email });
      if (existingAuthor) {
        if (req.file) {
          const filePath = getFilePath(req.file.filename);
          fs.unlink(filePath, (err) => {
            if (err) {
              console.error("Failed to delete the file:", err);
            }
          });
        }
        return res
          .status(400)
          .json({ message: "Author with this email already exists" });
      }

      let avatar = "";
      if (req.file) {
        avatar = `/avatar/${req.file.filename}`;
      }

      const baseUsername = name.toLowerCase().replace(/\s+/g, "-");
      const username = await generateUniqueUsername(baseUsername);

      const author = new authorModels({
        name,
        email,
        username,
        createdBy: userId,
        avatar,
      });
      await author.save();

      res.status(201).json({ message: "Author created successfully", author });
    } catch (error) {
      if (error instanceof z.ZodError) {
        if (req.file) {
          const filePath = getFilePath(req.file.filename);
          fs.unlink(filePath, (err) => {
            if (err) {
              console.error("Failed to delete the file:", err);
            }
          });
        }

        return res
          .status(400)
          .json({ message: error.errors[0]?.message || "Validation error" });
      }
      res.status(500).json({ message: error.message });
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      const { name, email } = req.body;

      const schema = z.object({
        name: z.string().min(1).optional(),
        email: z.string().email().optional(),
      });
      const updateData = schema.parse({ name, email });

      const existingAuthor = await authorModels.findById(id);
      if (!existingAuthor) {
        return res.status(404).json({ message: "Author not found" });
      }

      if (req.file) {
        if (existingAuthor.avatar) {
          const oldFilePath = getFilePath(path.basename(existingAuthor.avatar));
          fs.unlink(oldFilePath, (err) => {
            if (err) {
              console.error("Failed to delete the old avatar:", err);
            }
          });
        }

        updateData.avatar = `/avatar/${req.file.filename}`;
      }

      // Update the author
      const author = await authorModels.findByIdAndUpdate(id, updateData, {
        new: true,
      });

      // Return the updated author data
      res.status(200).json({ message: "Author updated successfully", author });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res
          .status(400)
          .json({ message: error.errors[0]?.message || "Validation error" });
      }
      // Handle other errors
      res.status(500).json({ message: error.message });
    }
  }

  static async softDelete(req, res) {
    try {
      const { id } = req.params;

      const author = await authorModels.findByIdAndUpdate(
        id,
        { isDeleted: true },
        { new: true }
      );

      if (!author) {
        return res.status(404).json({ message: "Author not found" });
      }

      res
        .status(200)
        .json({ message: "Author soft deleted successfully", author });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getAll(req, res) {
    try {
      const {
        search = "",
        sortBy = "createdAt",
        sortOrder = "-1",
      } = req.query;

      // Build search query
      const searchQuery = {
        $and: [
          { isDeleted: false },
          {
            $or: [
              { name: { $regex: search, $options: "i" } },
              { email: { $regex: search, $options: "i" } },
            ],
          },
        ],
      };

      const authors = await authorModels
        .find(searchQuery)
        .sort({ [sortBy]: Number(sortOrder) })

      res.status(200).json({ authors });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getById(req, res) {
    try {
      const { id } = req.params;

      const author = await authorModels.findById(id);
      if (!author || author.isDeleted) {
        return res.status(404).json({ message: "Author not found" });
      }

      res.status(200).json({ author });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

export default AuthorController;
