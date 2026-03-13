// Client / src / pages / Income / Service / IncomeService.jsx
import {
  downloadIncomeData,
  fetchIncomeOverview,
} from "../../../services/fetch";
import {
  addIncome,
  deleteIncome,
  updateIncome,
} from "../../../services/mutations";
import { toIsoWithClientTime } from "../../../utils/incomeUtils";

/* -------- Fetch income overview -------- */
export async function fetchIncomeOverviewApi(timeFrame) {
  const response = await fetchIncomeOverview(timeFrame);

  if (!response?.success) {
    return null;
  }

  const data = response?.data ?? {};

  return {
    totalIncome: data.totalIncome ?? 0,
    averageIncome: data.averageIncome ?? 0,
    numberOfTransactions: data.numberOfTransactions ?? 0,
    recentTransactions: data.recentTransactions ?? [],
    range: data.range ?? timeFrame,
  };
}

/* -------- Add income -------- */
export async function addIncomeTransactionApi(newTransaction) {
  const payload = {
    description: newTransaction.description.trim(),
    amount: parseFloat(newTransaction.amount),
    category: newTransaction.category,
    date: toIsoWithClientTime(newTransaction.date),
  };

  return await addIncome(payload);
}

/* -------- Edit income -------- */
export async function editIncomeTransactionApi(editingId, editForm) {
  const payload = {
    description: editForm.description.trim(),
    amount: parseFloat(editForm.amount),
    category: editForm.category,
    date: toIsoWithClientTime(editForm.date),
  };

  return await updateIncome(editingId, payload);
}

/* -------- Delete income -------- */
export async function deleteIncomeTransactionApi(id) {
  return await deleteIncome(id);
}

/* -------- Download income data -------- */
export async function downloadIncomeDataApi(counter = 0) {
  return await downloadIncomeData(counter);
}
