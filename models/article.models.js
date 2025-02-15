import mongoose from "mongoose";
import schedule from "node-schedule";

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    content: {
      type: String,
      required: true,
    },

    thumbnail: {
      type: String,
    },

    excerpt: {
      type: String,
    },

    metaKeyWord: [{ type: String }],

    category: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
      },
    ],

    tags: [{ type: String }],

    isPublished: {
      type: Boolean,
      default: false,
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Author",
      required: true,
    },

    slug: {
      type: String,
      required: true,
    },

    plainTextContent: {
      type: String,
      required: true,
    },

    publishedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

articleSchema.index({ title: "text", plainTextContent: "text" });
articleSchema.index({ slug: 1 });
articleSchema.index({ publishedAt: -1 });
articleSchema.index({ category: 1 });
articleSchema.index({ author: 1 });
articleSchema.index({ isPublished: 1 });

articleSchema.pre("save", function (next) {
  const now = new Date();

  if (this.publishedAt > now) {
    console.log(`Scheduling publish job for ${this.publishedAt}`);

    this.isPublished = false;

    // Convert `publishedAt` to UTC
    const publishedAtUtc = new Date(this.publishedAt).toISOString();

    console.log(`Job scheduled for UTC time: ${publishedAtUtc}`);

    // Schedule job to publish the article at the given time
    schedule.scheduleJob(publishedAtUtc, async () => {
      console.log(`Publishing article with ID: ${this._id} at ${new Date()}`);

      await mongoose.model("Article").findByIdAndUpdate(this._id, {
        isPublished: true,
      });
    });
  } else {
    console.log(`Article published immediately: ${this.publishedAt}`);
  }

  next();
});

export default mongoose.model("Article", articleSchema);
