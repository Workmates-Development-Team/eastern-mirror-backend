import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
  {
    link: {
      type: String,
      required: true,
    },

    thumbnail: {
      type: String,
      required: true,
    },

  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Video", videoSchema);
