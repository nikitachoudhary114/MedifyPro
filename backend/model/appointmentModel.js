import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
    patientId: { type: mongoose.Types.ObjectId, ref: "user", required: true },
    doctorId: { type: mongoose.Types.ObjectId, ref: "doctor", required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    payment:{type: Boolean, default:false },
    paymentMode: {type: String, enum:["Cash", "Online"], default: "Cash"},
    status: {type:String, enum:["Completed", "Confirmed", "Cancelled"], default:"Confirmed"}
});

const appointmentModel = mongoose.model("appointment", appointmentSchema);
export default appointmentModel;
