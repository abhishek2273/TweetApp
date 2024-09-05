import express from "express";
import { protectRoute } from "../middleware/protactRoute.js";
import {
    getNotification,
    deleteNotification,
    deleteOneNotification,
} from "../controller/notification.ctrl.js";



const router = express.Router();

router.get("/", protectRoute, getNotification);
router.delete("/", protectRoute, deleteNotification);
router.delete("/:id", protectRoute, deleteOneNotification);



export default router;