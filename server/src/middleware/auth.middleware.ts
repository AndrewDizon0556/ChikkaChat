import { Request, Response, NextFunction } from "express";
import { auth } from "../config/firebase";
import User from "../models/User";

export interface AuthRequest extends Request {
  user?: {
    uid: string;
    mongoId: string;
  };
}

export const verifyToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ error: "No token provided" });
    return;
  }

  try {
    const token = authHeader.split("Bearer ")[1];
    const decoded = await auth.verifyIdToken(token);
    const user = await User.findOne({ firebase_uid: decoded.uid });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    req.user = {
      uid: decoded.uid,
      mongoId: user._id.toString(),
    };
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
};
