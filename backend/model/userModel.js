import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true , unique:true},
    password: { type: String, required: true },
    phone: { type: String, default: "" },
    address: { type: String, default: "" },
    dob: { type: Date, default: null },
    gender: { type: String, enum: ["Male", "Female", "Others"], default: "" },
    image: { type: String, default:"https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png"}

}, { minimize: false })

const userModel = mongoose.model('user', userSchema);;
export default userModel;