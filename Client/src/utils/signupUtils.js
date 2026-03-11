// Client / src / utils / signupUtils.js

/* -------- Extract user profile from signup response -------- */
export const extractSignupProfile = (data) => {
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

/* -------- Persist auth -------- */
export const persistSignupAuth = ({ profile, token, rememberMe }) => {
  const storage = rememberMe ? localStorage : sessionStorage;

  try {
    if (token) storage.setItem("token", token);
    if (profile) storage.setItem("user", JSON.stringify(profile));
  } catch (error) {
    console.error("Storage Error:", error);
  }
};

/* -------- Validate signup form -------- */
export const validateSignupForm = ({ name, email, password }) => {
  const errors = {};

  if (!name?.trim()) {
    errors.name = "Name is required";
  }

  if (!email?.trim()) {
    errors.email = "Email is required";
  } else if (!/\S+@\S+\.\S+/.test(email)) {
    errors.email = "Email is invalid";
  }

  if (!password) {
    errors.password = "Password is required";
  } else if (password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  return errors;
};
