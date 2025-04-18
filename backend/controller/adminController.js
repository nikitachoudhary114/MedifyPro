import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import adminModel from "../model/adminModel.js";
import doctorModel from "../model/doctorModel.js";
import userModel from "../model/userModel.js";
import appointmentModel from "../model/appointmentModel.js";
import mongoose from "mongoose";

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

// Admin Login
export const loginAdmin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const admin = await adminModel.findOne({ email });
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = createToken(admin._id);
        res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        console.error("Error logging in admin:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Admin Registration (Optional)
export const registerAdmin = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const existingAdmin = await adminModel.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ message: "Admin already exists" });
        }

        const newAdmin = new adminModel({ name, email, password });
        await newAdmin.save();

        res.status(201).json({ message: "Admin registered successfully" });
    } catch (error) {
        console.error("Error registering admin:", error);
        res.status(500).json({ message: "Server error" });
    }
};


//admin dashboard
export const adminDashboardDetails = async (req, res) => {
    try {
        const totalDoctors = await doctorModel.countDocuments();
        const totalPatients = await userModel.countDocuments();
        const totalAppointments = await appointmentModel.countDocuments();
        const doctorsBySpeciality = await doctorModel.aggregate([
            { $group: { _id: "$speciality", count: { $sum: 1 } } }
        ]);

        const appointmentsByMonth = await appointmentModel.aggregate([
            {
            $group: {
                _id: { $month: "$date" },
                count: { $sum: 1 }
            }
            },
            { $sort: { _id: 1 } }
        ]);

        
        const highestAppointmentDoctors = await appointmentModel.aggregate([
            {
            $lookup: {
                from: "doctors",
                localField: "doctorId",
                foreignField: "_id",
                as: "doctorDetails"
            }
            },
            { $unwind: "$doctorDetails" },
            {
            $group: {
                _id: "$doctorDetails.speciality",
                doctor: {
                $first: "$doctorDetails.name"
                },
                image: {
                $first: "$doctorDetails.image"
                },
                appointmentCount: { $sum: 1 }
            }
            },
            { $sort: { appointmentCount: -1 } }
        ]);

        const latestAppointments = await appointmentModel
            .find()
            .sort({ date: -1 })
            .limit(10)
            .populate("doctorId", "name speciality")
            .populate("patientId", "name image ");

        res.status(200).json({
            totalDoctors,
            totalPatients,
            totalAppointments,
            doctorsBySpeciality,
            appointmentsByMonth,
            highestAppointmentDoctors,
            latestAppointments
        });
    } catch (error) {
        console.error("Error fetching dashborad details:", error);
        res.status(500).json({ message: "Server error", error });
    }
}


export const doctorDashboardDetails = async (req, res) => {
    try {
        const doctorId = req.doctor._id; // Assuming the doctor is authenticated and their ID is available in req.doctor

        // Total Appointments
        const totalAppointments = await appointmentModel.countDocuments({ doctorId });

        // Latest Appointments
        const latestAppointments = await appointmentModel
            .find({ doctorId })
            .sort({ date: -1 })
            .limit(10)
            .populate("patientId", "name image")
            .populate("doctorId", "fees");

        // Calculate revenue for appointments with status other than "Cancelled"
        const revenueFromNonCancelledAppointments = await appointmentModel.aggregate([
            {
                $match: {
                    doctorId: new mongoose.Types.ObjectId(doctorId),
                    status: { $ne: "Cancelled" }
                }
            },
            {
                $lookup: {
                    from: "doctors", // Assuming your doctors collection name
                    localField: "doctorId",
                    foreignField: "_id",
                    as: "doctorInfo"
                }
            },
            { $unwind: "$doctorInfo" },
            { $group: { _id: null, totalFees: { $sum: "$doctorInfo.fees" } } }
        ]);
        // Revenue by Month
        const revenueByMonth = await appointmentModel.aggregate([
            {
            $match: {
                doctorId: new mongoose.Types.ObjectId(doctorId),
                status: { $ne: "Cancelled" }
            }
            },
            {
            $lookup: {
                from: "doctors",
                localField: "doctorId",
                foreignField: "_id",
                as: "doctorInfo"
            }
            },
            { $unwind: "$doctorInfo" },
            {
            $group: {
                _id: { $month: "$date" },
                totalFees: { $sum: "$doctorInfo.fees" }
            }
            },
            { $sort: { _id: 1 } }
        ]);
        const totalRevenue = revenueFromNonCancelledAppointments.length > 0
            ? revenueFromNonCancelledAppointments[0].totalFees
            : 0;

        res.status(200).json({
            totalAppointments,
            totalRevenue,
            latestAppointments,
            revenueByMonth
        });
    } catch (error) {
        console.error("Error fetching doctor dashboard details:", error);
        res.status(500).json({ message: "Server error", error });
    }
};

export const logoutAdmin = async (req, res) => {
    try {
        return res.status(200).json({ message: "Admin logged out successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Error logging out", error });
    }
}