import { Router } from "express";
import { uploadFile, getFile } from "../controllers/upload.controller";
import { verifyToken } from "../middleware/auth.middleware";

const router = Router();

router.use(verifyToken);

router.post("/", uploadFile);
router.get("/:id", getFile);

export default router;
