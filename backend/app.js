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
        socket.to(room).emit("typing", senderName);
    });
      

    socket.on('disconnect', () => {
        console.log("user Disconnected", socket.id);
    });
});

server.listen(8080);


// app.listen(port, () => {
//     console.log(`Server listening to port ${port}`);
// });
