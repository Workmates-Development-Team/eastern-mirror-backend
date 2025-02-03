import mongoose from "mongoose";

const adsSchema = new mongoose.Schema(
  {
    imageUrl: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Ad", adsSchema);
