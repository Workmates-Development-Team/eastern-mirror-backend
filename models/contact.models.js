import mongoose from "mongoose";

const ContactSchema = new mongoose.Schema(
  {
    letterToEditor: {
      type: String,
      required: true,
    },
    adQuery: {
      type: String,
      required: true,
    },
    ePaperQuery: {
      type: String,
      required: true,
    },
    customerCare: {
      type: String,
      required: true,
    },
    officeAddress: {
      type: String,
      required: true,
    },
    refundsQueries: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("ContactSetting", ContactSchema);
