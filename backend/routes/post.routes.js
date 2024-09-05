import express from "express";
import { protectRoute } from "../middleware/protactRoute.js";
import {
    commentPost,
    createPost,
    deletePost,
    getAllPosts,
    getFollowingPostUserFollows,
    getLikedPosts,
    getUserPosts,
    likeUnlikePost
} from "../controller/post.ctrl.js";

const postRouter = express.Router();

postRouter.post("/create", protectRoute, createPost);
postRouter.post("/like/:id", protectRoute, likeUnlikePost);
postRouter.post("/comment/:id", protectRoute, commentPost);
postRouter.delete("/:id", protectRoute, deletePost);

postRouter.get("/all", protectRoute, getAllPosts)
postRouter.get("/following", protectRoute, getFollowingPostUserFollows)
postRouter.get("/likes/:id", protectRoute, getLikedPosts);
postRouter.get("/user/:username", protectRoute, getUserPosts);


export default postRouter;