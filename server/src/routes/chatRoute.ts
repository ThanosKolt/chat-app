import { Router } from "express";
import { createRoom, getRoomId } from "../controllers/chat";
const router = Router();

router.route("/get").post(getRoomId);
router.route("/create").post(createRoom);

export default router;
