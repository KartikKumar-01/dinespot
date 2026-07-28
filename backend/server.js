import { configDotenv } from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import authRouter from "./routes/authRoutes.js";
import restaurantRouter from "./routes/restaurantRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";
import connectDB from "./config/db.js";
import ownerRouter from "./routes/ownerRoutes.js";

configDotenv();
const app = express();
const port = process.env.PORT || 3000;
console.log("PORT from env:", process.env.PORT);

connectDB();
app.use(
  cors({
    origin: "http://localhost:5174",
    credentialsx: true,
  })
);

app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hello");
});

app.use("/api/auth", authRouter);
app.use("/api/restaurant", restaurantRouter);
app.use("/api/bookings", bookingRouter);
app.use("/api/owner", ownerRouter);

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
