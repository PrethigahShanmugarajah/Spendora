import express from "express";
import { authMiddleware } from "../middlewares/auth.js";
import {
  addIncome,
  deleteIncome,
  downloadIncomeExcel,
  getIncomeById,
  getIncomeOverview,
  getIncomes,
  updateIncome,
} from "../controllers/incomeController.js";

const incomeRouter = express.Router();

incomeRouter.post("/add", authMiddleware, addIncome);
incomeRouter.get("/get", authMiddleware, getIncomes);
incomeRouter.get("/get/:id", authMiddleware, getIncomeById);
incomeRouter.put("/update/:id", authMiddleware, updateIncome);
incomeRouter.delete("/delete/:id", authMiddleware, deleteIncome);
incomeRouter.get("/download", authMiddleware, downloadIncomeExcel);
incomeRouter.get("/overview", authMiddleware, getIncomeOverview);

export default incomeRouter;
