export interface User {
  _id: string;
  firebase_uid: string;
  display_name: string;
  email: string;
  photo_url: string;
  status: "online" | "offline";
  last_seen: string;
  created_at: string;
}

export interface Conversation {
  _id: string;
  type: "private" | "group";
  name?: string;
  members: User[];
  admin_id?: string;
  last_message?: {
    content: string;
    sender_id: string;
    created_at: string;
  };
  created_at: string;
  updated_at: string;
}

export interface Message {
  _id: string;
  conversation_id: string;
  sender_id: User;
  content: string;
  message_type: "text" | "image" | "file";
  file_url?: string;
  reply_to?: Message;
  created_at: string;
  updated_at: string;
}

export interface PaginatedMessages {
  messages: Message[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
