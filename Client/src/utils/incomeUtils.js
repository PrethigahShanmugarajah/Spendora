// Client / src / utils / incomeUtils.js

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

/* -------- Get only income transactions -------- */
export function getIncomeTransactions(transactions = []) {
  return transactions
    .filter((transaction) => transaction.type === "income")
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

/* -------- Filter income transactions by selected timeframe -------- */
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

/* -------- Build income chart data -------- */
export function buildIncomeChartData(
  chartPoints = [],
  transactions = [],
  timeFrame,
) {
  const data = chartPoints.map((point) => ({ ...point, income: 0 }));

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
      point.income += Math.round(Number(transaction.amount));
    }
  });

  return data;
}

/* -------- Calculate total income -------- */
export function calculateTotalIncome(transactions = []) {
  return transactions.reduce(
    (sum, transaction) => sum + Math.round(Number(transaction.amount || 0)),
    0,
  );
}

/* -------- Calculate average income -------- */
export function calculateAverageIncome(transactions = []) {
  if (!transactions.length) {
    return 0;
  }

  const total = calculateTotalIncome(transactions);
  return Math.round(total / transactions.length);
}

/* -------- Build export data -------- */
export function buildIncomeExportData(transactions = []) {
  return transactions.map((transaction) => ({
    Date: new Date(transaction.date).toLocaleDateString(),
    Description: transaction.description,
    Category: transaction.category,
    Amount: transaction.amount,
    Type: "Income",
  }));
}
