import { Document, Types } from "mongoose";

export interface IUser extends Document {
  firebase_uid: string;
  display_name: string;
  email: string;
  photo_url: string;
  status: "online" | "offline";
  last_seen: Date;
  created_at: Date;
}

export interface IConversation extends Document {
  type: "private" | "group";
  name?: string;
  members: Types.ObjectId[];
  admin_id?: Types.ObjectId;
  last_message?: {
    content: string;
    sender_id: Types.ObjectId;
    created_at: Date;
  };
  created_at: Date;
  updated_at: Date;
}

export interface IMessage extends Document {
  conversation_id: Types.ObjectId;
  sender_id: Types.ObjectId;
  content: string;
  message_type: "text" | "image" | "file";
  file_url?: string;
  reply_to?: Types.ObjectId;
  created_at: Date;
  updated_at: Date;
}

export interface DecodedToken {
  uid: string;
  email?: string;
  name?: string;
  picture?: string;
}
