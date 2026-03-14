import { fetchCurrentUser } from "../../../services/fetch";
import { userLogin } from "../../../services/mutations";
import { extractAuthProfile } from "../../../utils/helpers";
import { getAuthStorage, persistAuthData } from "../../../utils/loginUtils";

/* -------- Login user -------- */
export async function loginUserApi({ email, password, rememberMe }) {
  const data = await userLogin({ email, password });
  const token = data?.token || null;

  let profile = extractAuthProfile(data);

  if (!profile && token) {
    try {
      const storage = getAuthStorage(rememberMe);
      storage.setItem("token", token);

      const profileResponse = await fetchCurrentUser();
      profile = profileResponse?.data || profileResponse?.user || { email };
    } catch (error) {
      profile = { email };
    }
  }

  if (!profile) profile = { email };

  persistAuthData({ profile, token, rememberMe });

  return { profile, token, data };
}
