// utils/cronScheduler.js
import cron from 'node-cron';
import appointmentModel from '../model/appointmentModel.js';
import { sendAppointmentEmail } from '../servies/emailService.js';


// Schedule a cron job to run every day at 9:00 AM
cron.schedule('0 9 * * *', async () => {
    // Runs every day at 9:00 AM
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get appointments for tomorrow with "Confirmed" status
    const appointments = await appointmentModel.find({
        date: tomorrow.toISOString().split('T')[0],
        status: "Confirmed"
    }).populate('doctorId').populate('patientId');

    // Loop through appointments and send reminder email
    for (const appointment of appointments) {
        await sendAppointmentEmail({
            email: appointment.patientId.email, // Send email to patient's email
            name: appointment.patientId.name,
            notification_message: `Reminder: You have an appointment tomorrow. 📅`,
            doctor_name: appointment.doctorId.name,
            appointment_date: appointment.date,
            appointment_time: appointment.time,
            clinic_location: `MedifyPro Clinic <br> 
101, Serenity Plaza <br> 
Baner Road, Baner <br> 
Pune, Maharashtra 411045 <br> 
Phone: +91 98765 43210`,
        });
    }
});
