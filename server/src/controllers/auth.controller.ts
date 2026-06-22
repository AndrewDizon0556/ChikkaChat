import { Request, Response } from "express";
import { auth } from "../config/firebase";
import User from "../models/User";
import { AuthRequest } from "../middleware/auth.middleware";

export const createOrUpdateProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ error: "No token provided" });
    return;
  }

  try {
    const token = authHeader.split("Bearer ")[1];
    const decoded = await auth.verifyIdToken(token);

    const user = await User.findOneAndUpdate(
      { firebase_uid: decoded.uid },
      {
        firebase_uid: decoded.uid,
        display_name: req.body.display_name || decoded.name || "User",
        email: decoded.email,
        photo_url: req.body.photo_url || decoded.picture || "",
      },
      { upsert: true, new: true }
    );

    res.status(200).json(user);
  } catch {
    res.status(500).json({ error: "Failed to create/update profile" });
  }
};

export const getUserById = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const user = await User.findById(req.params.id).select("-__v");
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.json(user);
  } catch {
    res.status(500).json({ error: "Failed to fetch user" });
  }
};

export const updateUser = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { display_name, photo_url } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { display_name, photo_url },
      { new: true }
    );
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.json(user);
  } catch {
    res.status(500).json({ error: "Failed to update user" });
  }
};

export const searchUsers = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const query = req.query.q as string;
    if (!query) {
      res.status(400).json({ error: "Search query required" });
      return;
    }

    const users = await User.find({
      _id: { $ne: req.user?.mongoId },
      $or: [
        { display_name: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
      ],
    }).select("display_name email photo_url status");

    res.json(users);
  } catch {
    res.status(500).json({ error: "Search failed" });
  }
};
