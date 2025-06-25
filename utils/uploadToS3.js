// utils/uploadToS3.ts
import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { randomUUID } from "crypto";
import path from "path";

export const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export async function uploadToS3(fileBuffer, originalName, folder) {
  const ext = path.extname(originalName);
  const baseName = path.basename(originalName, ext);
  const s3Key = `images/${folder}/${baseName}-${Date.now()}${ext}`;

  const upload = new Upload({
    client: s3Client,
    params: {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: s3Key,
      Body: fileBuffer,
      ContentType: `image/${ext.replace(".", "")}`,
    },
  });

  await upload.done();

  const relativePath = s3Key.replace(/^images/, "");
  return relativePath;
}
