import { Router } from "express";
import {
  createRoom,
  getRoomId,
  getRoomInfo,
  getRoomsByUser,
} from "../controllers/chat";
const router = Router();

router.route("/getRoomId").post(getRoomId);
router.route("/create").post(createRoom);
router.route("/getRoomsByUser").post(getRoomsByUser);
router.route("/getRoomInfo").post(getRoomInfo);

export default router;
