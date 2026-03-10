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
      toast.success(data?.message);
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
