import { Router } from "express";
import {
  createOrUpdateProfile,
  getUserById,
  updateUser,
  searchUsers,
} from "../controllers/auth.controller";
import { verifyToken } from "../middleware/auth.middleware";

const router = Router();

router.post("/profile", createOrUpdateProfile);
router.get("/search", verifyToken, searchUsers);
router.get("/:id", verifyToken, getUserById);
router.put("/:id", verifyToken, updateUser);

export default router;
