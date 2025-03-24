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
    const { id } = req.params;
    const doc = await doctorModel.findById(id);
    // console.log(req);
    res.status(201).json({ success: true, doctor: doc });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "server error" });
  }
};

const updateDocProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const doc = await doctorModel.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });
      
      if (!doc) {
          res.status(200).json({success:false, message: "Doctor not found" });
    }
      res.status(200).json({success:true, message: "Doctor Profile Updated Successfully", doctor: doc });
  } catch (error) {
      console.log(error);

      if (error.kind === "ObjectId") {
          res.status(400).json({success:false, message: "Invalid Doctor ID" });
      }

      res.status(500).json({success:false, message: "Server Error" });
  }
};

export { getAllDoctors, addDoctor, getDocById, updateDocProfile };
