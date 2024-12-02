import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./config/db.config.js";
import rootRoute from "./routes/index.routes.js";


const app = express();
const port = process.env.PORT || 5000;

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("uploads"));
app.use(cors());

app.use("/api/v1", rootRoute);

app.use("/health", (req, res) => res.send("Health Check-up okay"));

// DB connection
connectDB();
app.listen(port, () => console.log(`Server is running on port: ${port}`));
