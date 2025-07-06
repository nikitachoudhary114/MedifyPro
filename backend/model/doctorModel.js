import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    userId: { type: mongoose.Types.ObjectId, ref: "user", required: true },
    review: { type: String, required: true },
    rating: { type: Number,enum:[1,2,3,4,5], required: true },
    createdAt: { type: Date, default: Date.now }
});

const doctorSchema = new mongoose.Schema({
    name: { type: String },
    email: { type: String, unique: true },
    password: { type: String },
    speciality: {
        type: String,
        enum: ["General Physician", "Gynecologist", "Dermatologist", "Pediatricians", "Neurologist", "Gastroenterologist"],
       
    },
    phone: { type: String, default: "" },
    address: { type: String, default: "" },
    fees: { type: Number, default: 0 },
    image: {
        type: String,
        default: "https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png"
    },
    degree: { type: String, default: "" },
    experience: { type: String, default: "" },
    about: { type: String, default: "" },
    timing: { type: String, default: "" },
    availability: { type: Boolean, default: true },
    reviews: [reviewSchema]
});
const doctorModel = mongoose.model('doctor', doctorSchema);
export default doctorModel;