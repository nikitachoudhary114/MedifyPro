import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './util/db.js';  // Add .js extension
import userRouter from './routes/userRoutes.js'; // Import directly
import doctorRoutes from './routes/doctorRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import {  searchAndFilter } from './controller/doctorController.js';
import adminRoutes from "./routes/adminRoutes.js";
import './util/cronScheduler.js'
import http from 'http';
import { Server } from 'socket.io';
import chatModel from './model/chatModel.js'
import { timeStamp } from 'console';

import { upload } from './util/cloudinary.js';


dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

connectDB();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.send("hii");
});

app.use('/api/user', userRouter);
app.use('/api/doctor', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/admin', adminRoutes);
app.post('/api/search-filter', searchAndFilter);



// const upload = multer(); // use memory storage (default)


app.post('/api/chat/upload', upload.single('file'), async (req, res) => {
    try {
        const { room, sender, senderName } = req.body;

        if (!req.file) return res.status(400).send("No file uploaded");
        // console.log("request=> ",req);
        const chatMsg = new chatModel({
            room,
            sender,
            senderName,
            message: "",
            file: {
                url: req.file.path, // multer-storage-cloudinary sets this to secure_url
                public_id: req.file.filename,
                format: req.file.format,
                resource_type: req.file.resource_type,
                originalname: req.file.originalname,
            },
        });

        await chatMsg.save();
        // console.log(chatMsg.file)

        io.to(room).emit("recievedMessage", {
            sender,
            senderName,
            message: "",
            file: {
                url: req.file.path,
                originalname: req.file.originalname,
                public_id: req.file.filename,
                format: req.file.format,
                resource_type: req.file.resource_type,
            },
            timestamp: new Date(),
        });

        res.status(200).json({ message: "File uploaded", file: chatMsg.file });
    } catch (error) {
        console.error(error);
        res.status(500).send("Upload failed");
    }
});
  
  



const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ['GET', 'POST']
    }
});


io.on('connection', (socket) => {
    console.log("User connected:", socket.id);

    socket.on('joinRoom',async ({ room }) => {
        socket.join(room);
        const messages = await chatModel.find({ room }).sort({ timeStamp: 1 });
        socket.emit("previousMessages", messages);
    });

    socket.on('sendMessage', async ({ room, message, sender, senderName }) => {
        const chatMsg = new chatModel({ room, message, sender, senderName });
        await chatMsg.save();
        io.to(room).emit('recievedMessage', { message, sender, senderName, timestamp: chatMsg.timestamp });
    });

    socket.on("typing", ({ room, senderName }) => {
        socket.to(room).emit("typing",{ senderName});
    });
      

    socket.on('disconnect', () => {
        console.log("user Disconnected", socket.id);
    });

    // WebRTC Signaling Events
    socket.on('join-video-room', (roomId) => {
        console.log(`Socket ${socket.id} joining video room: ${roomId}`);
        socket.join(roomId);
        // Notify others in the room that a new user joined
        socket.to(roomId).emit('user-joined');
        console.log(`Notified other users in room ${roomId} about new user ${socket.id}`);
    });

    socket.on('offer', (data) => {
        console.log(`Received offer from ${socket.id} for room ${data.roomID}`);
        socket.to(data.roomID).emit('offer', data.offer);
        console.log(`Forwarded offer to other users in room ${data.roomID}`);
    });

    socket.on('answer', (data) => {
        console.log(`Received answer from ${socket.id} for room ${data.roomID}`);
        socket.to(data.roomID).emit('answer', data.answer);
        console.log(`Forwarded answer to other users in room ${data.roomID}`);
    });

    socket.on('ice-candidate', (data) => {
        console.log(`Received ICE candidate from ${socket.id} for room ${data.roomID}`);
        socket.to(data.roomID).emit('ice-candidate', data.candidate);
        console.log(`Forwarded ICE candidate to other users in room ${data.roomID}`);
    });

    socket.on("end-call", ({ roomID }) => {
        console.log(`Call ended in room ${roomID} by ${socket.id}`);
        socket.to(roomID).emit("end-call");
    });
      


});


server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
  

// app.listen(port, () => {
//     console.log(`Server listening to port ${port}`);
// });
