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

export const validateUserForm = (formData, mode = "create") => {
  const errors = {};

  // Validate first name
  if (!formData.firstname?.trim()) {
    errors.firstname = "First name is required";
  }

  // Validate last name
  if (!formData.lastname?.trim()) {
    errors.lastname = "Last name is required";
  }

  // Validate username
  if (!formData.username?.trim()) {
    errors.username = "Username is required";
  } else if (formData.username.length < 3) {
    errors.username = "Username must be at least 3 characters";
  }

  // Validate password - only required for create mode or when password is provided in edit mode
  const shouldValidatePassword =
    mode === "create" || (mode === "edit" && formData.password?.trim());

  if (shouldValidatePassword) {
    const passwordErrors = [];
    const password = formData.password;

    if (!password || password.length < 8) {
      passwordErrors.push("Password must be at least 8 characters");
    }
    if (!/[A-Z]/.test(password)) {
      passwordErrors.push(
        "Password must contain at least one uppercase letter"
      );
    }
    if (!/[a-z]/.test(password)) {
      passwordErrors.push(
        "Password must contain at least one lowercase letter"
      );
    }
    if (!/\d/.test(password)) {
      passwordErrors.push("Password must contain at least one number");
    }
    if (!/[!@#$%^&*]/.test(password)) {
      passwordErrors.push(
        "Password must contain at least one special character"
      );
    }

    if (passwordErrors.length > 0) {
      errors.password = passwordErrors;
    }
  } else if (mode === "create" && !formData.password?.trim()) {
    errors.password = "Password is required";
  }

  // Validate role
  if (!formData.roletype) {
    errors.roletype = "Role is required";
  }

  return errors;
};
