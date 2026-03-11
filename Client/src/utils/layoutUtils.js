// Client / src / utils / layoutUtils.js

/* -------- Filter transactions by timeframe -------- */
export const filterTransactions = (transactions, frame) => {
  const now = new Date();
  const today = new Date(now).setHours(0, 0, 0, 0);

  switch (frame) {
    case "daily":
      return transactions.filter((t) => new Date(t.date) >= today);

    case "weekly": {
      const startOfWeek = new Date(today);
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
      return transactions.filter((t) => new Date(t.date) >= startOfWeek);
    }

    case "monthly":
      return transactions.filter(
        (t) => new Date(t.date).getMonth() === now.getMonth(),
      );

    default:
      return transactions;
  }
};

/* -------- Extract safe array from API response -------- */
export const safeArrayFromResponse = (body) => {
  if (!body) return [];
  if (Array.isArray(body)) return body;
  if (Array.isArray(body.data)) return body.data;
  if (Array.isArray(body.incomes)) return body.incomes;
  if (Array.isArray(body.expenses)) return body.expenses;
  return [];
};

/* -------- Normalize income and expense transactions -------- */
export const normalizeTransactions = (incomes = [], expenses = []) => {
  return [...incomes, ...expenses]
    .map((t) => ({
      id: t._id || t.id || t.id_str || Math.random().toString(36).slice(2),
      description: t.description || t.title || t.note || "",
      amount: t.amount != null ? Number(t.amount) : Number(t.value) || 0,
      date: t.date || t.createdAt || new Date().toISOString(),
      category: t.category || t.type || "Other",
      type: t.type,
      raw: t,
    }))
    .sort((a, b) => new Date(b.date) - new Date(a.date));
};

/* -------- Calculate dashboard stats -------- */
export const calculateTransactionStats = (transactions = []) => {
  const now = new Date();
  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(now.getDate() - 30);

  const last30DaysTransactions = transactions.filter(
    (t) => new Date(t.date) >= thirtyDaysAgo,
  );

  const last30DaysIncome = last30DaysTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const last30DaysExpenses = last30DaysTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const allTimeIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const allTimeExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const savingsRate =
    last30DaysIncome > 0
      ? Math.round(
          ((last30DaysIncome - last30DaysExpenses) / last30DaysIncome) * 100,
        )
      : 0;

  const last60DaysAgo = new Date(now);
  last60DaysAgo.setDate(now.getDate() - 60);

  const previous30DaysTransactions = transactions.filter((t) => {
    const date = new Date(t.date);
    return date >= last60DaysAgo && date < thirtyDaysAgo;
  });

  const previous30DaysExpenses = previous30DaysTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const expenseChange =
    previous30DaysExpenses > 0
      ? Math.round(
          ((last30DaysExpenses - previous30DaysExpenses) /
            previous30DaysExpenses) *
            100,
        )
      : 0;

  return {
    totalTransactions: transactions.length,
    last30DaysIncome,
    last30DaysExpenses,
    last30DaysSavings: last30DaysIncome - last30DaysExpenses,
    allTimeIncome,
    allTimeExpenses,
    allTimeSavings: allTimeIncome - allTimeExpenses,
    last30DaysCount: last30DaysTransactions.length,
    savingsRate,
    expenseChange,
  };
};

/* -------- Get time frame label -------- */
export const getTimeFrameLabel = (timeFrame) => {
  return timeFrame === "daily"
    ? "Today"
    : timeFrame === "weekly"
      ? "This Week"
      : "This Month";
};

/* -------- Get savings rating -------- */
export const getSavingsRating = (rate) => {
  return rate > 30 ? "Excellent" : rate > 20 ? "Good" : "Needs improvement";
};

/* -------- Get top expense categories -------- */
export const getTopCategories = (transactions = []) => {
  return Object.entries(
    transactions
      .filter((t) => t.type === "expense")
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + Number(t.amount);
        return acc;
      }, {}),
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
};
