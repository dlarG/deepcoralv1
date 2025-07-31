// src/components/admin/utils/validationUtils.js
export const validatePassword = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const errors = [];
  if (password.length < minLength)
    errors.push(`Password must be at least ${minLength} characters`);
  if (!hasUpperCase)
    errors.push("Password must contain at least one uppercase letter");
  if (!hasLowerCase)
    errors.push("Password must contain at least one lowercase letter");
  if (!hasNumbers) errors.push("Password must contain at least one number");
  if (!hasSpecialChar)
    errors.push("Password must contain at least one special character");

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateUserForm = (data, isEditMode = false) => {
  const errors = {};

  if (!data.username || data.username.trim().length < 3) {
    errors.username = "Username must be at least 3 characters";
  } else if (!/^[a-zA-Z0-9_-]+$/.test(data.username)) {
    errors.username =
      "Username can only contain letters, numbers, hyphens, and underscores";
  }

  if (!data.firstname || data.firstname.trim().length < 2) {
    errors.firstname = "First name must be at least 2 characters";
  }
  if (!data.lastname || data.lastname.trim().length < 2) {
    errors.lastname = "Last name must be at least 2 characters";
  }

  if (!isEditMode || (isEditMode && data.password)) {
    const passwordValidation = validatePassword(data.password);
    if (!passwordValidation.isValid) {
      errors.password = passwordValidation.errors;
    }
  }

  if (
    !data.roletype ||
    !["admin", "biologist", "guest"].includes(data.roletype)
  ) {
    errors.roletype = "Please select a valid role";
  }

  return errors;
};
