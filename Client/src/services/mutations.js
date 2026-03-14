import { toast } from "react-toastify";
import API_ROUTES from "../api/api_route";
import api from "../api/axios";

/* -------- Add Income -------- */
export const addIncome = async (payload) => {
  try {
    const { data } = await api.post(API_ROUTES.INCOME.ADD, payload);

    if (data?.success) {
      toast.success(data?.message);
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

    if (data?.success) {
      toast.success(data?.message);
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

    if (data?.success) {
      toast.success(data?.message);
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

    if (data?.success) {
      toast.success(data?.message);
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

    if (data?.success) {
      toast.success(data?.message);
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

    if (data?.success) {
      toast.success(data?.message);
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

    if (data?.success) {
      toast.success(data?.message);
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

/* -------- User Signup -------- */
export const userSignup = async (payload) => {
  try {
    const { data } = await api.post(API_ROUTES.USER.REGISTER, payload);

    if (data?.success) {
      toast.success(data?.message);
    } else {
      toast.warn(data?.message || "User signup with warning");
      console.warn(
        "User Signup Warning:",
        data?.message || "User Signup warning",
      );
    }

    return data;
  } catch (error) {
    toast.error(error?.response?.data?.message || error?.message);
    console.error("User Signup Error:", error);

    throw error;
  }
};

/* -------- Update Profile -------- */
export const updateProfile = async (profileData) => {
  try {
    const { data } = await api.put(API_ROUTES.USER.PROFILE, profileData);

    if (data?.success) {
      toast.success(data?.message);
    } else {
      toast.warn(data?.message || "Update profile with warning");
      console.warn(
        "Update Profile Warning:",
        data?.message || "Update Profile warning",
      );
    }

    return data;
  } catch (error) {
    toast.error(error?.response?.data?.message || error?.message);
    console.error("Update Profile Error:", error);

    throw error;
  }
};

/* -------- Change Password -------- */
export const changePassword = async (passwordData) => {
  try {
    const { data } = await api.put(API_ROUTES.USER.PASSWORD, passwordData);

    if (data?.success) {
      toast.success(data?.message);
    } else {
      toast.warn(data?.message || "Change password with warning");
      console.warn(
        "Change Password Warning:",
        data?.message || "Change Password warning",
      );
    }

    return data;
  } catch (error) {
    toast.error(error?.response?.data?.message || error?.message);
    console.error("Change Password Error:", error);

    throw error;
  }
};
