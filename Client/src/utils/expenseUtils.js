// Client / src / utils / expenseUtils.js

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

/* -------- Get only expense transactions -------- */
export function getExpenseTransactions(transactions = []) {
  return transactions
    .filter((transaction) => transaction.type === "expense")
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

/* -------- Filter expense transactions by selected timeframe -------- */
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

/* -------- Build expense chart data -------- */
export function buildExpenseChartData(
  chartPoints = [],
  transactions = [],
  timeFrame,
) {
  const data = chartPoints.map((point) => ({ ...point, expense: 0 }));

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
      point.expense += Math.round(Number(transaction.amount));
    }
  });

  return data;
}

/* -------- Calculate total expense -------- */
export function calculateTotalExpense(transactions = []) {
  return transactions.reduce(
    (sum, transaction) => sum + Math.round(Number(transaction.amount || 0)),
    0,
  );
}

/* -------- Calculate average expense -------- */
export function calculateAverageExpense(transactions = []) {
  if (!transactions.length) {
    return 0;
  }

  const total = calculateTotalExpense(transactions);
  return Math.round(total / transactions.length);
}

/* -------- Build export data -------- */
export function buildExpenseExportData(transactions = []) {
  return transactions.map((transaction) => ({
    Date: new Date(transaction.date).toLocaleDateString(),
    Description: transaction.description,
    Category: transaction.category,
    Amount: transaction.amount,
    Type: "Expense",
  }));
}
