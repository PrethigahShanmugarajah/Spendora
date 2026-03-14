import { toast } from "react-toastify";
import API_ROUTES from "../api/api_route";
import api from "../api/axios";

/* -------- Fetch Current User -------- */
export const fetchCurrentUser = async () => {
  try {
    const { data } = await api.get(API_ROUTES.USER.PROFILE);

    if (!data?.success) {
      toast.warn(data?.message || "Fetch current user with warning");
      console.warn(
        "Fetch Current User Warning:",
        data?.message || "Fetch Current User warning",
      );
    }

    return data;
  } catch (error) {
    toast.error(error?.response?.data?.message || error?.message);
    console.error("Fetch Current User Error:", error);

    throw error;
  }
};

/* -------- Fetch Income -------- */
export const fetchIncome = async () => {
  try {
    const { data } = await api.get(API_ROUTES.INCOME.GET);

    if (!data?.success) {
      toast.warn(data?.message || "Fetch income with warning");
      console.warn(
        "Fetch Income Warning:",
        data?.message || "Fetch Income warning",
      );
    }

    return data;
  } catch (error) {
    toast.error(error?.response?.data?.message || error?.message);
    console.error("Fetch Income Error:", error);

    throw error;
  }
};

/* -------- Fetch Expense -------- */
export const fetchExpense = async () => {
  try {
    const { data } = await api.get(API_ROUTES.EXPENSE.GET);

    if (!data?.success) {
      toast.warn(data?.message || "Fetch expense with warning");
      console.warn(
        "Fetch Expense Warning:",
        data?.message || "Fetch Expense warning",
      );
    }

    return data;
  } catch (error) {
    toast.error(error?.response?.data?.message || error?.message);
    console.error("Fetch Expense Error:", error);

    throw error;
  }
};

/* -------- Fetch Dashboard Overview -------- */
export const fetchDashboardOverview = async () => {
  try {
    const { data } = await api.get(API_ROUTES.DASHBOARD.OVERVIEW);

    if (!data?.success) {
      toast.warn(data?.message || "Fetch dashboard overview with warning");
      console.warn(
        "Fetch Dashboard Overview Warning:",
        data?.message || "Fetch Dashboard Overview warning",
      );
    }

    return data;
  } catch (error) {
    toast.error(error?.response?.data?.message || error?.message);
    console.error("Fetch Dashboard Overview Error:", error);

    throw error;
  }
};

/* -------- Fetch Income Overview -------- */
export const fetchIncomeOverview = async (range = "monthly") => {
  try {
    const { data } = await api.get(API_ROUTES.INCOME.OVERVIEW, {
      params: { range },
    });

    if (!data?.success) {
      toast.warn(data?.message || "Fetch income overview with warning");
      console.warn(
        "Fetch Income Overview Warning:",
        data?.message || "Fetch Income Overview warning",
      );
    }

    return data;
  } catch (error) {
    toast.error(error?.response?.data?.message || error?.message);
    console.error("Fetch Income Overview Error:", error);

    throw error;
  }
};

/* -------- Download Income Data -------- */
export const downloadIncomeData = async ({
  counter = 0,
  filter = "all",
  range = "monthly",
} = {}) => {
  try {
    const response = await api.get(API_ROUTES.INCOME.DOWNLOAD, {
      params: { counter, filter, range },
      responseType: "blob",
    });

    return response;
  } catch (error) {
    toast.error(error?.response?.data?.message || error?.message);
    console.error("Download Income Data Error:", error);

    throw error;
  }
};

/* -------- Fetch Expense Overview -------- */
export const fetchExpenseOverview = async (range = "monthly") => {
  try {
    const { data } = await api.get(API_ROUTES.EXPENSE.OVERVIEW, {
      params: { range },
    });

    if (!data?.success) {
      toast.warn(data?.message || "Fetch expense overview with warning");
      console.warn(
        "Fetch Expense Overview Warning:",
        data?.message || "Fetch Expense Overview warning",
      );
    }

    return data;
  } catch (error) {
    toast.error(error?.response?.data?.message || error?.message);
    console.error("Fetch Expense Overview Error:", error);

    throw error;
  }
};

/* -------- Download Expense Data -------- */
export const downloadExpenseData = async ({
  counter = 0,
  filter = "all",
  range = "monthly",
} = {}) => {
  try {
    const response = await api.get(API_ROUTES.INCOME.DOWNLOAD, {
      params: { counter, filter, range },
      responseType: "blob",
    });

    return response;
  } catch (error) {
    toast.error(error?.response?.data?.message || error?.message);
    console.error("Download Expense Data Error:", error);

    throw error;
  }
};
