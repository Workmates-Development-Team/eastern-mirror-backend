import { z } from "zod";

export const registerSchema = z.object({
  firstName: z
    .string({
      required_error: "First name is required",
    })
    .min(1, {
      message: "First name is required",
    }),

  lastName: z
    .string({
      required_error: "Last name is required",
    })
    .min(1, {
      message: "Last name is required",
    }),

  email: z
    .string({
      required_error: "Email is required",
    })
    .email("Invalid email format"),

  phoneNumber: z.string({
    required_error: "Phone number is required",
  }),

  password: z
    .string({
      required_error: "Password is required",
    })
    .min(6, "Password must be at least 6 characters long"),

  userType: z
    .enum(["admin", "editor", "publisher", "user"], {
      invalid_type_error:
        "Role must be one of 'admin', 'editor', 'publisher', or 'user'",
    })
    .optional(),
});

export const loginSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
    })
    .email("Invalid email format"),
  password: z
    .string({
      required_error: "Password is required",
    })
    .min(1, "Password is required"),
});

export const categorySchema = z.object({
  name: z
    .string({
      required_error: "Category name is required",
    })
    .min(1, "Category name is required"),
  parent: z.string().optional(),
});

export const authorSchema = z.object({
  name: z
    .string({
      required_error: "Author name is required",
    })
    .min(1),
  email: z
    .string({
      required_error: "Email is required",
    })
    .email("Invalid email format"),
});

export const articleSchema = z.object({
  title: z
    .string({
      required_error: "Title is required",
    })
    .min(1, "Title is required"),
  slug: z
    .string({
      required_error: "slug is required",
    })
    .min(1, "slug is required"),
  content: z
    .string({
      required_error: "Content is required",
    })
    .min(1, "Content is required"),
  thumbnail: z.string().optional(),
  category: z
    .string({
      required_error: "Category ID is required",
    })
    .min(1, "Category ID is required"),
  tags: z.string().optional(),
  publishedAt: z.string().optional(),
  isPublished: z.boolean().optional(),
  author: z
    .string({
      required_error: "Author ID is required",
    })
    .min(1, "Author ID is required"),
});

export const videoSchema = z.object({
  thumbnail: z
    .string({
      required_error: "Thumbnail is required",
    })
    .min(1, "Thumnail is required"),

  link: z
    .string({
      required_error: "Link is required",
    })
    .url("Link must be a valid URL"),
});
