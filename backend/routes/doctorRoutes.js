import express from "express";
import { addDoctor, getAllDoctors, getDocById, updateDocProfile } from "../controller/doctorController.js";
const doctorRoutes = express.Router();

doctorRoutes.post("/add", addDoctor);
doctorRoutes.get("/all", getAllDoctors);
doctorRoutes.get('/:id', getDocById);
doctorRoutes.put('/:id/', updateDocProfile);

export default doctorRoutes;