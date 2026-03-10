// Server / controllers / expenseController.js
import expenseModel from "../models/expenseModel.js";

/* -------- Add Expense -------- */
export async function addExpense(req, res) {
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

    const newExpense = new expenseModel({
      userId,
      description,
      amount,
      category,
      date: new Date(date),
    });

    await newExpense.save();

    return res.status(201).json({
      success: true,
      message: "Expense added successfully.",
      expense: newExpense,
    });
  } catch (error) {
    console.error(
      "Add Expense Error:",
      error?.stack || error?.message || error,
    );

    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred while adding expense.",
      error: `Add Expense Error: ${error?.stack || error?.message || error}`,
    });
  }
}

/* -------- Get Expenses -------- */
export async function getExpenses(req, res) {
  try {
    const userId = req.user._id;
    const expenses = await expenseModel.find({ userId }).sort({ date: -1 });

    return res.status(200).json({
      success: true,
      message: expenses.length
        ? "Expenses fetched successfully."
        : "No expenses found yet.",
      expenses,
      length: expenses.length,
    });
  } catch (error) {
    console.error(
      "Get Expenses Error:",
      error?.stack || error?.message || error,
    );

    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred while fetching expenses.",
      error: `Get Expenses Error: ${error?.stack || error?.message || error}`,
    });
  }
}

/* -------- Get Expense -------- */
export async function getExpenseById(req, res) {
  try {
    const userId = req.user._id;
    const expenseId = req.params.id;

    if (!expenseId) {
      return res.status(400).json({
        success: false,
        message: "Expense ID is required.",
      });
    }

    const expense = await expenseModel.findOne({ _id: expenseId, userId });
    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Expense fetched successfully.",
      expense,
    });
  } catch (error) {
    console.error(
      "Get Expense Error:",
      error?.stack || error?.message || error,
    );

    return res.status(500).json({
      success: false,
      message:
        "An unexpected error occurred while fetching the expense details.",
      error: `Get Expense Error: ${error?.stack || error?.message || error}`,
    });
  }
}

/* -------- Update Expense -------- */
export async function updateExpense(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const { description, amount } = req.body;

    // if (!description || !amount) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Both description and amount are required to update expense.",
    //   });
    // }

    if (!description) {
      return res.status(400).json({
        success: false,
        message: "Expense description is required.",
      });
    }

    if (!amount) {
      return res.status(400).json({
        success: false,
        message: "Expense amount is required.",
      });
    }

    const updatedExpense = await expenseModel.findOneAndUpdate(
      { _id: id, userId },
      { description, amount },
      { new: true },
    );

    if (!updatedExpense) {
      return res.status(404).json({
        success: false,
        message: "Expense with the specified ID was not found for this user.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Expense updated successfully.",
      data: updatedExpense,
    });
  } catch (error) {
    console.error(
      "Update Expenses Error:",
      error?.stack || error?.message || error,
    );

    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred while updating the expense.",
      error: `Update Expenses Error: ${error?.stack || error?.message || error}`,
    });
  }
}

/* -------- Delete Expense -------- */
export async function deleteExpense(req, res) {
  try {
    const userId = req.user._id;
    const expenseId = req.params.id;

    const expense = await expenseModel.findOneAndDelete({
      _id: expenseId,
      userId,
    });

    if (!expense) {
      return res.status(404).json({
        success: false,
        message:
          "Expense not found or you do not have permission to delete it.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Expense deleted successfully.",
    });
  } catch (error) {
    console.error(
      "Delete Expense Error:",
      error?.stack || error?.message || error,
    );

    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred while deleting the expense.",
      error: `Delete Expense Error: ${error?.stack || error?.message || error}`,
    });
  }
}
