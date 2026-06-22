import { Router } from "express";
import {
  createConversation,
  getConversations,
  getConversationById,
  updateConversation,
  deleteConversation,
} from "../controllers/conversation.controller";
import { verifyToken } from "../middleware/auth.middleware";

const router = Router();

router.use(verifyToken);

router.post("/", createConversation);
router.get("/", getConversations);
router.get("/:id", getConversationById);
router.put("/:id", updateConversation);
router.delete("/:id", deleteConversation);

export default router;
