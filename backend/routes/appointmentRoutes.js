import express from "express";
import {
  changeAppointmentStatus,
  createAppointment,
  deleteAppointment,
  getAppointmentForDoctor,
  getAppointmentForPatient,
  updateAppointment,
} from "../controller/appointmentController.js";
import { auth } from "../middleware/auth.js";
import { docAuth } from "../middleware/doctorAuth.js";
const appointmentRoutes = express.Router();

appointmentRoutes.post("/",auth, createAppointment);
appointmentRoutes.get("/user",auth, getAppointmentForPatient);
appointmentRoutes.get("/doctor/:id", docAuth, getAppointmentForDoctor);//done
appointmentRoutes.put("/:appointmentId", auth, updateAppointment);
appointmentRoutes.put("/:appointmentId/status", auth, changeAppointmentStatus);//done
appointmentRoutes.delete("/:appointmentId",auth, deleteAppointment);

export default appointmentRoutes;
