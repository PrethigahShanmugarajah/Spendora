// Server / routes / incomeRouter.js
import express from "express";
import { authMiddleware } from "../middlewares/auth.js";
import { addIncome } from "../controllers/incomeController.js";

const incomeRouter = express.Router();

incomeRouter.post("/add", authMiddleware, addIncome);

export default incomeRouter;
