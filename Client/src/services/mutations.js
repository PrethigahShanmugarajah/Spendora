// Client / src / services / mutations.js
import { toast } from "react-toastify";
import API_ROUTES from "../api/api_route";
import api from "../api/axios";

/* -------- Add Income -------- */
export const addIncome = async (payload) => {
  try {
    const { data } = await api.post(API_ROUTES.EXPENSE.ADD, payload);
    console.log("Add Income API Response:", data);

    if (data?.success) {
      toast.success(data?.message);
      console.log("Add Income Success:", data?.message);
    } else {
      toast.warn(data?.message || "Add income with warning");
      console.warn(
        "Add Income Warning:",
        data?.message || "Add Income warning",
      );
    }

    return data;
  } catch (error) {
    toast.error(error?.response?.data?.message || error?.message);
    console.error("Add Income Error:", error);

    throw error;
  }
};

/* -------- Add Expense -------- */
export const addExpense = async (payload) => {
  try {
    const { data } = await api.post(API_ROUTES.EXPENSE.ADD, payload);
    console.log("Add Expense API Response:", data);

    if (data?.success) {
      toast.success(data?.message);
      console.log("Add Expense Success:", data?.message);
    } else {
      toast.warn(data?.message || "Add expense with warning");
      console.warn(
        "Add Expense Warning:",
        data?.message || "Add Expense warning",
      );
    }

    return data;
  } catch (error) {
    toast.error(error?.response?.data?.message || error?.message);
    console.error("Add Expense Error:", error);

    throw error;
  }
};

/* -------- Update Income -------- */
export const updateIncome = async (id, payload) => {
  try {
    const { data } = await api.put(API_ROUTES.INCOME.UPDATE(id), payload);
    console.log("Update Income API Response:", data);

    if (data?.success) {
      toast.success(data?.message);
      console.log("Update Income Success:", data?.message);
    } else {
      toast.warn(data?.message || "Update income with warning");
      console.warn(
        "Update Income Warning:",
        data?.message || "Update Income warning",
      );
    }

    return data;
  } catch (error) {
    toast.error(error?.response?.data?.message || error?.message);
    console.error("Update Income Error:", error);

    throw error;
  }
};

/* -------- Update Expense -------- */
export const updateExpense = async (id, payload) => {
  try {
    const { data } = await api.put(API_ROUTES.EXPENSE.UPDATE(id), payload);
    console.log("Update Expense API Response:", data);

    if (data?.success) {
      toast.success(data?.message);
      console.log("Update Expense Success:", data?.message);
    } else {
      toast.warn(data?.message || "Update expense with warning");
      console.warn(
        "Update Expense Warning:",
        data?.message || "Update Expense warning",
      );
    }

    return data;
  } catch (error) {
    toast.error(error?.response?.data?.message || error?.message);
    console.error("Update Expense Error:", error);

    throw error;
  }
};

/* -------- Delete Income -------- */
export const deleteIncome = async (id) => {
  try {
    const { data } = await api.delete(API_ROUTES.INCOME.DELETE(id));
    console.log("Delete Income API Response:", data);

    if (data?.success) {
      toast.success(data?.message);
      console.log("Delete Income Success:", data?.message);
    } else {
      toast.warn(data?.message || "Delete income with warning");
      console.warn(
        "Delete Income Warning:",
        data?.message || "Delete Income warning",
      );
    }

    return data;
  } catch (error) {
    toast.error(error?.response?.data?.message || error?.message);
    console.error("Delete Income Error:", error);

    throw error;
  }
};

/* -------- Delete Expense -------- */
export const deleteExpense = async (id) => {
  try {
    const { data } = await api.delete(API_ROUTES.EXPENSE.DELETE(id));
    console.log("Delete Expense API Response:", data);

    if (data?.success) {
      toast.success(data?.message);
      console.log("Delete Expense Success:", data?.message);
    } else {
      toast.warn(data?.message || "Delete expense with warning");
      console.warn(
        "Delete Expense Warning:",
        data?.message || "Delete Expense warning",
      );
    }

    return data;
  } catch (error) {
    toast.error(error?.response?.data?.message || error?.message);
    console.error("Delete Expense Error:", error);

    throw error;
  }
};

/* -------- User Login -------- */
export const userLogin = async (payload) => {
  try {
    const { data } = await api.post(API_ROUTES.USER.LOGIN, payload);
    console.log("User Login API Response:", data);

    if (data?.success) {
      toast.success(data?.message);
      console.log("User Login Success:", data?.message);
    } else {
      toast.warn(data?.message || "User login with warning");
      console.warn(
        "User Login Warning:",
        data?.message || "User Login warning",
      );
    }

    return data;
  } catch (error) {
    toast.error(error?.response?.data?.message || error?.message);
    console.error("User Login Error:", error);

    throw error;
  }
};
