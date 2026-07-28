import mongoose from "mongoose";
import { User } from "../models/User.js";
import bcrypt from "bcrypt";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    const existingAdmin = await User.findOne({ role: "admin" });
    if (existingAdmin) {
      console.log(
        `Admin already present with name: ${existingAdmin.name} and email: ${existingAdmin.email}`
      );
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash("admin123", salt);
      const admin = await User.create({
        name: "Admin",
        email: "admin@gmail.com",
        password: hashPassword,
        role: "admin",
        phone: "+91 9438352897",
      });
      console.log("Admin created.");
    }
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
