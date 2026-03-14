import incomeModel from "../models/incomeModel.js";
import XLSX from "xlsx";
import getDateRange from "../utils/dateFilter.js";

/* -------- Add Income -------- */
export async function addIncome(req, res) {
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

    const totalIncome = incomes.reduce(
      (sum, income) => sum + (income.amount || 0),
      0,
    );

    return res.status(200).json({
      success: true,
      message: incomes.length
        ? "Incomes fetched successfully."
        : "No incomes found yet.",
      incomes,
      length: incomes.length,
      totalIncome,
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
      message:
        "An unexpected error occurred while fetching the income details.",
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

    const filter = String(req.query.filter || "all");
    const range = String(req.query.range || "monthly");
    const counter = Number.parseInt(req.query.counter, 10) || 0;

    const query = { userId };

    const categoryFilters = new Set([
      "Salary",
      "Freelance",
      "Business",
      "Tuition",
      "Rental",
      "Bank Interest",
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

    const incomes = await incomeModel.find(query).sort({ date: -1 });

    if (!incomes.length) {
      return res.status(404).json({
        success: false,
        message: "No income data found to download for the selected filter.",
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

    const baseFileName = `Income_Details_${safeFilter}_${safeRange}_${timeStamp}`;
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

/* -------- Get Income Overview -------- */
export async function getIncomeOverview(req, res) {
  try {
    const userId = req.user._id;
    const { range = "monthly" } = req.query;
    const { start, end } = getDateRange(range);

    const incomes = await incomeModel
      .find({
        userId,
        date: { $gte: start, $lte: end },
      })
      .sort({ date: -1 });

    const totalIncome = incomes.reduce((acc, cur) => acc + cur.amount, 0);
    const averageIncome = incomes.length > 0 ? totalIncome / incomes.length : 0;
    const numberOfTransactions = incomes.length;
    const recentTransactions = incomes.slice(0, 9);

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
      message: incomes.length
        ? `Income overview for ${rangeText} fetched successfully.`
        : `No income transactions found for ${rangeText}.`,
      data: {
        totalIncome,
        averageIncome,
        numberOfTransactions,
        recentTransactions,
        range,
      },
    });
  } catch (error) {
    console.error(
      "Get Income Overview Error:",
      error?.stack || error?.message || error,
    );

    return res.status(500).json({
      success: false,
      message:
        "An unexpected error occurred while fetching the income overview.",
      error: `Get Income Overview Error: ${error?.stack || error?.message || error}`,
    });
  }
}
