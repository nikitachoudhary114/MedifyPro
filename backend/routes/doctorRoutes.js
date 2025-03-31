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
  changeDoctorPassword,
} from "../controller/doctorController.js";
const doctorRoutes = express.Router();

doctorRoutes.post("/signup", signUp);//done
doctorRoutes.post("/login", login);//done
doctorRoutes.post("/logout", logout);//done

doctorRoutes.post("/add",auth, addDoctor);//done
doctorRoutes.get("/all", auth, getAllDoctors);//done
doctorRoutes.get("/:doctorId", auth, getDocById);//done
doctorRoutes.post('/:doctorId/update-password', auth, changeDoctorPassword);//done
doctorRoutes.delete("/:doctorId", auth, deleteDoctor);//done
doctorRoutes.put("/:doctorId/", auth, updateDocProfile);//done
doctorRoutes.post("/:doctorId/available", auth, updateDoctorAvailabity);//done
doctorRoutes.get("/:doctorId/available", getDoctorAvailability);//not needed can find it through doc data

//reviews
doctorRoutes.post("/:doctorId/review", auth, addReview);
doctorRoutes.get("/:doctorId/review", auth, getReview);
doctorRoutes.patch("/:doctorId/review/:reviewId", auth, updatReview);
doctorRoutes.delete("/:doctorId/review/:reviewId", auth, deleteReview);
doctorRoutes.get("/:doctorId/average-rating", avgRating);

export default doctorRoutes;
