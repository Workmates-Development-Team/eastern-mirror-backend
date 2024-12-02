import { z } from "zod";
import categoryModels from "../models/category.models.js";
import { categorySchema } from "../middlewares/inputValidation.js";
import slugify from "slugify";

class CategoryController {
  static async add(req, res) {
    try {
      const { name, parent } = categorySchema.parse(req.body);

      console.log(parent)

      const slug = slugify(name, { lower: true });

      const existingCategory = await categoryModels.findOne({ slug });
      if (existingCategory) {
        return res.status(400).json({ message: "Category already exists" });
      }

      let parentCategory = null;
      if (parent) {
        parentCategory = await categoryModels.findById(parent);
        if (!parentCategory) {
          return res.status(400).json({ message: "Invalid parent category" });
        }
      }

      const category = new categoryModels({
        name,
        slug,
        parent: parent || null,
      });

      await category.save();

      res
        .status(201)
        .json({ message: "Category created successfully", category });
    } catch (error) {
      console.error(error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: error.errors[0]?.message || "Validation error",
        });
      }

      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      const { name, parent } = categorySchema.parse(req.body);

      const slug = slugify(name, { lower: true });

      const category = await categoryModels.findById(id);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }

      const existingCategory = await categoryModels.findOne({
        slug,
        _id: { $ne: id },
      });
      if (existingCategory) {
        return res.status(400).json({
          message: "Another category with the same name already exists",
        });
      }

      let parentCategory = null;
      if (parent) {
        parentCategory = await categoryModels.findById(parent);
        if (!parentCategory) {
          return res.status(400).json({ message: "Invalid parent category" });
        }

        if (parent === id) {
          return res
            .status(400)
            .json({ message: "A category cannot be its own parent" });
        }
      }

      category.name = name;
      category.slug = slug;
      category.parent = parent || null;
      await category.save();

      res
        .status(200)
        .json({ message: "Category updated successfully", category });
    } catch (error) {
      console.error(error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: error.errors[0]?.message || "Validation error",
        });
      }

      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async delete(req, res) {
    try {
      const categoryId = req.params.id;

      const category = await categoryModels.findById(categoryId);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }

      await categoryModels.findByIdAndDelete(categoryId);

      res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async getAll(req, res) {
    try {
      const {
        search,
        sortBy = "name",
        sortOrder = "1",
        page = 1,
        limit = 10,
      } = req.query;

      let query = {};

      if (search) {
        query.name = { $regex: search, $options: "i" };
      }

      const pageNumber = parseInt(page, 10);
      const pageSize = parseInt(limit, 10);

      const skip = (pageNumber - 1) * pageSize;

      const categories = await categoryModels
        .find(query)
        .sort({ [sortBy]: Number(sortOrder) })
        .skip(skip)
        .limit(pageSize)
        .populate("parent", "name slug");

      const totalItems = await categoryModels.countDocuments(query);

      const totalPages = Math.ceil(totalItems / pageSize);

      res.status(200).json({
        categories,
        totalItems,
        totalPages,
        currentPage: pageNumber,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async getAllCategory(req, res) {
    try {
      const categories = await categoryModels.find().sort({ name: 1 });

      res.status(200).json(categories);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async getByParent(req, res) {
    try {
      const parentCategory = req.params.parentCategory;

      const categories = await categoryModels.find({ parentCategory });
      if (!categories || categories.length === 0) {
        return res
          .status(404)
          .json({ message: "No categories found for this parent category" });
      }

      res.status(200).json(categories);
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
}

export default CategoryController;
