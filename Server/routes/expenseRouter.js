// Server / routes / expenseRouter.js
import express from "express";
import { authMiddleware } from "../middlewares/auth.js";
import { addExpense, getExpenses } from "../controllers/expenseController.js";

const expenseRouter = express.Router();

expenseRouter.post("/add", authMiddleware, addExpense);
expenseRouter.get("/get", authMiddleware, getExpenses);

export default expenseRouter;
