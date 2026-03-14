// Client / src / pages / Profile / Service / ProfileService.jsx
import { fetchCurrentUser } from "../../../services/fetch";
import { changePassword, updateProfile } from "../../../services/mutations";
import { getUpdatedProfileUser } from "../../../utils/profileUtils";

/* -------- Fetch profile -------- */
export async function fetchProfileApi() {
  const data = await fetchCurrentUser();

  if (!data) {
    return null;
  }

  const userData = getUpdatedProfileUser(data);

  return {
    name: userData?.name ?? "",
    email: userData?.email ?? "",
    joinDate: userData?.joinDate ?? "",
  };
}

/* -------- Update profile -------- */
export async function updateProfileApi(profileData) {
  const payload = {
    name: profileData.name?.trim() || "",
    email: profileData.email?.trim() || "",
    joinDate: profileData.joinDate || "",
  };

  return await updateProfile(payload);
}

/* -------- Change password -------- */
export async function changePasswordApi(passwordData) {
  const payload = {
    currentPassword: passwordData.current,
    newPassword: passwordData.new,
  };

  return await changePassword(payload);
}
