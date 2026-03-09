// Server / controllers / incomeController.js
import incomeModel from "../models/incomeModel.js";

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
