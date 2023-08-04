import { Router } from "express";
import { createRoom } from "../controllers/chat";
const router = Router();

router.route("/create").post(createRoom);
// router.route("/getRoomId").post(getChatRoomId);

export default router;
