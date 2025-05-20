import mongoose from "mongoose";

const chatMessageSchema = new mongoose.Schema({
    room: String,
    message: String,
    sender: String,
    senderName: String,
    timestamp: {
        type: Date,
        default: Date.now,
    },
    file: {
        url: String,
        public_id: String,
        format: String,
        resource_type: String,
        originalname: String,
    },
});
  

const chatModel = mongoose.model('ChatMessage', chatMessageSchema);
export default  chatModel;

