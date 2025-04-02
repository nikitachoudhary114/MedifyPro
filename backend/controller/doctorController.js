import bcrypt from "bcryptjs/dist/bcrypt.js";
import doctorModel from "../model/doctorModel.js";
import validator from "validator";
import jwt from "jsonwebtoken";
import { upload } from "../util/cloudinary.js";

const getAllDoctors = async (req, res) => {
  try {
    const doctors = await doctorModel.find();
    res.json({ success: true, data: doctors });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error in fetching doctor's data" });
  }
};

const addDoctor = async (req, res) => {
  try {


    const {
      name,
      email,
      password,
      speciality,
      phone,
      address,
      fees,
      degree,
      experience,
      about,
      timing,
    } = req.body;

    if (
      !name || !email || !password || !speciality ||
      !phone || !address || !fees || !degree || !experience ||
      !about || !timing
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingDoctor = await doctorModel.findOne({ email });
    if (existingDoctor) {
      return res.status(400).json({ message: "Doctor with this email already exists." });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if an image was uploaded
    // const imageUrl = req.file ? req.file.path : null;
    
    if (!req.file) {
      return res.status(400).json({ message: "Image upload failed. Please upload an image." });
    }

    const imageUrl = req.file.path; // Cloudinary URL
    console.log("Image URL:", imageUrl);

   

    // Create doctor
    const newDoctor = new doctorModel({
      name,
      email,
      password: hashedPassword,
      speciality,
      phone,
      address,
      fees,
      image: imageUrl, // Save Cloudinary URL
      degree,
      experience,
      about,
      timing,
    });

    await newDoctor.save();

    res.status(201).json({
      success: true,
      message: "Doctor added successfully",
      doctor: newDoctor,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


const getDocById = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const doc = await doctorModel.findById(doctorId);
    // console.log(req);
    res.status(201).json({ success: true, doctor: doc });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "server error" });
  }
};

const updateDocProfile = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const updatedData = req.body;

    const doc = await doctorModel.findByIdAndUpdate(doctorId, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      res.status(200).json({ success: false, message: "Doctor not found" });
    }
    res.status(200).json({
      success: true,
      message: "Doctor Profile Updated Successfully",
      doctor: doc,
    });
  } catch (error) {
    console.log(error);

    if (error.kind === "ObjectId") {
      res.status(400).json({ success: false, message: "Invalid Doctor ID" });
    }

    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const updateDoctorAvailabity = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const doc = await doctorModel.findById(doctorId);

    if (!doc) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor Not Found" });
    }

    doc.availability = !doc.availability;

    await doc.save();

    res
      .status(200)
      .json({
        message: "Doctor availability updated successfully",
        isAvailable: doc.availability,
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error", error });
  }
};

const getDoctorAvailability = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const doc = await doctorModel.findById(doctorId);

    if (!doc) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor Not Found" });
    }

    const available = doc.availability;
    res.status(200).json({ success: true, available });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const changeDoctorPassword = async (req, res) => {
  const { doctorId } = req.params;
  const { currentPassword, newPassword } = req.body;

  try {
    const doctor = await doctorModel.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // Check if the current password is correct
    const isMatch = await bcrypt.compare(currentPassword, doctor.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    doctor.password = await bcrypt.hash(newPassword, salt);

    await doctor.save();
    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

const addReview = async (req, res) => {
  try {
    const { userId, review, rating } = req.body;
    const { doctorId } = req.params;

    const doctor = await doctorModel.findById(doctorId);

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    const newRating = {
      userId,
      rating,
      review,
    };
    doctor.reviews.push(newRating);

    await doctor.save();

    res.status(200).json({ message: "new review added", doctor });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const getReview = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const docReviews = await doctorModel.findById(doctorId).select("reviews");
    if (!docReviews) {
      return res.status(400).json({ message: "No reviews found" });
    }
    res
      .status(200)
      .json({ message: "all reviews", reviews: docReviews.reviews });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const updatReview = async (req, res) => {
  try {
    const { doctorId, reviewId } = req.params;
    const { review, rating } = req.body;
    if (!review || !rating) {
      return res.status(400).json({ message: "all fields are required" });
    }

    const doctor = await doctorModel.findById(doctorId);

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const reviewToUpdate = doctor.reviews.id(reviewId);

    if (!reviewToUpdate) {
      return res.status(404).json({ message: "Review not found" });
    }

    reviewToUpdate.review = review;
    reviewToUpdate.rating = rating;

    await doctor.save();

    res.status(200).json({ message: "Review updated successfully", doctor });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const deleteReview = async (req, res) => {
  try {
    const { doctorId, reviewId } = req.params;
    const doctor = await doctorModel.findById(doctorId);

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const initialReviewCount = doctor.reviews.length;
    doctor.reviews = doctor.reviews.filter(
      (rev) => rev._id.toString() !== reviewId
    );

    if (doctor.reviews.length === initialReviewCount) {
      return res.status(404).json({ message: "Review not found" });
    }

    await doctor.save();

    res.status(200).json({ message: "Review deleted successfully", doctor });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const avgRating = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const doctor = await doctorModel.findById(doctorId);

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    if (doctor.reviews.length === 0) {
      return res.status(200).json({ message: "No reviews available" });
    }

    const totalRating = doctor.reviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );
    const averageRating = totalRating / doctor.reviews.length;

    res
      .status(200)
      .json({ message: "Average rating", data: averageRating.toFixed(1) });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const search = async (req, res) => {
  try {
    const { name, speciality } = req.body;
    const query = {};
    if (name) {
      query.name = { $regex: name, $options: "i" };
    }
    if (speciality) {
      query.speciality = { $regex: speciality, $options: "i" };
    }
    const doctors = await doctorModel.find(query);
    if (!doctors) {
      res.status(404).json({ message: "No doctors found" });
    }
    res.status(200).json({ success: true, data: doctors });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const filter = async (req, res) => {
  try {
    const { rating, maxFees, availability } = req.body;

    const query = {};

    if (rating) {
      query["reviews.rating"] = { $gte: rating };
    }

    if (maxFees) {
      query.fees = { $lte: maxFees };
    }

    if (availability !== undefined) {
      query.availability = availability;
    }

    const doctors = await doctorModel.find(query);
    if (doctors.length === 0) {
      return res
        .status(404)
        .json({ message: "No doctors found matching the criteria" });
    }

    res.status(200).json({ success: true, data: doctors });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const deleteDoctor = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const doctor = await doctorModel.findByIdAndDelete(doctorId);
    if (!doctor) {
      res.status(404).json({ message: "No doctor Found" });
    }
    res.status(200).json({ message: "Doctor Deleted successfully", doctor });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "server error" });
  }
};

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

const signUp = async (req, res) => {
  try {
    const { email, name, password } = req.body;
    if (!email || !name || !password) {
      return res.status(400).json({ message: "all fields  are needed" });
    }

    const exists = await doctorModel.findOne({ email });

    if (exists) {
      return res
        .status(409)
        .json({
          success:false,
          message: "Doctor already exists with this email"
        });
    }

    if (!validator.isEmail(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Please enter a valid email" });
    }
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "please enter a password with 8+ characters",
      });
    }
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newDoctor = new doctorModel({
      name: name,
      email: email,
      password: hashedPassword
    });

    const doctor = await newDoctor.save();
    const token = createToken(doctor._id);

    res.status(200).json({success: true, message: "Doctor registered", token})

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const doctor = await doctorModel.findOne({email});
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor does not exist"
      })
    }

    const isMatch = await bcrypt.compare(password, doctor.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid Credentials" });
    }

    const token = createToken(doctor._id);
    res.status(200).json({ success: true, message: "Login Successful", token })
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error" });
  }
 
};

const logout = async (req, res) => {
  try {
    return res.status(200).json({ message: "Doctor logged out successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error logging out", error });
  }
};

export {
  getAllDoctors,
  addDoctor,
  getDocById,
  updateDocProfile,
  updateDoctorAvailabity,
  getDoctorAvailability,
  addReview,
  getReview,
  updatReview,
  deleteReview,
  avgRating,
  search,
  filter,
  deleteDoctor,
  signUp,
  login,
  logout,
  changeDoctorPassword
};
