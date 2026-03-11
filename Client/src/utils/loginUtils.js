// Client / src / utils / loginUtils.js

// Client / src / utils / loginUtils.js

/* -------- Get storage from remember me -------- */
export const getAuthStorage = (rememberMe) => {
  return rememberMe ? localStorage : sessionStorage;
};

/* -------- Extract user profile from login response -------- */
export const extractLoginProfile = (data) => {
  let profile = data?.user ?? null;

  if (!profile) {
    const copy = { ...(data || {}) };
    delete copy.token;
    delete copy.user;

    if (Object.keys(copy).length) {
      profile = copy;
    }
  }

  return profile;
};

/* -------- Save auth data -------- */
export const persistAuthData = ({ profile, token, rememberMe }) => {
  const storage = getAuthStorage(rememberMe);

  if (token) storage.setItem("token", token);
  if (profile) storage.setItem("user", JSON.stringify(profile));
};
