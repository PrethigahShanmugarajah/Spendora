// Server / controllers / incomeController.js
import incomeModel from "../models/incomeModel.js";
import XLSX from "xlsx";
import fs from "fs";
import path from "path";

/* -------- Add Income -------- */
export async function addIncome(req, res) {
  try {
    const userId = req.user._id;
    const { description, amount, category, date } = req.body;

    // if (!description || !amount || !category || !date) {
    //   return res.status(400).json({
    //     success: false,
    //     message:
    //       "All fields (description, amount, category, date) are required.",
    //   });
    // }

    if (!description) {
      return res.status(400).json({
        success: false,
        message: "Description is required.",
      });
    }

    if (!amount) {
      return res.status(400).json({
        success: false,
        message: "Amount is required.",
      });
    }

    if (!category) {
      return res.status(400).json({
        success: false,
        message: "Category is required.",
      });
    }

    if (!date) {
      return res.status(400).json({
        success: false,
        message: "Date is required.",
      });
    }

    const newIncome = new incomeModel({
      userId,
      description,
      amount,
      category,
      date: new Date(date),
    });

    await newIncome.save();

    return res.status(201).json({
      success: true,
      message: "Income added successfully.",
      income: newIncome,
    });
  } catch (error) {
    console.error("Add Income Error:", error?.stack || error?.message || error);

    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred while adding income.",
      error: `Add Income Error: ${error?.stack || error?.message || error}`,
    });
  }
}

/* -------- Get Incomes -------- */
export async function getIncomes(req, res) {
  try {
    const userId = req.user._id;
    const incomes = await incomeModel.find({ userId }).sort({ date: -1 });
    return res.status(200).json({
      success: true,
      message: incomes.length
        ? "Incomes fetched successfully."
        : "No incomes found yet.",
      incomes,
      length: incomes.length,
    });
  } catch (error) {
    console.error(
      "Get Incomes Error:",
      error?.stack || error?.message || error,
    );

    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred while fetching incomes.",
      error: `Get Incomes Error: ${error?.stack || error?.message || error}`,
    });
  }
}

/* -------- Get Income -------- */
export async function getIncomeById(req, res) {
  try {
    const userId = req.user._id;
    const incomeId = req.params.id;

    if (!incomeId) {
      return res.status(400).json({
        success: false,
        message: "Income ID is required.",
      });
    }

    const income = await incomeModel.findOne({ _id: incomeId, userId });
    if (!income) {
      return res.status(404).json({
        success: false,
        message: "Income not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Income fetched successfully.",
      income,
    });
  } catch (error) {
    console.error("Get Income Error:", error?.stack || error?.message || error);

    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred while fetching the income.",
      error: `Get Income Error: ${error?.stack || error?.message || error}`,
    });
  }
}

/* -------- Update Income -------- */
export async function updateIncome(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const { description, amount } = req.body;

    // if (!description || !amount) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Both description and amount are required to update income.",
    //   });
    // }

    if (!description) {
      return res.status(400).json({
        success: false,
        message: "Income description is required.",
      });
    }

    if (!amount) {
      return res.status(400).json({
        success: false,
        message: "Income amount is required.",
      });
    }

    const updatedIncome = await incomeModel.findOneAndUpdate(
      { _id: id, userId },
      { description, amount },
      { new: true },
    );

    if (!updatedIncome) {
      return res.status(404).json({
        success: false,
        message: "Income with the specified ID was not found for this user.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Income updated successfully.",
      data: updatedIncome,
    });
  } catch (error) {
    console.error(
      "Update Incomes Error:",
      error?.stack || error?.message || error,
    );

    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred while updating the income.",
      error: `Update Incomes Error: ${error?.stack || error?.message || error}`,
    });
  }
}

/* -------- Delete Income -------- */
export async function deleteIncome(req, res) {
  try {
    const userId = req.user._id;
    const incomeId = req.params.id;

    const income = await incomeModel.findOneAndDelete({
      _id: incomeId,
      userId,
    });

    if (!income) {
      return res.status(404).json({
        success: false,
        message: "Income not found or you do not have permission to delete it.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Income deleted successfully.",
    });
  } catch (error) {
    console.error(
      "Delete Income Error:",
      error?.stack || error?.message || error,
    );

    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred while deleting the income.",
      error: `Delete Income Error: ${error?.stack || error?.message || error}`,
    });
  }
}

/* -------- Download the data in an excel sheet -------- */
export async function downloadIncomeExcel(req, res) {
  try {
    const userId = req.user._id;
    const incomes = await incomeModel.find({ userId }).sort({ date: -1 });

    if (!incomes.length) {
      return res.status(404).json({
        success: false,
        message: "No income data found to download.",
      });
    }

    const plainData = incomes.map((inc) => ({
      Description: inc.description,
      Amount: inc.amount,
      Category: inc.category,
      Date: new Date(inc.date).toLocaleDateString(),
    }));

    const worksheet = XLSX.utils.json_to_sheet(plainData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "IncomeData");

    // XLSX.writeFile(workbook, "income_details.xlsx");
    // res.download("income_details.xlsx");

    const excelBuffer = XLSX.write(workbook, {
      type: "buffer",
      bookType: "xlsx",
    });

    const baseFileName = "Income_Details";
    const counter = Number.parseInt(req.query.counter, 10) || 0;
    const fileName =
      counter > 0 ? `${baseFileName}(${counter}).xlsx` : `${baseFileName}.xlsx`;

    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
    res.setHeader("X-Success", "true");
    res.setHeader("X-Message", "Excel generated successfully");

    return res.status(200).send(excelBuffer);
  } catch (error) {
    console.error(
      "Download the data in an excel sheet Error:",
      error?.stack || error?.message || error,
    );

    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred while generating the Excel file.",
      error: `Download the data in an excel sheet Error: ${error?.stack || error?.message || error}`,
    });
  }
}
