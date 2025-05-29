import express from "express"
import { signup, login, fetchUser, logout, getAllUsers } from "../controller/userController.js"

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/fetch-user", fetchUser);
router.post("/logout", logout);
router.get("/getusers", getAllUsers);

export default router;