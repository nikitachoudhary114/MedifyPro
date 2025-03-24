import express from "express";
import {
  createAppointment,
  deleteAppointment,
  getAppointmentForDoctor,
  getAppointmentForPatient,
  updateAppointment,
} from "../controller/appointmentController.js";
const appointmentRoutes = express.Router();

appointmentRoutes.post("/", createAppointment);
appointmentRoutes.get("/user/:id", getAppointmentForPatient);
appointmentRoutes.get("/doctor/:id", getAppointmentForDoctor);
appointmentRoutes.put("/:appointmentId", updateAppointment);
appointmentRoutes.delete("/:appointmentId", deleteAppointment);

export default appointmentRoutes;
