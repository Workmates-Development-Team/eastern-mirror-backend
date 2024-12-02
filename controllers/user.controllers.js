import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { loginSchema, registerSchema } from "../middlewares/inputValidation.js";
import { z } from "zod";
import userModels from "../models/user.models.js";
import sendOTPSMS, { getOtp } from "../utils/sendOtp.js";
import otpModels from "../models/otp.models.js";

dotenv.config();

class UserController {
  static async create(req, res) {
    try {
      const { firstName, lastName, email, userType, password, phoneNumber } =
        registerSchema.parse(req.body);

      let user = await userModels.findOne({ email });
      if (user) {
        return res.status(400).json({ message: "User already exists" });
      }

      user = await userModels.findOne({ phoneNumber });
      if (user) {
        return res.status(400).json({ message: "User already exists" });
      }

      user = new userModels({
        firstName,
        lastName,
        userType,
        email,
        password,
        phoneNumber,
      });
      await user.save();

      res.status(201).json({
        message: "User craeted successfully",
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: error.errors[0]?.message || "Validation error",
        });
      }

      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = loginSchema.parse(req.body);

      const admin = await userModels.findOne({ email });
      if (!admin) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      const isMatch = await admin.comparePassword(password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      // const otp = getOtp();
      // const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
      // const newOtp = new otpModels({
      //   phoneNumber: admin.phoneNumber,
      //   otp,
      //   expiresAt: otpExpiry,
      // });

      // await newOtp.save();

      // await sendOTPSMS(admin.phoneNumber, otp);

      // console.log(otp);
      const token = jwt.sign({ id: admin.id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });

      res.status(200).json({
        // message: "OTP sent to your phone number",
        // phoneNumber: admin.phoneNumber,
        token,
        admin: { id: admin.id, name: admin.name, email: admin.email },
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: error.errors[0]?.message || "Validation error",
        });
      }

      console.log(error);

      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async verifyOtp(req, res) {
    const { phoneNumber, otp } = req.body;

    try {
      const otpRecord = await otpModels.findOne({ phoneNumber }).sort({
        createdAt: -1,
      });

      if (!otpRecord) {
        return res.status(404).json({ message: "OTP not found or expired." });
      }

      // Check if OTP is valid
      if (!otpRecord.isValid(otp)) {
        return res.status(400).json({ message: "Invalid or expired OTP." });
      }

      // Mark OTP as used
      otpRecord.isUsed = true;
      await otpRecord.save();

      const admin = await userModels.findOne({ phoneNumber });
      if (!admin) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign({ id: admin.id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });

      return res.status(200).json({
        token,
        admin: { id: admin.id, name: admin.name, email: admin.email },
      });
    } catch (error) {
      return res.status(500).json({ message: "Error verifying OTP", error });
    }
  }

  static async getProfile(req, res) {
    try {
      const user = req.user;
      user.password = undefined;
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async getAllUser(req, res) {
    try {
      const users = await userModels
        .find({ isDeleted: false })
        .select("-password");
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async updateProfile(req, res) {
    try {
      const { firstName, lastName, userType } = req.body;
      const { id } = req.params;

      const user = await userModels.findById(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      user.firstName = firstName || user.firstName;
      user.lastName = lastName || user.lastName;
      user.userType = userType || user.userType;

      await user.save();

      res.status(200).json({
        message: "Profile updated successfully",
        user: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          userType: user.userType,
        },
      });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  // static async changePassword(req, res) {
  //   try {
  //     const { newPassword } = req.body;
  //     const { id } = req.params;

  //     const user = await userModels.findById(id);

  //     user.password = newPassword;
  //     await user.save();

  //     res.status(200).json({ message: "Password changed successfully" });
  //   } catch (error) {
  //     res.status(500).json({ message: "Internal Server Error" });
  //   }
  // }

  static async changePassword(req, res) {
    try {
      const { newPassword } = req.body;
      const { id } = req.params;

      const loggedInUser = req.user;

      const user = await userModels.findById(id);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (loggedInUser.role === "editor") {
        if (user.role !== "publisher") {
          return res
            .status(403)
            .json({ message: "You can only change passwords of publishers" });
        }
      }

      user.password = newPassword;
      await user.save();

      res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
      console.error("Error changing password:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async changeMyPassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;

      const user = await userModels.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({ message: "Incorrect current password" });
      }

      user.password = newPassword;
      await user.save();

      res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async deleteUser(req, res) {
    try {
      let user = await userModels.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      await userModels.findByIdAndDelete(req.params.id);

      res.status(200).json({
        message: "User deleted successfully",
      });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
}

export default UserController;
