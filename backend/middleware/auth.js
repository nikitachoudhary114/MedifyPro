import jwt from "jsonwebtoken";
import userModel from "../model/userModel.js";

export const auth = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        req.user = user; // Attach user to the request
        next();
    } catch (error) {
        console.error("Authentication error:", error);
        res.status(401).json({ message: "Unauthorized" });
    }
};