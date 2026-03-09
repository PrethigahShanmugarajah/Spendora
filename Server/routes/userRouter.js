// Server / routes / userRouter.js
import express from "express";
import {
  getCurrentUser,
  loginUser,
  registerUser,
} from "../controllers/userController.js";
import { authMiddleware } from "../middlewares/auth.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/profile", authMiddleware, getCurrentUser);

export default userRouter;
