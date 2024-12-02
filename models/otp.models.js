import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const otpSchema = new mongoose.Schema(
  {
    phoneNumber: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    isUsed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Hash the OTP before saving
otpSchema.pre("save", async function (next) {
  if (!this.isModified("otp")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.otp = await bcrypt.hash(this.otp, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Check if OTP is valid
otpSchema.methods.isValid = function (otp) {
  return !this.isUsed && this.expiresAt > Date.now() && bcrypt.compareSync(otp, this.otp);
};

export default mongoose.model("OTP", otpSchema);
