// import emailjs from '@emailjs/nodejs';

// export const sendAppointmentEmail = async (templateParams) => {
//     try {
//         const response = await emailjs.send(
//             process.env.EMAILJS_SERVICE_ID,
//             process.env.EMAILJS_TEMPLATE_ID,
//             templateParams,
//             {
//                 publicKey: process.env.EMAILJS_PUBLIC_KEY,
//                 privateKey: process.env.EMAILJS_PRIVATE_KEY,
//             }
//         );
//         console.log('Email sent:', response.status, response.text);
//     } catch (error) {
//         console.error('Error sending email:', error);
//         throw error;
//     }
// };




// services/emailService.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
    service: "gmail", // or "outlook", "yahoo", etc.
    auth: {
        user: "nikitachoudhary364@gmail.com",
        pass: "mqzo kjmb pjbc bkwc",
    },
});

export const sendAppointmentEmail = async ({ to_email, name, notification_message, doctor_name, appointment_date, appointment_time, clinic_location }) => {
    try {
        const info = await transporter.sendMail({
            from: '"MedifyPro" medifyPro@gmail.com',
            to: to_email,
            subject: "Appointment Notification",
            html: `
      <div style="font-family: system-ui, sans-serif, Arial; font-size: 14px; color: #3c4a57;">
        <div style="font-size: 16px; font-weight: 500; margin-bottom: 20px;">
          📩 Hello <strong style="color: #6a0dad;">${name}</strong>,
        </div>
        <div style="background: linear-gradient(135deg, #e6e9f0 0%, #eef1f5 100%); padding: 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(106, 13, 173, 0.1); border: 1px dashed #b8b8ff;">
          <div style="font-size: 16px; line-height: 1.6; color: #3c4a57;">
            ${notification_message}
          </div>
          <div style="margin-top: 20px; border-top: 1px solid #ccc; padding-top: 15px;">
            <div style="font-size: 18px; font-weight: 600; color: #6a0dad; margin-bottom: 10px;">
              📅 Appointment Details
            </div>
            <div style="font-size: 15px; line-height: 1.6;">
              <strong>Doctor:</strong> ${doctor_name}<br/>
              <strong>Date:</strong> ${appointment_date}<br/>
              <strong>Time:</strong> ${appointment_time}<br/>
              <strong>Location:</strong> ${clinic_location}
            </div>
          </div>
        </div>
        <div style="margin-top: 20px; font-size: 13px; color: #7d7d7d;">
          Thank you for choosing <strong style="color: #6a0dad;">MedifyPro</strong>.<br/>
          We look forward to serving you!
        </div>
      </div>`,
        });

        console.log("Email sent: " + info.response);
    } catch (error) {
        console.error("Error sending email:", error);
    }
};
