import { Router } from "express";
import {
  sendMessage,
  getMessages,
  deleteMessage,
  searchMessages,
} from "../controllers/message.controller";
import { verifyToken } from "../middleware/auth.middleware";

const router = Router();

router.use(verifyToken);

router.post("/", sendMessage);
router.get("/search", searchMessages);
router.get("/:conversationId", getMessages);
router.delete("/:id", deleteMessage);

export default router;
