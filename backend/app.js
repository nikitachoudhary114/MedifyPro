const express = require('express');
const mongoose = require('mongoose');
const app = express();
const dotenv = require('dotenv');
const cors = require('cors');
const { connectDB } = require('./util/db');
const { default: userRouter } = require('./routes/userRoutes');
dotenv.config();

const port = process.env.PORT || 3000;

connectDB();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.send("hii")
})

app.use('/api/user', userRouter);

app.listen(port, () => {
    console.log(`Server listening to port ${port}`)
})