import { fetchDashboardOverview } from "../../../services/fetch";
import { addExpense, addIncome } from "../../../services/mutations";
import {
  buildGaugeData,
  buildOverviewMeta,
  normalizeRecentTransactions,
  toIsoWithClientTime,
} from "../../../utils/dashboardUtils";

/* -------- Fetch dashboard overview -------- */
export async function fetchDashboardOverviewApi(timeFrame) {
  const response = await fetchDashboardOverview();
  const data = response?.data;

  if (!response?.success) {
    return null;
  }

  const recent = normalizeRecentTransactions(data?.recentTransactions || []);
  const overviewMeta = buildOverviewMeta(data, recent);

  let gaugeData = null;

  if (timeFrame === "monthly") {
    const monthlyIncome = Number(data?.monthlyIncome || 0);
    const monthlyExpense = Number(data?.monthlyExpense || 0);
    const savings =
      typeof data?.savings !== "undefined"
        ? Number(data.savings)
        : monthlyIncome - monthlyExpense;

    gaugeData = buildGaugeData(monthlyIncome, monthlyExpense, savings);
  }

  return {
    overviewMeta,
    gaugeData,
  };
}

/* -------- Add transaction -------- */
export async function addDashboardTransactionApi(newTransaction) {
  const payload = {
    date: toIsoWithClientTime(newTransaction.date),
    description: newTransaction.description,
    amount: parseFloat(newTransaction.amount),
    category: newTransaction.category,
  };

  if (newTransaction.type === "income") {
    return await addIncome(payload);
  }

  return await addExpense(payload);
}
