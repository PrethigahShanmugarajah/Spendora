import { persistUserAuth } from "./helpers";

/* -------- Get storage from remember me -------- */
export const getAuthStorage = (rememberMe) => {
  return rememberMe ? localStorage : sessionStorage;
};

/* -------- Save auth data -------- */
export const persistAuthData = ({ profile, token, rememberMe }) => {
  persistUserAuth({ profile, token, rememberMe });
};
