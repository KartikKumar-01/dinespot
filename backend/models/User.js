import { model, Schema } from "mongoose";
const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: { type: String, required: true, minLength: 6 },
    phone: { type: String, minLength: 6, trim: true },
    role: { type: String, enum: ["user", "admin", "owner"], default: "user" },
  },
  { timestamps: true }
);

userSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.password;
    return ret;
  },
});

export const User = model("User", userSchema);
