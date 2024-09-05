import express from "express";
import {
    followUnfollowUser,
    getSuggestedUsers,
    getUserProfile,
    updateUserProfile
} from "../controller/user.ctrl.js";
import { protectRoute } from "../middleware/protactRoute.js";

const router = express.Router();

router.get("/profile/:username", protectRoute, getUserProfile);
router.get("/suggested", protectRoute, getSuggestedUsers);
router.post("/follow/:id", protectRoute, followUnfollowUser);
router.post("/update", protectRoute, updateUserProfile);


export default router;