import { __dirname } from "../constant/dir.js";
import path from 'path'

export const getFilePath = (filename) => path.join(__dirname, '..', 'uploads/avatar', filename);
export const getFilePath2 = (filename) => path.join(__dirname, '..', 'uploads/article', filename);
export const getFilePath3 = (filename) => path.join(__dirname, '..', 'uploads/ads', filename);