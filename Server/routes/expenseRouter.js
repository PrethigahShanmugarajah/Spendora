// Server / routes / expenseRouter.js
import express from "express";
import { authMiddleware } from "../middlewares/auth.js";
import {
  addExpense,
  getExpenseById,
  getExpenses,
  updateExpense,
} from "../controllers/expenseController.js";

const expenseRouter = express.Router();

expenseRouter.post("/add", authMiddleware, addExpense);
expenseRouter.get("/get", authMiddleware, getExpenses);
expenseRouter.get("/get/:id", authMiddleware, getExpenseById);
expenseRouter.put("/update/:id", authMiddleware, updateExpense);

export default expenseRouter;
