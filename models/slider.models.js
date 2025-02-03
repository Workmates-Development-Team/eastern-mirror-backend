import mongoose from "mongoose";

const sliderSchema = new mongoose.Schema(
  {
    items: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ad",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Slider", sliderSchema);
