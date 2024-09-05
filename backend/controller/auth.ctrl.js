import User from "../models/user.model.js";
import bcrpyt from "bcryptjs";
import { generateTokenAndSetCookie } from "../utils/generateToken.js";


export const signup = async (req, res) => {
    try {
        const { fullName, username, email, password } = req.body;

        if ([fullName, username, email, password].some((field) =>
            field?.trim() === "")) {
            return res.status(400).json({
                error: "Some field is missing"
            })
        }

        const existUser = await User.findOne({ $or: [{ username }, { email }] })

        if (existUser) {
            return res.status(409).json({
                message: "User already exist, check email or username"
            })
        }

        //hash password

        const salt = await bcrpyt.genSalt(10);
        const hashPassword = await bcrpyt.hash(password, salt);

        const newUser = new User({
            fullName,
            email,
            username,
            password: hashPassword
        })

        if (newUser) {
            generateTokenAndSetCookie(newUser._id, res)
            await newUser.save();

            res.status(201).json({
                message: "User created sucessfully",
                _id: newUser._id,
                fullName: newUser.fullName,
                username: newUser.username,
                email: newUser.email,
                followers: newUser.followers,
                following: newUser.following,
                profileImg: newUser.profileImg,
                coverImg: newUser.coverImg,
            })
        } else {
            res.status(400).json({ error: "Invalid user data" });
        }

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: "Internal server error" })
    }
}

export const login = async (req, res) => {
    try {

        const { userId, password } = req.body;

        if (!userId || !password) {
            return res.status(400).json({
                error: "Some field is missing"
            })
        }

        const user = await User.findOne({ $or: [{ username: userId }, { email: userId }] }).select("+password");

        if (!user) {
            return res.status(400, json({
                error: "user not exist please signup"
            }))
        }

        const isPassword = await bcrpyt.compare(password, user?.password || "");

        if (!isPassword) {
            return res.status(400, json({
                error: "Invalid credentials"
            }))
        }

        generateTokenAndSetCookie(user._id, res);

        res.status(201).json({
            message: `${user.fullName} Login sucessfully`,
            _id: user._id,
            fullName: user.fullName,
            username: user.username,
            email: user.email,
            followers: user.followers,
            following: user.following,
            profileImg: user.profileImg,
            coverImg: user.coverImg,
        })

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: "Internal server error" })
    }
}

export const logout = async (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 })
        res.status(200).json({
            message: "Logout successfully"
        })
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: "Internal server error" })
    }
}

export const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        res.status(200).json({
            data: user
        });
    } catch (error) {
        console.log("error in getMe controller: ", error.message);
        res.status(500).json({ error: "Internal server error" })
    }
}