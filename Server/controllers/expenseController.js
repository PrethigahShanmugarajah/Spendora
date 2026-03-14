import expenseModel from "../models/expenseModel.js";
import XLSX from "xlsx";
import getDateRange from "../utils/dateFilter.js";

/* -------- Add Expense -------- */
export async function addExpense(req, res) {
  try {
    const userId = req.user._id;
    const { description, amount, category, date } = req.body;

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

    const totalExpense = expenses.reduce(
      (sum, expense) => sum + (expense.amount || 0),
      0,
    );

    return res.status(200).json({
      success: true,
      message: expenses.length
        ? "Expenses fetched successfully."
        : "No expenses found yet.",
      expenses,
      length: expenses.length,
      totalExpense,
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

/* -------- Download the data in an excel sheet -------- */
export async function downloadExpenseExcel(req, res) {
  try {
    const userId = req.user._id;

    const filter = String(req.query.filter || "all");
    const range = String(req.query.range || "monthly");
    const counter = Number.parseInt(req.query.counter, 10) || 0;

    const query = { userId };

    const categoryFilters = new Set([
      "Groceries",
      "Dining",
      "Rent",
      "Utilities",
      "Transport",
      "Healthcare",
      "Other",
    ]);

    const now = new Date();
    let startDate = null;
    let endDate = null;

    if (filter === "month") {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        0,
        23,
        59,
        59,
        999,
      );
    } else if (filter === "year") {
      startDate = new Date(now.getFullYear(), 0, 1);
      endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
    } else {
      if (range === "weekly") {
        const startOfWeek = new Date(now);
        const day = startOfWeek.getDay();
        const diff = day === 0 ? -6 : 1 - day;

        startOfWeek.setDate(startOfWeek.getDate() + diff);
        startOfWeek.setHours(0, 0, 0, 0);

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(endOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);

        startDate = startOfWeek;
        endDate = endOfWeek;
      } else if (range === "monthly") {
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(
          now.getFullYear(),
          now.getMonth() + 1,
          0,
          23,
          59,
          59,
          999,
        );
      } else if (range === "yearly") {
        startDate = new Date(now.getFullYear(), 0, 1);
        endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
      }
    }

    if (categoryFilters.has(filter)) {
      query.category = filter;
    }

    if (startDate && endDate) {
      query.date = {
        $gte: startDate,
        $lte: endDate,
      };
    }

    const expenses = await expenseModel.find(query).sort({ date: -1 });

    if (!expenses.length) {
      return res.status(404).json({
        success: false,
        message: "No expense data found to download for the selected filter.",
      });
    }

    const plainData = expenses.map((exp) => ({
      Description: exp.description,
      Amount: exp.amount,
      Category: exp.category,
      Date: new Date(exp.date).toLocaleDateString(),
    }));

    const worksheet = XLSX.utils.json_to_sheet(plainData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "ExpenseData");

    const excelBuffer = XLSX.write(workbook, {
      type: "buffer",
      bookType: "xlsx",
    });

    const safeFilter =
      filter === "all" ? "All_Transactions" : filter.replace(/\s+/g, "_");
    const safeRange = range.replace(/\s+/g, "_");
    const timeStamp = new Date()
      .toISOString()
      .slice(0, 19)
      .replace(/[:T]/g, "-");

    const baseFileName = `Expense_Details_${safeFilter}_${safeRange}_${timeStamp}`;
    const fileName =
      counter > 0 ? `${baseFileName}(${counter}).xlsx` : `${baseFileName}.xlsx`;

    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    res.setHeader(
      "Access-Control-Expose-Headers",
      "Content-Disposition, X-Success, X-Message",
    );
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

/* -------- Get Expense Overview -------- */
export async function getExpenseOverview(req, res) {
  try {
    const userId = req.user._id;
    const { range = "monthly" } = req.query;
    const { start, end } = getDateRange(range);

    const expenses = await expenseModel
      .find({
        userId,
        date: { $gte: start, $lte: end },
      })
      .sort({ date: -1 });

    const totalExpense = expenses.reduce((acc, cur) => acc + cur.amount, 0);
    const averageExpense =
      expenses.length > 0 ? totalExpense / expenses.length : 0;
    const numberOfTransactions = expenses.length;
    const recentTransactions = expenses.slice(0, 9);

    let rangeText = "";
    const options = { year: "numeric", month: "long", day: "numeric" };
    if (range === "daily") {
      rangeText = start.toLocaleDateString("en-US", options);
    } else if (range === "weekly") {
      rangeText = `${start.toLocaleDateString("en-US", options)} - ${end.toLocaleDateString(
        "en-US",
        options,
      )}`;
    } else if (range === "monthly") {
      rangeText = start.toLocaleString("en-US", {
        month: "long",
        year: "numeric",
      });
    } else if (range === "yearly") {
      rangeText = start.getFullYear();
    } else {
      rangeText = `${start.toDateString()} - ${end.toDateString()}`;
    }

    return res.status(200).json({
      success: true,
      message: expenses.length
        ? `Expense overview for ${rangeText} fetched successfully.`
        : `No expense transactions found for ${rangeText}.`,
      data: {
        totalExpense,
        averageExpense,
        numberOfTransactions,
        recentTransactions,
        range,
      },
    });
  } catch (error) {
    console.error(
      "Get Expense Overview Error:",
      error?.stack || error?.message || error,
    );

    return res.status(500).json({
      success: false,
      message:
        "An unexpected error occurred while fetching the expense overview.",
      error: `Get Expense Overview Error: ${error?.stack || error?.message || error}`,
    });
  }
}
