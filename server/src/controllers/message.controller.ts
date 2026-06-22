import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import Message from "../models/Message";
import Conversation from "../models/Conversation";

export const sendMessage = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { conversation_id, content, message_type, file_url, reply_to } =
      req.body;

    const message = await Message.create({
      conversation_id,
      sender_id: req.user!.mongoId,
      content,
      message_type: message_type || "text",
      file_url,
      reply_to,
    });

    await Conversation.findByIdAndUpdate(conversation_id, {
      last_message: {
        content,
        sender_id: req.user!.mongoId,
        created_at: new Date(),
      },
    });

    const populated = await message.populate(
      "sender_id",
      "display_name photo_url"
    );
    res.status(201).json(populated);
  } catch {
    res.status(500).json({ error: "Failed to send message" });
  }
};

export const getMessages = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { conversationId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 30;
    const skip = (page - 1) * limit;

    const messages = await Message.find({ conversation_id: conversationId })
      .populate("sender_id", "display_name photo_url")
      .populate("reply_to", "content sender_id")
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Message.countDocuments({
      conversation_id: conversationId,
    });

    res.json({
      messages: messages.reverse(),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};

export const deleteMessage = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const message = await Message.findOneAndDelete({
      _id: req.params.id,
      sender_id: req.user!.mongoId,
    });

    if (!message) {
      res.status(404).json({ error: "Message not found" });
      return;
    }

    res.json({ message: "Message deleted" });
  } catch {
    res.status(500).json({ error: "Failed to delete message" });
  }
};

export const searchMessages = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const query = req.query.q as string;
    const conversationId = req.query.conversationId as string;

    if (!query) {
      res.status(400).json({ error: "Search query required" });
      return;
    }

    const filter: Record<string, unknown> = {
      content: { $regex: query, $options: "i" },
    };

    if (conversationId) {
      filter.conversation_id = conversationId;
    }

    const messages = await Message.find(filter)
      .populate("sender_id", "display_name photo_url")
      .sort({ created_at: -1 })
      .limit(50);

    res.json(messages);
  } catch {
    res.status(500).json({ error: "Search failed" });
  }
};
