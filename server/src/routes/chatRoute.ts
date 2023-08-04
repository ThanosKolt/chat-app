import { Router } from "express";
import { createRoom, getRoomId, getRoomsByUser } from "../controllers/chat";
const router = Router();

router.route("/getRoomId").post(getRoomId);
router.route("/create").post(createRoom);
router.route("/getRoomsByUser").post(getRoomsByUser);

export default router;
