import mongoose from "mongoose";
const chatMessageSchema = new mongoose.Schema({
    room: { type: String }, // e.g., appointmentId
    sender: { type: String }, // userId or doctorId
    message: { type: String },
    senderName: { type: String},
    timestamp: { type: Date, default: Date.now }
});

const chatModel = mongoose.model('ChatMessage', chatMessageSchema);
export default  chatModel;

