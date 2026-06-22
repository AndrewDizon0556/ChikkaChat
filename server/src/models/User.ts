import mongoose, { Schema } from "mongoose";
import { IUser } from "../types";

const UserSchema = new Schema<IUser>(
  {
    firebase_uid: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    display_name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    photo_url: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["online", "offline"],
      default: "offline",
    },
    last_seen: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: false },
  }
);

export default mongoose.model<IUser>("User", UserSchema);
