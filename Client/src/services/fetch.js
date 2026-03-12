// Client / src / services / fetch.js
import { toast } from "react-toastify";
import API_ROUTES from "../api/api_route";
import api from "../api/axios";

/* -------- Fetch Current User -------- */
export const fetchCurrentUser = async () => {
  try {
    const { data } = await api.get(API_ROUTES.USER.PROFILE);
    console.log("Fetch Current User API Response:", data);

    if (data?.success) {
      // toast.success(data?.message);
      console.log("Fetch Current User Success:", data?.message);
    } else {
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
    console.log("Fetch Income API Response:", data);

    if (data?.success) {
      // toast.success(data?.message);
      console.log("Fetch Income Success:", data?.message);
    } else {
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
    console.log("Fetch Expense API Response:", data);

    if (data?.success) {
      // toast.success(data?.message);
      console.log("Fetch Expense Success:", data?.message);
    } else {
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
    console.log("Fetch Dashboard Overview API Response:", data);

    if (data?.success) {
      // toast.success(data?.message);
      console.log("Fetch Dashboard Overview Success:", data?.message);
    } else {
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
