import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import Notification from "../models/notification.model.js"
import { v2 as cloudinary } from "cloudinary";


const createPost = async (req, res) => {
    try {
        const { text } = req.body;
        let { img } = req.body;

        const userId = req.user._id.toString();

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "user not found/post ctrl" });

        if (!text && !img) return res.status(400).json({ message: "post must have text or image" });

        if (img) {
            const uploadImage = await cloudinary.uploader.upload(img);
            img = uploadImage.secure_url;
        }

        const newPost = new Post({
            user: userId,
            text,
            img
        })
        await newPost.save();
        res.status(201).json(newPost);

    } catch (error) {
        console.log("error in create post ctrl:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}

const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) res.status(404).json({ error: "post not found" });
        if (post.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ error: "You are not authorized to delete this post" });
        }

        if (post.img) {
            const imgId = post.img.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(imgId);
        }

        await Post.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        console.log("Error in deletePost controller: ", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

const commentPost = async (req, res) => {
    try {
        const { text } = req.body;
        const postId = req.params.id;
        const userId = req.user._id;

        if (!text) return res.status(400).json({ error: "text field is required" });

        const post = await Post.findById(postId);
        if (!post) return res.status(400).json({ error: "post not found" });

        const comment = { user: userId, text };
        post.comments.push(comment);
        await post.save();

        res.status(200).json({ comment: post });

    } catch (error) {
        console.log("Error in commentPost controller: ", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

const likeUnlikePost = async (req, res) => {
    try {
        const userId = req.user._id;
        const { id: postId } = req.params;

        const post = await Post.findById(postId);
        if (!post) res.status(400).json({ error: "post not found" });

        const userLikedPost = post.likes.includes(userId);
        if (userLikedPost) {
            //unlike the post if liked
            await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
            await User.updateOne({ _id: userId }, { $pull: { likedPosts: postId } });
            res.status(200).json({ error: `${req.user.fullName} unliked your post` });
        }
        else {
            // like the post
            post.likes.push(userId);
            await User.updateOne({ _id: userId }, { $push: { likedPosts: postId } });
            await post.save();

            const notification = new Notification({
                from: userId,
                to: post.user,
                type: "like"
            })
            await notification.save();
            res.status(200).json({ error: `${req.user.fullName} like your post` });
        }

    } catch (error) {
        console.log("Error in likeUnlike controller: ", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .sort({ createdAt: -1 })
            .populate("user")
            .populate({ path: "comments.user" });

        if (posts.length === 0) return res.status(205).json([]);

        res.status(200).json(posts);
    } catch (error) {
        console.log("Error in getAllPost controller: ", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

const getLikedPosts = async (req, res) => {
    const userId = req.params.id;
    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: 'user not found' });

        const likedPosts = await Post
            .find({ _id: { $in: user.likedPosts } })
            .populate("user")
            .populate({ path: "comments.user" });

        res.status(200).json(likedPosts);

    } catch (error) {
        console.log("Error in getLikedPost controller: ", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

const getFollowingPostUserFollows = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: "user not found" });

        const following = user.following;
        const feedPosts = await Post
            .find({ user: { $in: following } })
            .sort({ createdAt: -1 })
            .populate("user")
            .populate({ path: "comments.user" });

        res.status(200).json({
            data: feedPosts,
        });

    } catch (error) {
        console.log("Error in folloeingPost controller: ", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

const getUserPosts = async (req, res) => {
    try {
        const { username } = req.params;

        const user = await User.findOne({ username });
        if (!user) return res.status(404).json({ error: "user not found" });

        const posts = await Post
            .find({ user: user._id })
            .sort({ createdAt: -1 })
            .populate("user")
            .populate({ path: "comments.user" });

        res.status(200).json(posts);

    } catch (error) {
        console.log("Error in getUserPosts controller: ", error);
        res.status(500).json({ error: "Internal server error" });
    }
}


export {
    createPost,
    deletePost,
    likeUnlikePost,
    commentPost,
    getAllPosts,
    getLikedPosts,
    getFollowingPostUserFollows,
    getUserPosts,
}