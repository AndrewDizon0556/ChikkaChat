import mongoose, { Schema } from "mongoose";
import { IConversation } from "../types";

const ConversationSchema = new Schema<IConversation>(
  {
    type: {
      type: String,
      enum: ["private", "group"],
      required: true,
    },
    name: {
      type: String,
      trim: true,
    },
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    admin_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    last_message: {
      content: String,
      sender_id: { type: Schema.Types.ObjectId, ref: "User" },
      created_at: Date,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

ConversationSchema.index({ members: 1 });
ConversationSchema.index({ updated_at: -1 });

export default mongoose.model<IConversation>(
  "Conversation",
  ConversationSchema
);
