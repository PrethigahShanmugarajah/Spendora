/* -------- Reset password form data -------- */
export function getInitialPasswordData() {
  return {
    current: "",
    new: "",
    confirm: "",
  };
}

/* -------- Reset password visibility state -------- */
export function getInitialShowPassword() {
  return {
    current: false,
    new: false,
    confirm: false,
  };
}

/* -------- Validate password form -------- */
export function validatePasswordData(passwordData) {
  const errors = {};

  if (!passwordData.current) {
    errors.current = "Current password is required";
  }

  if (!passwordData.new) {
    errors.new = "New password is required";
  } else if (passwordData.new.length < 8) {
    errors.new = "Password must be at least 8 characters";
  }

  if (passwordData.new !== passwordData.confirm) {
    errors.confirm = "Passwords do not match";
  }

  return errors;
}

/* -------- Build updated profile user -------- */
export function getUpdatedProfileUser(data) {
  return data?.user || data?.data || data;
}
