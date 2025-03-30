import express from "express";
import {auth} from '../middleware/auth.js'
import {
  addDoctor,
  addReview,
  avgRating,
  deleteReview,
  getAllDoctors,
  getDocById,
  getDoctorAvailability,
  updateDocProfile,
  updateDoctorAvailabity,
  getReview,
  updatReview,
  filter,
  deleteDoctor,
  signUp,
  login,
  logout,
} from "../controller/doctorController.js";
const doctorRoutes = express.Router();

doctorRoutes.post("/signup", signUp);
doctorRoutes.post("/login", login);
doctorRoutes.post("/logout", logout);

doctorRoutes.post("/add",auth, addDoctor);
doctorRoutes.get("/all", auth, getAllDoctors);
doctorRoutes.get("/:doctorId",auth, getDocById);
doctorRoutes.delete("/:doctorId", auth, deleteDoctor);
doctorRoutes.put("/:doctorId/", auth, updateDocProfile);
doctorRoutes.post("/:doctorId/available", auth, updateDoctorAvailabity);
doctorRoutes.get("/:doctorId/available", getDoctorAvailability);

//reviews
doctorRoutes.post("/:doctorId/review", auth, addReview);
doctorRoutes.get("/:doctorId/review", auth, getReview);
doctorRoutes.patch("/:doctorId/review/:reviewId", auth, updatReview);
doctorRoutes.delete("/:doctorId/review/:reviewId", auth, deleteReview);
doctorRoutes.get("/:doctorId/average-rating", avgRating);

export default doctorRoutes;
