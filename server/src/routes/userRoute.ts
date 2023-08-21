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
import { auth } from "../middleware/auth";
const router = Router();

router.route("/").get(auth, getUsers);
router
  .route("/:id")
  .get(auth, getUserById)
  .delete(auth, deleteUser)
  .put(auth, udpateUser);
router.route("/username/:username").get(auth, getUserByUsername);
router.post("/login", login);
router.post("/register", register);
router.post("/search", auth, searchUser);

export default router;
