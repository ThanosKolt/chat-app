import { Router } from "express";
import {
  getUsers,
  register,
  login,
  deleteUser,
  getUserById,
  getUserByUsername,
  udpateUser,
  searchUser,
} from "../controllers/user";
const router = Router();

router.route("/").get(getUsers);
router.route("/:id").get(getUserById).delete(deleteUser).put(udpateUser);
router.route("/username/:username").get(getUserByUsername);
router.post("/login", login);
router.post("/register", register);
router.post("/search", searchUser);

export default router;
