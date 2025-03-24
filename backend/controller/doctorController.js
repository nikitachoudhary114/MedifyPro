import doctorModel from "../model/doctorModel.js";

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
      image,
      degree,
      experience,
      about,
      timing,
    } = req.body;
    if (
      !name ||
      !email ||
      !password ||
      !speciality ||
      !phone ||
      !address ||
      !fees ||
      !degree ||
      !experience ||
      !about ||
      !timing
    ) {
      res.status(400).json({ message: "All fields are required" });
    }
    const newDoc = new doctorModel({
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
    });
    await newDoc.save();
    res.status(201).json({
      success: true,
      message: "Doctor added successfully",
      doctor: newDoc,
    });
  } catch (error) {
    console.log(error);
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
    res
      .status(200)
      .json({
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

    res.status(200).json({ message: "Doctor availability updated successfully", doctor: doc });
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
    res.status(500).json({success:false, message: "Server Error"})
  }
}

const addReview = async (req, res) => {
  try {
    const { userId, review, rating } = req.body;
    const { doctorId } = req.params;

    const doctor =await doctorModel.findById(doctorId);

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    const newRating ={
      userId, rating, review
    }
    doctor.reviews.push(newRating);
    
    await doctor.save();

    res.status(200).json({message:"new review added", doctor})
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server Error" })
  }
}

const getReview = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const docReviews =await doctorModel.findById(doctorId).select("reviews");
    if (!docReviews) {
      return res.status(400).json({ message: "No reviews found" })
    }
    res.status(200).json({ message: "all reviews",reviews: docReviews.reviews })
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server Error" })
  }
}

const updatReview = async (req, res) => {
  try {
    const { doctorId,  reviewId } = req.params;
    const { review, rating } = req.body;
    if (!review || !rating) {
      return res.status(400).json({ message: "all fields are required" })
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
    res.status(500).json({ success: false, message: "Server Error" })
  }
}

const deleteReview = async (req, res) => {
  try {
    const { doctorId, reviewId } = req.params;
    const doctor = await doctorModel.findById(doctorId);

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const initialReviewCount = doctor.reviews.length;
    doctor.reviews = doctor.reviews.filter((rev) => rev._id.toString() !== reviewId);

    if (doctor.reviews.length === initialReviewCount) {
      return res.status(404).json({ message: "Review not found" });
    }
   
    await doctor.save();

    res.status(200).json({ message: "Review deleted successfully", doctor });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server Error" })
  }
}

const avgRating = async(req, res) => {
  try {
    const { doctorId } = req.params;
    const doctor = await doctorModel.findById(doctorId);

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    if (doctor.reviews.length === 0) {
      return res.status(200).json({message: "No reviews available"})
    }

    const totalRating = doctor.reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / doctor.reviews.length;


    res.status(200).json({ message: "Average rating", data: averageRating.toFixed(1) });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server Error" })
  }

}

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
  avgRating
};
