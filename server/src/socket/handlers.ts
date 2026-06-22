import { Server, Socket } from "socket.io";
import Message from "../models/Message";
import Conversation from "../models/Conversation";

interface SendMessagePayload {
  conversationId: string;
  content: string;
  messageType?: "text" | "image" | "file";
  fileUrl?: string;
  replyTo?: string;
}

export const registerMessageHandlers = (io: Server, socket: Socket): void => {
  socket.on("message:send", async (payload: SendMessagePayload) => {
    const userId = socket.data.userId as string;

    try {
      const message = await Message.create({
        conversation_id: payload.conversationId,
        sender_id: userId,
        content: payload.content,
        message_type: payload.messageType || "text",
        file_url: payload.fileUrl,
        reply_to: payload.replyTo,
      });

      const populated = await message.populate("sender_id", "display_name photo_url");

      await Conversation.findByIdAndUpdate(payload.conversationId, {
        last_message: {
          content: payload.content,
          sender_id: userId,
          created_at: new Date(),
        },
      });

      io.to(payload.conversationId).emit("message:receive", populated);
    } catch (error) {
      socket.emit("error", { message: "Failed to send message" });
    }
  });
};
