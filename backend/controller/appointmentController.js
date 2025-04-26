import appointmentModel from "../model/appointmentModel.js";
import doctorModel from "../model/doctorModel.js";
import userModel from "../model/userModel.js";
import { sendAppointmentEmail } from "../servies/emailService.js";

const createAppointment = async (req, res) => {
  try {
    const { doctorId, date, time, status } = req.body;

    if (!doctorId || !date || !time || !status) {
      return res.status(400).json({ message: "All fields are required." });
    }
    const patientId = req.user.id;
    const doctor = await doctorModel.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    const patient = await userModel.findById(patientId);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }
    const existingAppointment = await appointmentModel.findOne({
      doctorId,
      date, 
      time,
    });
    if (existingAppointment) {
      return res.status(400).json({ message: "Time slot is already booked" });
    }
    
    const newAppointment = new appointmentModel({
      patientId,
      doctorId,
      date,
      time,
      status,
    });

    const savedAppointment = await newAppointment.save();


    const doctorName = doctor.name;
   


    await sendAppointmentEmail({
      name: patient.name,
      to_email: patient.email,
      notification_message: `Your appointment has been successfully booked! 🎉`,
      doctor_name: doctorName,
      appointment_date: date,
      appointment_time: time,
      clinic_location:`MedifyPro Clinic 101, Serenity Plaza Baner Road, Baner <br>
                        Pune, Maharashtra 411045 <br>
                        Phone: +91 98765 43210`,
    });

    res.status(201).json({
      message: "Appointment Created Successfully",
      appointment: savedAppointment,
    });
  } catch (error) {
    console.error("Error creating appointment:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getAppointmentForDoctor = async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch appointments for the doctor and populate patient details
    const doctorAppointments = await appointmentModel
      .find({ doctorId: id })
      .populate("patientId", "name dob gender "); // Include relevant patient details

    if (!doctorAppointments || doctorAppointments.length === 0) {
      return res.status(404).json({ message: "No appointments found for this doctor" });
    }

    res.status(200).json({
      message: "All doctor appointments",
      doctorAppointments,
    });
  } catch (error) {
    console.error("Error fetching appointments for doctor:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const getAppointmentForPatient = async (req, res) => {
  try {
    const patientId = req.user.id;
    const patientAppointments = await appointmentModel.find({ patientId }).populate("doctorId", "name speciality image fees");
    res
      .status(200)
      .json({ message: "All patient appointment", patientAppointments });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "server error" });
  }
};

const updateAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { time, date } = req.body;
    if (!time || !date) {
      return res
        .status(400)
        .json({ message: "Date and time needed to  update appointment" });
    }
    const updatedAppointment = await appointmentModel.findByIdAndUpdate(
      appointmentId,
      { date, time },
      { new: true, runValidators: true }
    );

    if (!updatedAppointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }


    const appointment = await appointmentModel.findById(appointmentId).populate('doctorId').populate('patientId');
    await sendAppointmentEmail({
      name: appointment.patientId.name,
      to_email: appointment.patientId.email,
      notification_message: `Your appointment has been updated. 📝`,
      doctor_name: appointment.doctorId.name,
      appointment_date: date,
      appointment_time: time,
      clinic_location: `MedifyPro Clinic <br> 
101, Serenity Plaza <br> 
Baner Road, Baner <br> 
Pune, Maharashtra 411045 <br> 
Phone: +91 98765 43210`

    });

    res.status(200).json({ message: "Appointment updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const changeAppointmentStatus = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const updatedAppointment = await appointmentModel.findByIdAndUpdate(
      appointmentId,
      { status },
      { new: true, runValidators: true }
    );

    if (!updatedAppointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (status === "Cancelled") {
      const appointment = await appointmentModel.findById(appointmentId).populate('doctorId').populate('patientId');

      await sendAppointmentEmail({
        name: appointment.patientId.name,
        to_email: appointment.patientId.email,
        notification_message: `Your appointment has been cancelled by the clinic. ❌`,
        doctor_name: appointment.doctorId.name,
        appointment_date: appointment.date,
        appointment_time: appointment.time,
        clinic_location: `MedifyPro Clinic 101, Serenity Plaza Baner Road, Baner <br>
                        Pune, Maharashtra 411045 <br>
                        Phone: +91 98765 43210`
      });
    }


    res
      .status(200)
      .json({
        message: "Appointment status updated successfully",
        updatedAppointment,
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const deleteAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const deletedAppointment = await appointmentModel.findByIdAndDelete(
      appointmentId
    );


    const appointment = deletedAppointment; // deletedAppointment still has the old appointment data

    const doctor = await doctorModel.findById(appointment.doctorId);
    const patient = await userModel.findById(appointment.patientId);

    await sendAppointmentEmail({
      name: patient.name,
      to_email: patient.email,
      notification_message: `Your appointment has been cancelled. ❌`,
      doctor_name: doctor.name,
      appointment_date: appointment.date,
      appointment_time: appointment.time,
      clinic_location: `MedifyPro Clinic 101, Serenity Plaza Baner Road, Baner 
                        Pune, Maharashtra 411045 
                        Phone: +91 98765 43210`,
    });


    res
      .status(200)
      .json({
        message: "appointment deleted successfully",
        deletedAppointment,
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export {
  createAppointment,
  getAppointmentForDoctor,
  getAppointmentForPatient,
  updateAppointment,
    deleteAppointment,
  changeAppointmentStatus
};
