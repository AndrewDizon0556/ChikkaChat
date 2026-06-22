import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";

export const uploadFile = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  // File uploads go directly to Firebase Storage from the client.
  // This endpoint exists for any server-side upload processing needed later.
  res.status(501).json({
    message:
      "File uploads are handled client-side via Firebase Storage. Use the returned download URL in message payloads.",
  });
};

export const getFile = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  res.status(501).json({
    message: "Files are served directly from Firebase Storage URLs.",
  });
};
