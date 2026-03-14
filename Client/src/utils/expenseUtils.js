import {
  buildExportData,
  buildTransactionChartData,
  calculateAverageAmount,
  calculateTotalAmount,
  getTransactionsByType,
} from "./helpers";

/* -------- Get only expense transactions -------- */
export function getExpenseTransactions(transactions = []) {
  return getTransactionsByType(transactions, "expense");
}

/* -------- Build expense chart data -------- */
export function buildExpenseChartData(
  chartPoints = [],
  transactions = [],
  timeFrame,
) {
  return buildTransactionChartData(
    chartPoints,
    transactions,
    timeFrame,
    "expense",
  );
}

/* -------- Calculate total expense -------- */
export function calculateTotalExpense(transactions = []) {
  return calculateTotalAmount(transactions);
}

/* -------- Calculate average expense -------- */
export function calculateAverageExpense(transactions = []) {
  return calculateAverageAmount(transactions);
}

/* -------- Build export data -------- */
export function buildExpenseExportData(transactions = []) {
  return buildExportData(transactions, "Expense");
}
