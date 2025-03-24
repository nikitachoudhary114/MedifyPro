import express from "express";
import { addDoctor, addReview, avgRating, deleteReview, getAllDoctors, getDocById, getDoctorAvailability, updateDocProfile, updateDoctorAvailabity,getReview, updatReview } from "../controller/doctorController.js";
const doctorRoutes = express.Router();

doctorRoutes.post("/add", addDoctor);
doctorRoutes.get("/all", getAllDoctors);
doctorRoutes.get('/:doctorId', getDocById);
doctorRoutes.put('/:doctorId/', updateDocProfile);
doctorRoutes.post('/:doctorId/available', updateDoctorAvailabity);
doctorRoutes.get('/:doctorId/available', getDoctorAvailability);

//reviews
doctorRoutes.post('/:doctorId/review', addReview);
doctorRoutes.get('/:doctorId/review',getReview);
doctorRoutes.patch('/:doctorId/review/:reviewId', updatReview);
doctorRoutes.delete('/:doctorId/review/:reviewId', deleteReview);
doctorRoutes.get('/:doctorId/average-rating', avgRating)

export default doctorRoutes;