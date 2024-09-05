import mongoose from "mongoose";
import validator from "validator";

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, "username field is required"],
            unique: [true, "This username not available"],
            minlength: [4, "please enter minimum 4 letter"],
            maxlength: [8, "username cannot exceed to 8"],
            lowercase: true,
            trim: true,
            index: true
        },
        email: {
            type: String,
            required: [true, "Email field is required"],
            unique: true,
            validate: [validator.isEmail, "Please enter a valid email"]
        },
        fullName: {
            type: String,
            required: true,
            trim: true,
            index: true
        },
        password: {
            type: String,
            required: [true, "Please enter password"],
            minlength: [6, "please enter minimum 6 letter"],
            select: false
        },
        followers: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: []
        }],
        following: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: []
        }],
        profileImg: {
            type: String,
            default: '',
        },
        coverImg: {
            type: String,
            default: '',
        },
        bio: {
            type: String,
            default: '',
        },
        link: {
            type: String,
            default: "",
        },
        likedPosts: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Post",
                default: [],
            },
        ],
    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;