import express from "express";
import { auth } from "../middleware/auth.js";
import { docAuth } from "../middleware/doctorAuth.js";
import {
    initiateChat,
    sendMessage,
    getMessages,
    initiateVideoCall,
} from "../controller/chatController.js";

const chatRoutes = express.Router();

// Chat routes
chatRoutes.post("/initiate", auth, initiateChat); // Initiate chat
chatRoutes.post("/message", auth, sendMessage); // Send message
chatRoutes.get("/messages/:appointmentId", auth, getMessages); // Get chat messages

// Video call route
chatRoutes.post("/video/initiate", auth, initiateVideoCall); // Initiate video call

export default chatRoutes;