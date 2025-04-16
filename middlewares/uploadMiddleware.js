import multer from "multer";
import fs from "fs";
import path from "path";
import { __dirname } from "../constant/dir.js";

const ensureDirectoryExistence = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const avatarStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(__dirname, "..", "uploads/avatar");
    ensureDirectoryExistence(dir);
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  },
});

// Middleware to handle file uploads
export const avatarUpload = multer({ storage: avatarStorage });

const thumbnailStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, "..", "uploads/article");
    ensureDirectoryExistence(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    const filename = `${name}-${Date.now()}${ext}`;
    cb(null, filename);
  },
});

const adsStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, "..", "uploads/ads");
    ensureDirectoryExistence(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = Date.now() + ext;
    cb(null, filename);
  },
});

export const thumbnailUpload = multer({ storage: thumbnailStorage });
export const adsUpload = multer({ storage: adsStorage });
