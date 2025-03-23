import jwt from "jsonwebtoken"
import validator from "validator"
import bcrypt from 'bcryptjs'
import userModel from "../model/userModel.js"
import cloudinary from "../util/cloudinary.js";

import {CloudinaryStorage} from "multer-storage-cloudinary"
import multer from "multer"

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({ email })

        if (!user) {
            return res.json({ success: false, message: "User doesn't exist" })
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({ success: false, message: "Invalid Credentials" })
        }
        const token = createToken(user._id);
        res.json({ success: true, token });

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: "Error" })
    }

}
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET)
}
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    // check mail unique
    try {
        const exist = await userModel.findOne({ email });
        if (exist) {
            return res.json({ success: false, message: "User already exist  with this email" })
        }

        //validate email and pass
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter valid E-mail" })
        }
        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a password with 8+ characters" })
        }

        // salt and hashing
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // save in db and create token
        const newUser = new userModel({
            name: name,
            email: email,
            password: hashedPassword
        })
        const user = await newUser.save();
        const token = createToken(user._id);

        res.json({ success: true, token });


    } catch (error) {
        console.log(error)
        res.json({ success: false, message: "Error" })
    }



}


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
            return res.status(401).json({ success: false, message: "Unauthorized access" });
        }

        const user = await userModel.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
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
            }
        });
    } catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).json({ success: false, message: "Error fetching profile" });
    }
};


const editProfile = async (req, res) => {
    const { name, phone, address, dob, gender } = req.body;

    try {
        // Create an object with updated data
        const updateData = {
            name,
            phone,
            address,
            dob: dob ? new Date(dob) : null, // Convert dob to Date if provided
            gender,
        };

        // Update user data (excluding email)
        const user = await userModel.findByIdAndUpdate(
            req.user.id, // Assuming `req.user.id` contains the authenticated user's ID
            updateData,
            { new: true } // Return the updated document
        );

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Respond with updated user data
        res.status(200).json({
            success: true,
            user: {
                name: user.name,
                email: user.email, // Email remains unchanged
                phone: user.phone,
                address: user.address,
                dob: user.dob,
                gender: user.gender,
            }
        });
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ success: false, message: "Failed to update profile" });
    }
};


// const getProfile = async (req, res) => {
//     try {
//         const user = await userModel.findById(req);
//         if (!user) {
//             return res.json({ success: false, message: "User not found" });
//         }
//         console.log(user);
//         res.status(200).json(user);
//     } catch (error) {
//         console.log(error)
//         res.json({ success: false, message: "Error" })

//     }
// }

// const storage = new CloudinaryStorage({
//     cloudinary: cloudinary,
//     params: {
//         folder: "medifyPro",
//         allowed_formats: ["jpg", "jpeg", "png"],
//     }
// })

// const upload = multer({ storage }).single("image");

// const editProfile = async (req, res) => {
//     const { name, phone, addressLine1, addressLine2, dob, gender } = req.body;

//     try {
//         const updateData = {
//             name, phone, addressLine1, addressLine2,
//             dob: dob ? new Date(dob) : null,
//             gender,
//         }

//         if (req.file) {
//             updateData.image = req.file.path;
//         }

//         const user = await userModel.findByIdAndUpdate(req.user.id, updateData
//             , { new: true });
//         res.status(200).json(user);
//     } catch (error) {
//         console.log(error)
//         res.status(500).json({ error: "Failed to update profile" });

//     }
// }



export {
    loginUser, registerUser, logoutUser, getProfile, editProfile
}