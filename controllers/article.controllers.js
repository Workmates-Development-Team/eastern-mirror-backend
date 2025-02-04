import { z } from "zod";
import categoryModels from "../models/category.models.js";
import authorModels from "../models/author.models.js";
import articleModels from "../models/article.models.js";
import { articleSchema } from "../middlewares/inputValidation.js";

class ArticleController {
  static async add(req, res) {
    try {
      const {
        title,
        content,
        category,
        tags,
        isPopular,
        showOnTop,
        showOnHomePage,
        author,
        thumbnail,
        publishedAt,
        slug,
      } = articleSchema.parse(req.body);

      const authorExists = await authorModels.findById(author);
      if (!authorExists) {
        return res.status(400).json({ message: "Invalid author ID" });
      }

      const article = new articleModels({
        title,
        content,
        thumbnail,
        category: JSON.parse(category),
        tags: JSON.parse(tags),
        isPopular,
        showOnTop,
        showOnHomePage,
        isPublished: true,
        publishedAt,
        author,
        slug,
      });

      await article.save();
      res
        .status(201)
        .json({ message: "Article created successfully", article });
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

  static async edit(req, res) {
    try {
      const { id } = req.params;

      // Validate article ID
      const article = await articleModels.findById(id);
      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }

      // Parse the request body for updated fields
      const {
        title,
        content,
        category,
        tags,
        isPopular,
        showOnTop,
        showOnHomePage,
        author,
        isPublished = true,
        publishedAt,
        slug,
        thumbnail,
      } = articleSchema.parse(req.body);

      // Check if author exists
      const authorExists = await authorModels.findById(author);
      if (!authorExists) {
        return res.status(400).json({ message: "Invalid author ID" });
      }

      // Update the article fields
      article.title = title;
      article.content = content;
      article.thumbnail = thumbnail;
      article.category = JSON.parse(category);
      article.tags = JSON.parse(tags);
      article.isPopular = isPopular;
      article.showOnTop = showOnTop;
      article.showOnHomePage = showOnHomePage;
      article.isPublished = isPublished;
      article.publishedAt = publishedAt;
      article.author = author;
      article.slug = slug;

      // Save updated article
      await article.save();

      res
        .status(200)
        .json({ message: "Article updated successfully", article });
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

  static async togglePublish(req, res) {
    try {
      const { id } = req.params;

      const article = await articleModels.findById(id);
      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }

      article.isPublished = !article.isPublished;
      await article.save();

      res
        .status(200)
        .json({ message: "Article publication status toggled", article });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      const {
        title,
        content,
        thumbnail,
        category,
        tags,
        isPopular,
        showOnTop,
        showOnHomePage,
        author,
        publishedAt,
      } = req.body;

      if (category) {
        const categoryExists = await categoryModels.findById(category);
        if (!categoryExists) {
          return res.status(400).json({ message: "Invalid category ID" });
        }
      }

      if (author) {
        const authorExists = await authorModels.findById(author);
        if (!authorExists) {
          return res.status(400).json({ message: "Invalid author ID" });
        }
      }

      const updatedArticle = await Article.findByIdAndUpdate(
        id,
        {
          title,
          content,
          thumbnail,
          category,
          tags,
          isPopular,
          showOnTop,
          showOnHomePage,
          author,
        },
        { new: true }
      );

      if (!updatedArticle) {
        return res.status(404).json({ message: "Article not found" });
      }

      res.status(200).json({
        message: "Article updated successfully",
        article: updatedArticle,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;

      const article = await articleModels.findByIdAndDelete(id);
      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }

      res.status(200).json({ message: "Article deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // static async getAll(req, res) {
  //   try {
  //     const {
  //       page = 1,
  //       limit = 10,
  //       sort = "publishedAt",
  //       order = "desc",
  //       search = "",
  //       category = "",
  //       author = "",
  //       tag = "",
  //       startDate = "",
  //       endDate = "",
  //       admin = null,
  //     } = req.query;

  //     const query = {};

  //     // Search filter
  //     if (search) {
  //       query.$or = [
  //         { title: { $regex: search, $options: "i" } },
  //         { content: { $regex: search, $options: "i" } },
  //       ];
  //     }

  //     if (admin !== "true") {
  //       query.isPublished = true;
  //     }

  //     // Category filter (including child categories)
  //     if (category) {
  //       const categoryObj = await categoryModels.findOne({ slug: category });
  //       if (!categoryObj) {
  //         return res.status(200).json({
  //           articles: [],
  //           totalPages: 0,
  //           currentPage: 1,
  //         });
  //       }

  //       const categoryIds = [categoryObj._id];

  //       // Fetch all child categories recursively
  //       const getChildCategories = async (parentId) => {
  //         const children = await categoryModels.find({ parent: parentId });
  //         if (children.length > 0) {
  //           children.forEach((child) => categoryIds.push(child._id));
  //           for (const child of children) {
  //             await getChildCategories(child._id); // Recursively fetch child categories
  //           }
  //         }
  //       };

  //       await getChildCategories(categoryObj._id);

  //       query.category = { $in: categoryIds };
  //     }

  //     // Author filter
  //     if (author) {
  //       const authorInfo = await authorModels.findOne({ username: author });
  //       if (!authorInfo) {
  //         return res.status(200).json({
  //           articles: [],
  //           totalPages: 0,
  //           currentPage: 1,
  //         });
  //       }
  //       query.author = authorInfo._id;
  //     }

  //     // Tag filter
  //     if (tag) {
  //       const normalizedTag = tag.replace(/-/g, " ");
  //       query.tags = {
  //         $elemMatch: {
  //           $regex: `^${normalizedTag}$`,
  //           $options: "i",
  //         },
  //       };
  //     }

  //     // Date range filter
  //     if (startDate || endDate) {
  //       query.createdAt = {};
  //       if (startDate) {
  //         query.createdAt.$gte = new Date(startDate);
  //       }
  //       if (endDate) {
  //         query.createdAt.$lte = new Date(endDate);
  //       }
  //     }

  //     // Fetch articles
  //     const articles = await articleModels
  //       .find(query)
  //       .populate({
  //         path: "category",
  //         select: "name",
  //       })
  //       .populate("author", "name username")
  //       .sort({ [sort]: order })
  //       .skip((page - 1) * limit)
  //       .limit(parseInt(limit));

  //     // Count total articles
  //     const totalArticles = await articleModels.countDocuments(query);

  //     res.status(200).json({
  //       articles,
  //       totalPages: Math.ceil(totalArticles / limit),
  //       currentPage: parseInt(page),
  //     });
  //   } catch (error) {
  //     res.status(500).json({ message: error.message });
  //   }
  // }

  static async getAll(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        sort = "publishedAt",
        order = "desc",
        search = "",
        category = "",
        author = "",
        tag = "",
        startDate = "",
        endDate = "",
        admin = null,
      } = req.query;
  
      const query = {};
  
      // Search filter using text index
      if (search) {
        query.$text = { $search: search };
      }
  
      // Admin filter for published status
      if (admin !== "true") {
        query.isPublished = true;
      }
  
      // Category filter (including child categories)
      if (category) {
        const categoryObj = await categoryModels.findOne({ slug: category });
        if (!categoryObj) {
          return res.status(200).json({
            articles: [],
            totalPages: 0,
            currentPage: 1,
          });
        }
  
        const categoryIds = [categoryObj._id];
  
        // Fetch all child categories recursively
        const getChildCategories = async (parentId) => {
          const children = await categoryModels.find({ parent: parentId });
          if (children.length > 0) {
            children.forEach((child) => categoryIds.push(child._id));
            for (const child of children) {
              await getChildCategories(child._id);
            }
          }
        };
  
        await getChildCategories(categoryObj._id);
  
        query.category = { $in: categoryIds };
      }
  
      // Author filter
      if (author) {
        const authorInfo = await authorModels.findOne({ username: author });
        if (!authorInfo) {
          return res.status(200).json({
            articles: [],
            totalPages: 0,
            currentPage: 1,
          });
        }
        query.author = authorInfo._id;
      }
  
      // Tag filter
      if (tag) {
        const normalizedTag = tag.replace(/-/g, " ");
        query.tags = {
          $elemMatch: {
            $regex: `^${normalizedTag}$`,
            $options: "i",
          },
        };
      }
  
      // Date range filter
      if (startDate || endDate) {
        query.createdAt = {};
        if (startDate) {
          query.createdAt.$gte = new Date(startDate);
        }
        if (endDate) {
          query.createdAt.$lte = new Date(endDate);
        }
      }
  
      // Sorting
      const sortOptions = { [sort]: order === "desc" ? -1 : 1 };
  
      // Fetch articles and count
      const [articles, totalArticles] = await Promise.all([
        articleModels
          .find(query)
          .select("title content publishedAt slug isPublished tags thumbnail")
          .populate("category", "name -_id")
          .populate("author", "name username -_id")
          .sort(sortOptions)
          .skip((page - 1) * limit)
          .limit(parseInt(limit))
          .lean(), // Faster read
        articleModels.countDocuments(query),
      ]);
  
      res.status(200).json({
        articles,
        totalPages: Math.ceil(totalArticles / limit),
        currentPage: parseInt(page),
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  }
  

  static async searchArticle(req, res) {
    console.log('object')
    try {
      const {
        page = 1,
        limit = 10,
        sort = "publishedAt",
        order = "desc",
        search = "",
      } = req.query;
  
      const query = {};
      if (search) {
        // query.$text = { $search: search };
        query.title = { $regex: search, $options: "i" };
      }
  
      // Sorting
      const sortOptions = {};
      sortOptions[sort] = order === "desc" ? -1 : 1;
  
      // Fetch articles and count in parallel
      const [articles, totalArticles] = await Promise.all([
        articleModels
          .find(query)
          .select("title publishedAt slug isPublished tags thumbnail")
          .populate("category", "name -_id")
          .populate("author", "name username -_id")
          .sort(sortOptions)
          .skip((page - 1) * limit)
          .limit(parseInt(limit))
          .lean(),
        articleModels.countDocuments(query),
      ]);
  
      const result = {
        articles,
        totalPages: Math.ceil(totalArticles / limit),
        currentPage: parseInt(page),
      };
  
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  
  

  static async getBySlug(req, res) {
    try {
      const { slug } = req.params;
      const article = await articleModels
        .findOne({
          slug,
        })
        .populate({
          path: "category",
          select: "name",
        })
        .populate("author", "name username");

      res.status(200).json({
        article,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

export default ArticleController;
