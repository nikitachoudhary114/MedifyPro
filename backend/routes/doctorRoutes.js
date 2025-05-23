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
  deleteDoctor,
  signUp,
  login,
  logout,
  changeDoctorPassword,
} from "../controller/doctorController.js";
import { upload } from "../util/cloudinary.js";
import { docAuth } from "../middleware/doctorAuth.js";
const doctorRoutes = express.Router();

doctorRoutes.post("/signup", signUp);//done
doctorRoutes.post("/login", login);//done
doctorRoutes.post("/logout", logout);//done

doctorRoutes.post("/add", upload.single("image"), addDoctor);//done
doctorRoutes.get("/all", getAllDoctors); 
doctorRoutes.get("/:doctorId", getDocById);//done
doctorRoutes.post('/:doctorId/update-password', docAuth, changeDoctorPassword);//done
doctorRoutes.delete("/:doctorId", deleteDoctor);//done
doctorRoutes.put("/:doctorId/", docAuth, updateDocProfile);//done
doctorRoutes.post("/:doctorId/available", auth, updateDoctorAvailabity);//done
doctorRoutes.get("/:doctorId/available-slots", auth, getDoctorAvailability);

//reviews
doctorRoutes.post("/:doctorId/review", auth, addReview); //done
doctorRoutes.get("/:doctorId/review", auth, getReview);//done
doctorRoutes.patch("/:doctorId/review/:reviewId", auth, updatReview);//done
doctorRoutes.delete("/:doctorId/review/:reviewId", auth, deleteReview);//done
doctorRoutes.get("/:doctorId/average-rating", avgRating);//done

export default doctorRoutes;
