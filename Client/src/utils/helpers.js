import { toast } from "react-toastify";
import * as XLSX from "xlsx";

/* -------- Get the currency symbol or code from environment variables -------- */
export const CURRENCY = import.meta.env.VITE_CURRENCY;

/* -------- Get the start and end date for the current time frame -------- */
export const getTimeFrameRange = (timeFrame) => {
  const now = new Date();
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);

  if (timeFrame === "daily") {
    return { start, end: new Date(now), label: "Today" };
  }

  if (timeFrame === "weekly") {
    const startOfWeek = new Date(start);
    startOfWeek.setDate(start.getDate() - start.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    return { start: startOfWeek, end: new Date(now), label: "This Week" };
  }

  if (timeFrame === "monthly") {
    const startOfMonth = new Date(start.getFullYear(), start.getMonth(), 1);
    startOfMonth.setHours(0, 0, 0, 0);
    return { start: startOfMonth, end: new Date(now), label: "This Month" };
  }

  if (timeFrame === "yearly") {
    const startOfYear = new Date(start.getFullYear(), 0, 1);
    startOfYear.setHours(0, 0, 0, 0);
    return { start: startOfYear, end: new Date(now), label: "This Year" };
  }

  const startOfMonth = new Date(start.getFullYear(), start.getMonth(), 1);
  return { start: startOfMonth, end: new Date(now), label: "This Month" };
};

/* -------- Get the start and end date for the previous time frame -------- */
export const getPreviousTimeFrameRange = (timeFrame) => {
  const now = new Date();
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);

  if (timeFrame === "daily") {
    const yesterday = new Date(start);
    yesterday.setDate(start.getDate() - 1);
    const end = new Date(
      yesterday.getFullYear(),
      yesterday.getMonth(),
      yesterday.getDate(),
      23,
      59,
      59,
      999,
    );
    return {
      start: yesterday,
      end,
      label: "Yesterday",
    };
  }

  if (timeFrame === "weekly") {
    const startOfLastWeek = new Date(start);
    startOfLastWeek.setDate(start.getDate() - start.getDay() - 7);
    startOfLastWeek.setHours(0, 0, 0, 0);
    const endOfLastWeek = new Date(startOfLastWeek);
    endOfLastWeek.setDate(startOfLastWeek.getDate() + 6);
    endOfLastWeek.setHours(23, 59, 59, 999);
    return { start: startOfLastWeek, end: endOfLastWeek, label: "Last Week" };
  }

  if (timeFrame === "monthly") {
    const startOfLastMonth = new Date(
      start.getFullYear(),
      start.getMonth() - 1,
      1,
    );
    startOfLastMonth.setHours(0, 0, 0, 0);
    const endOfLastMonth = new Date(start.getFullYear(), start.getMonth(), 0);
    endOfLastMonth.setHours(23, 59, 59, 999);
    return {
      start: startOfLastMonth,
      end: endOfLastMonth,
      label: "Last Month",
    };
  }

  if (timeFrame === "yearly") {
    const startOfLastYear = new Date(start.getFullYear() - 1, 0, 1);
    startOfLastYear.setHours(0, 0, 0, 0);
    const endOfLastYear = new Date(
      start.getFullYear() - 1,
      11,
      31,
      23,
      59,
      59,
      999,
    );
    return { start: startOfLastYear, end: endOfLastYear, label: "Last Year" };
  }

  const startOfLastMonth = new Date(
    start.getFullYear(),
    start.getMonth() - 1,
    1,
  );
  startOfLastMonth.setHours(0, 0, 0, 0);
  const endOfLastMonth = new Date(start.getFullYear(), start.getMonth(), 0);
  endOfLastMonth.setHours(23, 59, 59, 999);
  return { start: startOfLastMonth, end: endOfLastMonth, label: "Last Month" };
};

/* -------- Calculate total income, expenses, and savings from transactions -------- */
export const calculateData = (transactions) => {
  const totals = transactions.reduce(
    (data, t) => {
      const amt = Number(t.amount) || 0;
      if (t.type === "income") {
        data.income += amt;
      } else {
        data.expenses += amt;
      }
      return data;
    },
    { income: 0, expenses: 0 },
  );

  return { ...totals, savings: totals.income - totals.expenses };
};

/* -------- Generate time-based chart points for a time frame -------- */
export const generateChartPoints = (timeFrame) => {
  const now = new Date();
  const points = [];

  if (timeFrame === "daily") {
    for (let i = 0; i < 24; i++) {
      const hour = new Date(now);
      hour.setHours(i, 0, 0, 0);
      points.push({
        date: hour,
        label: hour.toLocaleTimeString([], { hour: "2-digit" }),
        hour: i,
        isCurrent: i === now.getHours(),
      });
    }
  } else if (timeFrame === "weekly") {
    const start = new Date(now);
    start.setDate(now.getDate() - now.getDay());
    start.setHours(0, 0, 0, 0);

    for (let i = 0; i < 7; i++) {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      points.push({
        date: day,
        label: day.toLocaleDateString("en-US", { weekday: "short" }),
        isCurrent:
          day.getDate() === now.getDate() && day.getMonth() === now.getMonth(),
      });
    }
  } else if (timeFrame === "monthly") {
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const daysInMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
    ).getDate();

    for (let i = 1; i <= daysInMonth; i++) {
      const day = new Date(now.getFullYear(), now.getMonth(), i);
      points.push({
        date: day,
        label: day.toLocaleDateString("en-US", { day: "numeric" }),
        isCurrent: i === now.getDate(),
      });
    }
  } else if (timeFrame === "yearly") {
    for (let i = 0; i < 12; i++) {
      const month = new Date(now.getFullYear(), i, 1);
      points.push({
        date: month,
        label: month.toLocaleDateString("en-US", { month: "short" }),
        isCurrent: i === now.getMonth(),
      });
    }
  } else {
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const daysInMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
    ).getDate();

    for (let i = 1; i <= daysInMonth; i++) {
      const day = new Date(now.getFullYear(), now.getMonth(), i);
      points.push({
        date: day,
        label: day.toLocaleDateString("en-US", { day: "numeric" }),
        isCurrent: i === now.getDate(),
      });
    }
  }

  return points;
};

/* -------- Export transaction data to an Excel file -------- */
export const exportToExcel = (data, fileName = "transactions") => {
  if (!data || data.length === 0) {
    toast.warn("No data to export");
    return;
  }

  try {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");

    XLSX.writeFile(workbook, `${fileName}.xlsx`, {
      bookType: "xlsx",
      type: "array",
    });
  } catch (error) {
    console.error("Export error:", error);
    toast.error("Error exporting data. Please try again.");
  }
};

/* -------- Convert date to ISO with current client time -------- */
export function toIsoWithClientTime(dateValue) {
  if (!dateValue) {
    return new Date().toISOString();
  }

  if (typeof dateValue === "string" && dateValue.length === 10) {
    const now = new Date();
    const hhmmss = now.toTimeString().slice(0, 8);
    const combined = new Date(`${dateValue}T${hhmmss}`);
    return combined.toISOString();
  }

  try {
    return new Date(dateValue).toISOString();
  } catch (error) {
    return new Date().toISOString();
  }
}

/* -------- Check whether date is inside given range -------- */
export function isDateInRange(date, start, end) {
  const transactionDate = new Date(date);
  const startDate = new Date(start);
  const endDate = new Date(end);

  transactionDate.setHours(0, 0, 0, 0);
  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(23, 59, 59, 999);

  return transactionDate >= startDate && transactionDate <= endDate;
}

/* -------- Filter transactions by timeframe -------- */
export function getTimeFrameTransactions(transactions = [], timeFrameRange) {
  return transactions.filter((transaction) =>
    isDateInRange(transaction.date, timeFrameRange.start, timeFrameRange.end),
  );
}

/* -------- Filter transactions by selected filter -------- */
export function getFilteredTransactions(
  transactions = [],
  filter,
  timeFrameRange,
) {
  if (filter === "all") {
    return transactions;
  }

  return transactions.filter((transaction) => {
    if (filter === "month" || filter === "year") {
      const transactionDate = new Date(transaction.date);

      if (filter === "month") {
        return (
          transactionDate.getMonth() === timeFrameRange.start.getMonth() &&
          transactionDate.getFullYear() === timeFrameRange.start.getFullYear()
        );
      }

      if (filter === "year") {
        return (
          transactionDate.getFullYear() === timeFrameRange.start.getFullYear()
        );
      }
    }

    return transaction.category.toLowerCase() === filter.toLowerCase();
  });
}

/* -------- Extract auth profile from API response -------- */
export const extractAuthProfile = (data) => {
  let profile = data?.user ?? null;

  if (!profile) {
    const copy = { ...(data || {}) };
    delete copy.token;
    delete copy.user;

    if (Object.keys(copy).length) {
      profile = copy;
    }
  }

  return profile;
};

/* -------- Get transactions by type (income or expense) -------- */
export function getTransactionsByType(transactions = [], type) {
  return transactions
    .filter((transaction) => transaction.type === type)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

/* -------- Build transaction chart data -------- */
export function buildTransactionChartData(
  chartPoints = [],
  transactions = [],
  timeFrame,
  key,
) {
  const data = chartPoints.map((point) => ({ ...point, [key]: 0 }));

  transactions.forEach((transaction) => {
    const transactionDate = new Date(transaction.date);

    const point = data.find((item) =>
      timeFrame === "daily"
        ? item.hour === transactionDate.getHours()
        : timeFrame === "yearly"
          ? item.date.getMonth() === transactionDate.getMonth()
          : item.date.getDate() === transactionDate.getDate() &&
            item.date.getMonth() === transactionDate.getMonth(),
    );

    if (point) {
      point[key] += Math.round(Number(transaction.amount));
    }
  });

  return data;
}

/* -------- Calculate total amount from transactions -------- */
export function calculateTotalAmount(transactions = []) {
  return transactions.reduce(
    (sum, transaction) => sum + Math.round(Number(transaction.amount || 0)),
    0,
  );
}

/* -------- Calculate average amount -------- */
export function calculateAverageAmount(transactions = []) {
  if (!transactions.length) return 0;
  const total = calculateTotalAmount(transactions);
  return Math.round(total / transactions.length);
}

/* -------- Build export data for transactions -------- */
export function buildExportData(transactions = [], typeLabel) {
  return transactions.map((transaction) => ({
    Date: new Date(transaction.date).toLocaleDateString(),
    Description: transaction.description,
    Category: transaction.category,
    Amount: transaction.amount,
    Type: typeLabel,
  }));
}

/* -------- Save auth data in storage -------- */
export function persistUserAuth({ profile, token, rememberMe }) {
  const storage = rememberMe ? localStorage : sessionStorage;
  try {
    if (token) {
      storage.setItem("token", token);
    }
    if (profile) {
      storage.setItem("user", JSON.stringify(profile));
    }
  } catch (error) {
    console.error("Storage Error:", error);
  }
}
