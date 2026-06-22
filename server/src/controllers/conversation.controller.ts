import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import Conversation from "../models/Conversation";

export const createConversation = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { type, name, members } = req.body;
    const userId = req.user!.mongoId;

    if (type === "private") {
      const existing = await Conversation.findOne({
        type: "private",
        members: { $all: [userId, ...members], $size: 2 },
      });

      if (existing) {
        res.json(existing);
        return;
      }
    }

    const conversation = await Conversation.create({
      type,
      name: type === "group" ? name : undefined,
      members: [userId, ...members],
      admin_id: type === "group" ? userId : undefined,
    });

    res.status(201).json(conversation);
  } catch {
    res.status(500).json({ error: "Failed to create conversation" });
  }
};

export const getConversations = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const conversations = await Conversation.find({
      members: req.user!.mongoId,
    })
      .populate("members", "display_name photo_url status")
      .sort({ updated_at: -1 });

    res.json(conversations);
  } catch {
    res.status(500).json({ error: "Failed to fetch conversations" });
  }
};

export const getConversationById = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const conversation = await Conversation.findById(req.params.id).populate(
      "members",
      "display_name photo_url status"
    );

    if (!conversation) {
      res.status(404).json({ error: "Conversation not found" });
      return;
    }

    res.json(conversation);
  } catch {
    res.status(500).json({ error: "Failed to fetch conversation" });
  }
};

export const updateConversation = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { name, members } = req.body;
    const conversation = await Conversation.findByIdAndUpdate(
      req.params.id,
      { name, members },
      { new: true }
    );

    if (!conversation) {
      res.status(404).json({ error: "Conversation not found" });
      return;
    }

    res.json(conversation);
  } catch {
    res.status(500).json({ error: "Failed to update conversation" });
  }
};

export const deleteConversation = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const conversation = await Conversation.findByIdAndDelete(req.params.id);
    if (!conversation) {
      res.status(404).json({ error: "Conversation not found" });
      return;
    }
    res.json({ message: "Conversation deleted" });
  } catch {
    res.status(500).json({ error: "Failed to delete conversation" });
  }
};
