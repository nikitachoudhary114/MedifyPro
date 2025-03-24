import appointmentModel from "../model/appointmentModel.js";
import doctorModel from "../model/doctorModel.js";
import userModel from "../model/userModel.js";

const createAppointment = async (req, res) => {
    try {
        const { patientId, doctorId, date, time, status } = req.body;
        if (!patientId || !doctorId || !date || !time || !status) {
          return  res.status(400).json({ message: "All fields are required." });
        }

        const newAppointment = new appointmentModel({
            patientId, doctorId,date, time, status
        })

        const savedAppointment = await newAppointment.save();

        res.status(201).json({ message: "Appointment Created Successfully", appointment: savedAppointment });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const getAppointmentForDoctor = async (req, res) => {
   try {
       const { id } = req.params;
       const doctorAppointments = await appointmentModel.find({doctorId : id})
       res.status(200).json({message:"All doctor appointment", doctorAppointments})
   } catch (error) {
       console.log(error)
       res.status(500).json({ message: "server error"})
   } 
}

const getAppointmentForPatient = async (req, res) => {
    try {
        const { id } = req.params;
        const patientAppointments = await appointmentModel.find({ patientId: id })
        res.status(200).json({ message: "All patient appointment", patientAppointments })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "server error" })
    } 
}

const updateAppointment = async (req, res) => {
    try {
        const { appointmentId } = req.params;
        const { time, date } = req.body;
        if (!time || !date) {
           return  res.status(400).json({message: "Date and time needed to  update appointment"})
        }
        const updatedAppointment = await appointmentModel.findByIdAndUpdate(
            appointmentId,
            { date, time },
            { new: true, runValidators: true }
        )

        if (!updatedAppointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        res.status(200).json({ message: "Appointment updated successfully" });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" });
    }
}

const deleteAppointment = async (req, res) => {
    try {
        const { appointmentId } = req.params;
        const deletedAppointment = await appointmentModel.findByIdAndDelete(appointmentId);
        res.status(200).json({message:"appointment deleted successfully", deletedAppointment})
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" });
    }
}

export {
    createAppointment, getAppointmentForDoctor, getAppointmentForPatient, updateAppointment, deleteAppointment
}