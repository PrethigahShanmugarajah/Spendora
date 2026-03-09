// Server / routes / incomeRouter.js
import express from "express";
import { authMiddleware } from "../middlewares/auth.js";
import {
  addIncome,
  getIncomeById,
  getIncomes,
  updateIncome,
} from "../controllers/incomeController.js";

const incomeRouter = express.Router();

incomeRouter.post("/add", authMiddleware, addIncome);
incomeRouter.get("/get", authMiddleware, getIncomes);
incomeRouter.get("/get/:id", authMiddleware, getIncomeById);
incomeRouter.put("/update/:id", authMiddleware, updateIncome);

export default incomeRouter;
