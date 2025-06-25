import multer from "multer";

// This stores files in memory buffer
const upload = multer({ storage: multer.memoryStorage() });

export const avatarUpload = upload.single("avatar");
export const thumbnailUpload = upload.single("thumbnail");
export const adsUpload = upload.single("thumbnail");