import mongoose from "mongoose";
import { JSDOM } from "jsdom";
import articleModels from "./models/article.models.js";

const DB_URI = "mongodb://localhost:27017/eastern-mirror"; // Replace with your DB URI

// Function to extract plain text from HTML content
const extractPlainText = (html) => {
  const dom = new JSDOM(html);
  return dom.window.document.body.textContent.trim() || "";
};

// Migration function to update plainTextContent for all existing posts
const migratePlainTextContent = async (batchSize = 1000) => {
  try {
    await mongoose.connect(DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    let updatedCount = 0;

    while (true) {
      const posts = await articleModels
        .find({ plainTextContent: { $exists: false } })
        .limit(batchSize);

      if (posts.length === 0) break;

      const bulkOps = posts.map(({ _id, content }) => ({
        updateOne: {
          filter: { _id },
          update: { $set: { plainTextContent: extractPlainText(content) } },
        },
      }));

      await articleModels.bulkWrite(bulkOps);
      updatedCount += posts.length;
      console.log(`Updated ${updatedCount} documents...`);
    }

    console.log("Migration completed successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    await mongoose.connection.close();
  }
};

migratePlainTextContent();
