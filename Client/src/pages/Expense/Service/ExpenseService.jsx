// Client / src / pages / Expense / Service / ExpenseService.jsx
import {
  downloadExpenseData,
  fetchExpenseOverview,
} from "../../../services/fetch";
import {
  addExpense,
  deleteExpense,
  updateExpense,
} from "../../../services/mutations";
import { toIsoWithClientTime } from "../../../utils/helpers";

/* -------- Fetch expense overview -------- */
export async function fetchExpenseOverviewApi(timeFrame) {
  const response = await fetchExpenseOverview(timeFrame);

  if (!response?.success) {
    return null;
  }

  const data = response?.data ?? {};

  return {
    totalExpense: data.totalExpense ?? 0,
    averageExpense: data.averageExpense ?? 0,
    numberOfTransactions: data.numberOfTransactions ?? 0,
    recentTransactions: data.recentTransactions ?? [],
    range: data.range ?? timeFrame,
  };
}

/* -------- Add expense -------- */
export async function addExpenseTransactionApi(newTransaction) {
  const payload = {
    description: newTransaction.description.trim(),
    amount: parseFloat(newTransaction.amount),
    category: newTransaction.category,
    date: toIsoWithClientTime(newTransaction.date),
  };

  return await addExpense(payload);
}

/* -------- Edit expense -------- */
export async function editExpenseTransactionApi(editingId, editForm) {
  const payload = {
    description: editForm.description.trim(),
    amount: parseFloat(editForm.amount),
    category: editForm.category,
    date: toIsoWithClientTime(editForm.date),
  };

  return await updateExpense(editingId, payload);
}

/* -------- Delete expense -------- */
export async function deleteExpenseTransactionApi(id) {
  return await deleteExpense(id);
}

/* -------- Download expense data -------- */
export async function downloadExpenseDataApi(counter = 0) {
  return await downloadExpenseData(counter);
}
