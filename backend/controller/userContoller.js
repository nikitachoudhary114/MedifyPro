import jwt from "jsonwebtoken";
import validator from "validator";
import bcrypt from "bcryptjs";
import userModel from "../model/userModel.js";
import razorpay from "razorpay";
import appointmentModel from "../model/appointmentModel.js";
import doctorModel from "../model/doctorModel.js";
import twilio from "twilio";

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User doesn't exist" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid Credentials" });
    }
    const token = createToken(user._id);
    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  // check mail unique
  try {
    const exist = await userModel.findOne({ email });
    if (exist) {
      return res.json({
        success: false,
        message: "User already exist  with this email",
      });
    }

    //validate email and pass
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Please enter valid E-mail" });
    }
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Please enter a password with 8+ characters",
      });
    }

    // salt and hashing
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // save in db and create token
    const newUser = new userModel({
      name: name,
      email: email,
      password: hashedPassword,
    });
    const user = await newUser.save();
    const token = createToken(user._id);

    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

const logoutUser = (req, res) => {
  try {
    return res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error logging out", error });
  }
};

const getProfile = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized access" });
    }

    const user = await userModel.findById(req.user.id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        dob: user.dob,
        gender: user.gender,
        image: user.image,
        emergencyContacts: user.emergencyContacts || [],
      },
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ success: false, message: "Error fetching profile" });
  }
};

const editProfile = async (req, res) => {
  const { name, phone, address, dob, gender } = req.body;

  try {
    const updateData = {
      name,
      phone,
      address,
      dob: dob ? new Date(dob) : null,
      gender,
    };

    if (req.file) {
      updateData.image = req.file.path;
    }

    const user = await userModel.findByIdAndUpdate(req.user.id, updateData, {
      new: true,
    });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        dob: user.dob,
        gender: user.gender,
        image: user.image,
      },
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to update profile" });
  }
};

const allUsers = async (req, res) => {
  try {
    const users = await userModel.find();
    if (!users || users.length == 0) {
      res.status(404).json({ message: "No Users Found" });
    }
    res.status(200).json({ message: "all users", users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "server error" });
  }
};

const getSpecificUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId || userId === "undefined") {
      return res.status(400).json({ success: false, message: "Invalid userId in request" });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "No Users Found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error("Error in getSpecificUser:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await userModel.findByIdAndDelete(userId);
    if (!user) {
      res.status(404).json({ message: "No Users Found" });
    }
    res.status(200).json({ message: "User Deleted successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "server error" });
  }
};

const razorpayInstance = new razorpay({
  key_id: "rzp_test_VuXL9xKSfucJ3D",
  key_secret: "NscUSHpcPjO78zXJTQ98isuI",
});

const razorpayPayment = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    // Fetch the appointment and populate the doctorId field
    const appointmentData = await appointmentModel
      .findById(appointmentId)
      .populate("doctorId", "fees");

    if (!appointmentData || appointmentData.status === "Cancelled") {
      return res.status(404).json({
        success: false,
        message: "Appointment cancelled or not found",
      });
    }

    const options = {
      amount: appointmentData.doctorId.fees * 100,
      currency: process.env.CURRENCY || "INR",
      receipt: appointmentId.toString(),
    };

    const order = await razorpayInstance.orders.create(options);

    res.json({ success: true, order });
  } catch (error) {
    console.error("Error in Razorpay payment:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const updateAppointmentTimings = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { date, time } = req.body;

    const appointment = await appointmentModel.findById(appointmentId);
    if (!appointment) {
      return res
        .status(404)
        .json({ success: false, message: "Appointment not found" });
    }
    if (date) {
      appointment.date = date;
    }

    if (time) {
      appointment.time = time;
    }
    appointment.save();

    res.status(200).json({
      success: true,
      message: "Appointment timings updated successfully",
      appointment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "server error" });
  }
};

const verifyRazorpay = async (req, res) => {
  try {
    const { razorpay_order_id } = req.body;
    const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);

    // console.log(orderInfo)

    if (orderInfo.status === "paid") {
      await appointmentModel.findByIdAndUpdate(orderInfo.receipt, {
        payment: true,
        paymentMode: "Online",
        status: "Confirmed",
      });
      res.json({ success: true, message: "payment successful" });
    } else {
      res.json({ success: false, message: "payment fail" });
    }
  } catch (error) {
    console.error("Error in Razorpay payment:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const addEmergencyContact = async (req, res) => {
  const userId = req.user.id;
  const { name, phone } = req.body;

  if (!name || !phone) {
    return res
      .status(400)
      .json({ message: "Name and phone number are both required" });
  }

  try {
    const user = await userModel.findByIdAndUpdate(
      userId,
      {
        $push: {
          emergencyContacts: { name, phone },
        },
      },
      { new: true }
    );

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "Emergency contact added successfully!",
      emergencyContacts: user.emergencyContacts,
    });
  } catch (error) {
    console.error("Error adding emergency contact:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};




const sos = async (req, res) => {
  try {
    const id = process.env.TWILIO_ACCOUNT_SID;
    const auth_token = process.env.TWILIO_AUTH_TOKEN;

    const client = new twilio(id, auth_token);

    const userId = req.user.id;

    const user = await userModel.findById(userId);

    if (!user || !user.emergencyContacts || user.emergencyContacts.length === 0) {
      return res.status(400).json({ success: false, message: "No emergency contacts found." });
    }

    // Retrieve message and location from the request body
    const message = req.body.message || "🚨 SOS ALERT! I need help immediately. Please check on me.";
    const { latitude, longitude } = req.body;

    // Create a Google Maps link with the user's location
    const mapLink = `https://www.google.com/maps?q=${latitude},${longitude}`;

    // Form the message with location and Google Maps link
    const locationMessage = `🚨 SOS! I need help. I'm at ${mapLink}`;

    console.log(locationMessage)

    // Send SOS message to all emergency contacts
    const results = await Promise.allSettled(
      user.emergencyContacts.map((contact) =>
        client.messages.create({
          body: `${user.name || "Someone"} triggered an SOS! Message: ${locationMessage}`,
          from: process.env.TWILIO_PHONE,
          to: contact.phone,
        })
      )
    );

    // Filter out any failed messages
    const failed = results.filter((r) => r.status === "rejected");

    if (failed.length > 0) {
      console.error("Some messages failed:", failed);
      return res.status(207).json({
        success: false,
        message: "SOS sent to some contacts, but failed for others.",
        failedCount: failed.length,
      });
    }

    res.status(200).json({ success: true, message: "SOS messages sent to all contacts." });
  } catch (error) {
    console.error("SOS error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};




export {
  loginUser,
  registerUser,
  logoutUser,
  getProfile,
  editProfile,
  allUsers,
  getSpecificUser,
  deleteUser,
  razorpayPayment,
  verifyRazorpay,
  updateAppointmentTimings,
  sos,
  addEmergencyContact,
};
