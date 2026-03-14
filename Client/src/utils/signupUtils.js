// Client / src / utils / signupUtils.js
import { extractAuthProfile, persistUserAuth } from "./helpers";

/* -------- Extract user profile from signup response -------- */
export const extractSignupProfile = (data) => {
  return extractAuthProfile(data);
};

/* -------- Persist auth -------- */
export const persistSignupAuth = ({ profile, token, rememberMe }) => {
  persistUserAuth({ profile, token, rememberMe });
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
