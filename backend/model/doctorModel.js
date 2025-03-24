import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true , unique:true},
    password: { type: String, required: true },
    speciality: { type: String, enum: ["General Physicain", "Gynecologist", "Dermatologist", "Pediatricians", "Neurologist", "Gastroenterologist"], required: true },
    phone: { type: String, default: "" },
    address: { type: String, default: "" },
    fees: { type: Number, default: 0 },
    image: { type: String, default: "https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png" },
    degree: { type: String, default: "" },
    experience: { type: String, default: "" },
    about: { type: String, default: "" },
    timing: { type: String, default: "" },
    availability: {type:Boolean, default:false}
})
const doctorModel = mongoose.model('doctor', doctorSchema);
export default doctorModel;