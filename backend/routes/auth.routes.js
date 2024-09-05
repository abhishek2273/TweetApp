import express from "express";
import { getUser, login, logout, signup } from "../controller/auth.ctrl.js";
import { protectRoute } from "../middleware/protactRoute.js";

const router = express.Router();

router.post("/signup", signup)
router.post("/login", login)
router.post("/logout", logout)

router.get("/me", protectRoute, getUser)

export default router;