import { fetchCurrentUser } from "../../../services/fetch";
import { userSignup } from "../../../services/mutations";
import { extractAuthProfile } from "../../../utils/helpers";

export async function signupUserApi({ name, email, password, rememberMe }) {
  const data = await userSignup({ name, email, password });

  const token = data?.token ?? null;

  let profile = extractAuthProfile(data);

  if (!profile && token) {
    try {
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem("token", token);

      const profileResponse = await fetchCurrentUser();

      profile = profileResponse?.data ||
        profileResponse?.user ||
        profileResponse || { name, email };
    } catch (error) {
      profile = { name, email };
    }
  }

  if (!profile) profile = { name, email };

  return { profile, token };
}
