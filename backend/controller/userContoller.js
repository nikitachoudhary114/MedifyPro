import  jwt  from "jsonwebtoken"
import validator from "validator"
import bcrypt from 'bcryptjs'
import userModel from "../model/userModel.js"
const loginUser = async (req, res) => { 
    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({ email })
        
        if (!user) {
            return res.json({ success: false, message: "User doesn't exist" })
        }
        const isMatch = await bcrypt.isMatch(user.password, password);
        if (!isMatch) {
            return res.json({success:false, message:"Invalid Credentials"})
        }
        const token = createToken(user._id);
        res.json({ success: true, token });

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: "Error" })
    }

}
const createToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET)
}
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    // check mail unique
    try {
        const exist = await userModel.findOne({ email });
        if (exist) {
            return res.json({success:false, message: "User already exist  with this email"})
        }

        //validate email and pass
        if (!validator.isEmail(email)){
            return res.json({success:false, message:"Please enter valid E-mail"})
        }
        if (password.length < 8) {
           return res.json({success:false, message:"Please enter a password with 8+ charachters"})
        }

        // salt and hashing
        const salt = await bcrypt.salt(10);
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
        res.json({success:false, message:"Error"})
    }

   

}

export {loginUser, registerUser}