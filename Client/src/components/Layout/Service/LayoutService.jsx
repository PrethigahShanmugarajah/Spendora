import { fetchExpense, fetchIncome } from "../../../services/fetch";
import {
  addExpense,
  addIncome,
  deleteExpense,
  deleteIncome,
  updateExpense,
  updateIncome,
} from "../../../services/mutations";
import {
  normalizeTransactions,
  safeArrayFromResponse,
} from "../../../utils/layoutUtils";

/* -------- Fetch all transactions -------- */
export async function fetchTransactionsApi() {
  const [incomeData, expenseData] = await Promise.all([
    fetchIncome(),
    fetchExpense(),
  ]);

  const incomes = safeArrayFromResponse(incomeData).map((i) => ({
    ...i,
    type: "income",
  }));

  const expenses = safeArrayFromResponse(expenseData).map((e) => ({
    ...e,
    type: "expense",
  }));

  return normalizeTransactions(incomes, expenses);
}

/* -------- Add transaction -------- */
export async function addTransactionApi(transaction) {
  if (transaction.type === "income") {
    return await addIncome(transaction);
  }

  return await addExpense(transaction);
}

/* -------- Edit transaction -------- */
export async function editTransactionApi(id, transaction) {
  if (transaction.type === "income") {
    return await updateIncome(id, transaction);
  }

  return await updateExpense(id, transaction);
}

/* -------- Delete transaction -------- */
export async function deleteTransactionApi(id, type) {
  if (type === "income") {
    return await deleteIncome(id);
  }

  return await deleteExpense(id);
}
