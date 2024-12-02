import { model, Schema } from "mongoose";

const eventSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },

    slug: {
      type: String,
      required: true,
    },

    articles: [
      {
        type: Schema.Types.ObjectId,
        ref: "Article",
      },
    ],

    status: {
      type: String,
      enum: ["ongoing", "completed"],
      default: "ongoing",
    },
  },
  {
    timestamps: true,
  }
);

export default model("Event", eventSchema);
