import mongoose from "mongoose";
const chatMessageSchema = new mongoose.Schema({
    room: { type: String, required: true }, // e.g., appointmentId
    sender: { type: String, required: true }, // userId or doctorId
    message: { type: String, required: true },
    senderName: { type: String},
    timestamp: { type: Date, default: Date.now }
});

const chatModel = mongoose.model('ChatMessage', chatMessageSchema);
export default  chatModel;

