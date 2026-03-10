// Server / routes / expenseRouter.js
import express from "express";
import { authMiddleware } from "../middlewares/auth.js";
import { addExpense } from "../controllers/expenseController.js";

const expenseRouter = express.Router();

expenseRouter.post("/add", authMiddleware, addExpense);

export default expenseRouter;
