import jwt from "jsonwebtoken";

import doctorModel from "../model/doctorModel.js";

export const docAuth = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const doctor = await doctorModel.findById(decoded.id);


        if (!doctor) {
            return res.status(404).json({ message: "User not found" });
        }

        req.doctor = doctor; // Attach user to the request
        next();
    } catch (error) {
        console.error("Authentication error:", error);
        res.status(401).json({ message: "Unauthorized" });
    }
};