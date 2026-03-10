// Server / routes / expenseRouter.js
import express from "express";
import { authMiddleware } from "../middlewares/auth.js";
import {
  addExpense,
  deleteExpense,
  downloadExpenseExcel,
  getExpenseById,
  getExpenses,
  updateExpense,
} from "../controllers/expenseController.js";

const expenseRouter = express.Router();

expenseRouter.post("/add", authMiddleware, addExpense);
expenseRouter.get("/get", authMiddleware, getExpenses);
expenseRouter.get("/get/:id", authMiddleware, getExpenseById);
expenseRouter.put("/update/:id", authMiddleware, updateExpense);
expenseRouter.delete("/delete/:id", authMiddleware, deleteExpense);
expenseRouter.get("/download", authMiddleware, downloadExpenseExcel);

export default expenseRouter;
