# 🏥 MedifyPro – Smart Healthcare Management System

**MedifyPro** is an advanced MERN-stack healthcare platform that streamlines doctor appointment booking, real-time consultations, emergency SOS services, and health management. It integrates secure payments, live chat, video calls, and location-based services, offering a comprehensive digital healthcare solution.

---

## 🚀 Key Features

- 🩺 **Doctor Appointment Booking & Management**
- 💬 **Real-Time Chat & Video Consultations** (Socket.io + WebRTC)
- 🔍 **Doctor Search & Filtering** (by name, specialty, rating, fees, availability)
- 🚨 **Emergency SOS Alerts** with Live Location & SMS (Twilio)
- 📧 **Integrated Email & SMS Notifications** (Nodemailer + Twilio)
- 💳 **Secure Payment Gateway Integration** (Razorpay)
- 🧑‍⚕️ **Admin Dashboard** for Managing Doctors, Users & Analytics
- 🗺️ **Google Maps Integration** for Nearby Pharmacies & Diagnostic Labs

---

## 🛠️ Tech Stack

| Category         | Technologies |
|------------------|--------------|
| **Frontend**     | React.js, Tailwind CSS, Axios |
| **Backend**      | Node.js, Express.js |
| **Database**     | MongoDB (via Mongoose) |
| **Authentication** | JWT (JSON Web Token) |
| **Payments**     | Razorpay |
| **Notifications**| Nodemailer (Email), Twilio (SMS) |
| **Real-Time**    | Socket.io |
| **Video Calls**  | WebRTC |
| **Maps**         | Google Maps API |
| **Deployment**   | vercel |

---

## 📦 Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/nikitachoudhary114/MedifyPro.git
   cd MedifyPro
   ```

2. **Install dependencies:**
   ```bash
   cd frontend     
   npm install

   cd ../backend   
   npm install
   ```

3. **Configure environment variables** in `.env` files:
   ```env
   MONGO_URI=
   JWT_SECRET=
   RAZORPAY_KEY_ID=
   RAZORPAY_KEY_SECRET=
   TWILIO_ACCOUNT_SID=
   TWILIO_AUTH_TOKEN=
   TWILIO_PHONE_NUMBER=
   EMAIL_USER=
   EMAIL_PASS=
   ```

4. **Start development servers:**
   ```bash
   # Backend (in /backend)
   npm run dev

   # Frontend (in /frontend)
   npm start
   ```

---

## 🔒 Emergency SOS – SMS Alert System (Twilio)

The Emergency SOS module allows users to send real-time SMS alerts with location details to their emergency contacts.

> ⚠️ **Note**: Twilio’s free trial restricts SMS functionality to manually **verified numbers only**. For full-scale testing or production use, upgrading to a paid Twilio account is recommended.

---

## 🙌 Contributions & Feedback

We welcome contributions and suggestions from the community. Feel free to fork the repo, open issues, or submit pull requests to improve the project.

---

## 📬 Contact

Made with ❤️ by **Nikita Choudhary**

- 📧 Email: [nikitachoudhary364@gmail.com](mailto:nikitachoudhary364@gmail.com)  
- 🔗 LinkedIn: [linkedin.com/in/nikita-choudhary2005](https://www.linkedin.com/in/nikita-choudhary2005/)

---
