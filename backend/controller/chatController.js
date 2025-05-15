import chatModel from "../model/chatModel.js";
import appointmentModel from "../model/appointmentModel.js";

// Initiate chat
export const initiateChat = async (req, res) => {
    try {
        const { appointmentId } = req.body;

        const appointment = await appointmentModel.findById(appointmentId);
        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        const chat = await chatModel.create({
            appointmentId,
            participants: [appointment.patientId, appointment.doctorId],
        });

        res.status(201).json({ success: true, chat });
    } catch (error) {
        console.error("Error initiating chat:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Send message
export const sendMessage = async (req, res) => {
    try {
        const { appointmentId, message } = req.body;
        const userId = req.user.id;

        const chat = await chatModel.findOne({ appointmentId });
        if (!chat) {
            return res.status(404).json({ message: "Chat not found" });
        }

        chat.messages.push({ sender: userId, message });
        await chat.save();

        res.status(200).json({ success: true, chat });
    } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Get messages
export const getMessages = async (req, res) => {
    try {
        const { appointmentId } = req.params;

        const chat = await chatModel.findOne({ appointmentId });
        if (!chat) {
            return res.status(404).json({ message: "Chat not found" });
        }

        res.status(200).json({ success: true, messages: chat.messages });
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Initiate video call
export const initiateVideoCall = async (req, res) => {
    try {
        const { appointmentId } = req.body;

        const appointment = await appointmentModel.findById(appointmentId);
        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        const currentTime = new Date();
        const appointmentTime = new Date(`${appointment.date}T${appointment.time}`);

        if (currentTime < appointmentTime) {
            return res.status(400).json({
                message: "Video call can only be initiated after the scheduled time.",
            });
        }

        res.status(200).json({ success: true, message: "Video call initiated" });
    } catch (error) {
        console.error("Error initiating video call:", error);
        res.status(500).json({ message: "Server error" });
    }
};