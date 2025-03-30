import express from "express";
import { allUsers, deleteUser, editProfile, getProfile, getSpecificUser, loginUser, logoutUser, registerUser } from "../controller/userContoller.js";
import { auth } from "../middleware/auth.js";
const userRouter = express.Router();

userRouter.get('/', allUsers);
userRouter.get('/profile', auth, getProfile);
userRouter.put('/profile', auth, editProfile);
userRouter.get('/:userId', getSpecificUser)
userRouter.delete('/:userId', deleteUser);
userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/logout', logoutUser);


export default userRouter;