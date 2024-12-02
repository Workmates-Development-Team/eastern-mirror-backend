import jwt from "jsonwebtoken";
import userModels from "../models/user.models.js";

export default async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader) {
      return res
        .status(401)
        .json({ message: "No token, authorization denied" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ message: "No token, authorization denied" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded)
      return res
        .status(401)
        .json({ message: "No token, authorization denied" });

    const user = await userModels.findById(decoded.id);
    if (!user)
      return res
        .status(401)
        .json({ message: "No token, authorization denied" });

    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    if (error.name === "JsonWebTokenError") {
      return res
        .status(401)
        .json({ message: "Invalid token, authorization denied" });
    }
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "Token expired, authorization denied" });
    }

    res.status(500).json({ message: "Internal Server Error" });
  }
}
