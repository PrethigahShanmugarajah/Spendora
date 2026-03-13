// Client / src / utils / dashboardUtils.js

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

/* -------- Check whether date is inside range -------- */
export function isDateInRange(date, start, end) {
  const transactionDate = new Date(date);
  const startDate = new Date(start);
  const endDate = new Date(end);

  transactionDate.setHours(0, 0, 0, 0);
  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(23, 59, 59, 999);

  return transactionDate >= startDate && transactionDate <= endDate;
}

/* -------- Normalize recent dashboard transactions -------- */
export function normalizeRecentTransactions(items = []) {
  return (items || []).map((item) => {
    const typeFromServer = item.type || (item.category ? "expense" : "income");
    const amountNum = Number(item.amount) || 0;

    const isoDate = item.date
      ? new Date(item.date).toISOString()
      : item.createdAt
        ? new Date(item.createdAt).toISOString()
        : new Date().toISOString();

    return {
      id: item._id || item.id || Date.now() + Math.random(),
      date: isoDate,
      description:
        item.description ||
        item.note ||
        item.title ||
        (typeFromServer === "income"
          ? item.source || "Income"
          : item.category || "Expense"),
      amount: amountNum,
      type: typeFromServer,
      category:
        item.category || (typeFromServer === "income" ? "Salary" : "Other"),
      raw: item,
    };
  });
}

/* -------- Build dashboard overview meta -------- */
export function buildOverviewMeta(data, recent) {
  return {
    monthlyIncome: Number(data?.monthlyIncome || 0),
    monthlyExpense: Number(data?.monthlyExpense || 0),
    savings:
      typeof data?.savings !== "undefined"
        ? Number(data.savings)
        : Number(data?.monthlyIncome || 0) - Number(data?.monthlyExpense || 0),
    savingsRate:
      typeof data?.savingsRate !== "undefined" ? data.savingsRate : null,
    spendByCategory: data?.spendByCategory || {},
    expenseDistribution: data?.expenseDistribution || [],
    recentTransactions: recent,
  };
}

/* -------- Build gauge max values -------- */
export function getGaugeMaxValues(income, expenses, savings) {
  return {
    income: Math.max(income, 5000),
    expenses: Math.max(expenses, 3000),
    savings: Math.max(Math.abs(savings), 2000),
  };
}

/* -------- Build gauge data -------- */
export function buildGaugeData(income, expenses, savings) {
  const maxValues = getGaugeMaxValues(income, expenses, savings);

  return [
    {
      name: "Income",
      value: income,
      max: maxValues.income,
    },
    {
      name: "Spent",
      value: expenses,
      max: maxValues.expenses,
    },
    {
      name: "Savings",
      value: savings,
      max: maxValues.savings,
    },
  ];
}

/* -------- Build expense distribution chart data -------- */
export function buildFinancialOverviewData(
  timeFrame,
  overviewMeta,
  filteredTransactions,
) {
  if (
    timeFrame === "monthly" &&
    Array.isArray(overviewMeta?.expenseDistribution) &&
    overviewMeta.expenseDistribution.length > 0
  ) {
    return overviewMeta.expenseDistribution.map((d) => ({
      name: d.category,
      value: Math.round(Number(d.amount) || 0),
    }));
  }

  const categories = {};

  (filteredTransactions || []).forEach((transaction) => {
    if (transaction.type === "expense") {
      categories[transaction.category] =
        (categories[transaction.category] || 0) + transaction.amount;
    }
  });

  return Object.keys(categories).map((category) => ({
    name: category,
    value: Math.round(categories[category]),
  }));
}

/* -------- Get display summary values -------- */
export function getDisplaySummaryValues(
  timeFrame,
  overviewMeta,
  currentTimeFrameData,
) {
  return {
    displayIncome:
      timeFrame === "monthly" && typeof overviewMeta?.monthlyIncome === "number"
        ? overviewMeta.monthlyIncome
        : currentTimeFrameData.income,

    displayExpenses:
      timeFrame === "monthly" &&
      typeof overviewMeta?.monthlyExpense === "number"
        ? overviewMeta.monthlyExpense
        : currentTimeFrameData.expenses,

    displaySavings:
      timeFrame === "monthly" && typeof overviewMeta?.savings === "number"
        ? overviewMeta.savings
        : currentTimeFrameData.savings,
  };
}

/* -------- Calculate expense change percentage -------- */
export function calculateExpenseChange(prevExpenses, currentExpenses) {
  if (!prevExpenses) {
    if (!currentExpenses) return 0;
    return 100;
  }

  return Math.round(((currentExpenses - prevExpenses) / prevExpenses) * 100);
}

/* -------- Sort transactions by latest date -------- */
export function sortTransactionsByLatest(transactions = []) {
  return [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));
}

/* -------- Get recent transactions by type -------- */
export function getRecentTransactionsByType(transactions = [], type) {
  return sortTransactionsByLatest(
    (transactions || []).filter((transaction) => transaction.type === type),
  );
}

/* -------- Get display list for income or expense -------- */
export function getTransactionListForDisplay(
  timeFrame,
  serverList = [],
  localList = [],
) {
  return timeFrame === "monthly" && serverList.length > 0
    ? serverList
    : localList;
}

/* -------- Get visible transactions list -------- */
export function getDisplayedTransactions(
  list = [],
  showAll = false,
  limit = 3,
) {
  return showAll ? list : list.slice(0, limit);
}
