import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './util/db.js';  // Add .js extension
import userRouter from './routes/userRoutes.js'; // Import directly
import doctorRoutes from './routes/doctorRoutes.js';

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

app.listen(port, () => {
    console.log(`Server listening to port ${port}`);
});
