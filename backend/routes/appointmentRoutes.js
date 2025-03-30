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
const appointmentRoutes = express.Router();

appointmentRoutes.post("/", createAppointment);
appointmentRoutes.get("/user/:id",auth, getAppointmentForPatient);
appointmentRoutes.get("/doctor/:id",auth, getAppointmentForDoctor);
appointmentRoutes.put("/:appointmentId", auth, updateAppointment);
appointmentRoutes.put("/:appointmentId/status", auth, changeAppointmentStatus);
appointmentRoutes.delete("/:appointmentId",auth, deleteAppointment);

export default appointmentRoutes;
