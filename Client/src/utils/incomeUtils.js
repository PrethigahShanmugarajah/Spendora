import {
  buildExportData,
  buildTransactionChartData,
  calculateAverageAmount,
  calculateTotalAmount,
  getTransactionsByType,
} from "./helpers";

/* -------- Get only income transactions -------- */
export function getIncomeTransactions(transactions = []) {
  return getTransactionsByType(transactions, "income");
}

/* -------- Build income chart data -------- */
export function buildIncomeChartData(
  chartPoints = [],
  transactions = [],
  timeFrame,
) {
  return buildTransactionChartData(
    chartPoints,
    transactions,
    timeFrame,
    "income",
  );
}

/* -------- Calculate total income -------- */
export function calculateTotalIncome(transactions = []) {
  return calculateTotalAmount(transactions);
}

/* -------- Calculate average income -------- */
export function calculateAverageIncome(transactions = []) {
  return calculateAverageAmount(transactions);
}

/* -------- Build export data -------- */
export function buildIncomeExportData(transactions = []) {
  return buildExportData(transactions, "Income");
}
