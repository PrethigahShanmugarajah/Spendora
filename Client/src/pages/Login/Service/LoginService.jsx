// Client / src / pages / Login / Service / LoginService.jsx
import { fetchCurrentUser } from "../../../services/fetch";
import { userLogin } from "../../../services/mutations";
import {
  extractLoginProfile,
  getAuthStorage,
  persistAuthData,
} from "../../../utils/loginUtils";

/* -------- Login user -------- */
export async function loginUserApi({ email, password, rememberMe }) {
  const data = await userLogin({ email, password });
  const token = data?.token || null;

  let profile = extractLoginProfile(data);

  if (!profile && token) {
    try {
      const storage = getAuthStorage(rememberMe);
      storage.setItem("token", token);

      const profileResponse = await fetchCurrentUser();
      profile = profileResponse?.data || profileResponse?.user || { email };
    } catch (error) {
      console.warn("Unable to retrieve the current user after login:", error);
      profile = { email };
    }
  }

  if (!profile) profile = { email };

  persistAuthData({ profile, token, rememberMe });

  return { profile, token, data };
}
