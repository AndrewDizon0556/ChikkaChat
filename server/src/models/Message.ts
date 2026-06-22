import mongoose, { Schema } from "mongoose";
import { IMessage } from "../types";

const MessageSchema = new Schema<IMessage>(
  {
    conversation_id: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
      index: true,
    },
    sender_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    message_type: {
      type: String,
      enum: ["text", "image", "file"],
      default: "text",
    },
    file_url: {
      type: String,
    },
    reply_to: {
      type: Schema.Types.ObjectId,
      ref: "Message",
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

MessageSchema.index({ conversation_id: 1, created_at: -1 });

export default mongoose.model<IMessage>("Message", MessageSchema);
