import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;

        if (!token) {
            return res.status(401).json({
                error: "You need to login first to access, token not provided"
            })
        }

        const decode = jwt.verify(token, process.env.JWT_SECRET);

        if (!decode) {
            return res.status(401).json({
                error: "unauthorized Invalid token"
            })
        }

        const user = await User.findById(decode.userId)

        if (!user) {
            return res.status(404).json({
                error: "user not found"
            })
        }

        req.user = user;
        next();

    } catch (error) {
        console.log("error in protected route middleware", error.message);
        res.status(500).json({ error: "Internal server error" })
    }
}