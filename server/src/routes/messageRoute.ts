import { Router } from "express";
import { getRoomMessages, sendMessage } from "../controllers/message";
const router = Router();

router.route("/send").post(sendMessage);
router.route("/getRoomMessages").post(getRoomMessages);

export default router;
