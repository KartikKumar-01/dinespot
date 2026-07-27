import { configDotenv } from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import authRouter from "./routes/authRoutes.js";

configDotenv();
const app = express();
const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hello");
});

app.use("/api/auth", authRouter);

app.use((err, req, res, next) => {
  console.error("Unhandle error", err);
  res.status(500).json({
    message: err.message || "Internal server error",
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
});

app.listen(port, () => {
  console.log(`Server running on ${port}`);
});
