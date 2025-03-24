import express from "express";
import { addDoctor, getAllDoctors, getDocById, getDoctorAvailability, updateDocProfile, updateDoctorAvailabity } from "../controller/doctorController.js";
const doctorRoutes = express.Router();

doctorRoutes.post("/add", addDoctor);
doctorRoutes.get("/all", getAllDoctors);
doctorRoutes.get('/:id', getDocById);
doctorRoutes.put('/:id/', updateDocProfile);
doctorRoutes.post('/:id/available', updateDoctorAvailabity);
doctorRoutes.get('/:id/available', getDoctorAvailability);

export default doctorRoutes;