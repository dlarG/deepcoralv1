import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

const AuthContext = createContext();

const API_BASE_URL = process.env.REACT_APP_API_BASE || "http://localhost:5000";
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [csrfToken, setCsrfToken] = useState("");
  const [authCheckInProgress, setAuthCheckInProgress] = useState(false);
  const [csrfInitialized, setCsrfInitialized] = useState(false);

  // Initialize CSRF token
  const fetchCsrfToken = React.useCallback(async () => {
    if (csrfInitialized && csrfToken) return csrfToken; // Return if already exists

    try {
      const response = await axios.get(`${API_BASE_URL}/csrf-token`, {
        withCredentials: true,
      });
      setCsrfToken(response.data.csrf_token);
      setCsrfInitialized(true);
      return response.data.csrf_token;
    } catch (err) {
      console.error("CSRF token fetch failed:", err);
      return "";
    }
  }, [csrfInitialized, csrfToken]); // Add csrfToken to dependencies

  // Enhanced auth check
  const checkAuthStatus = React.useCallback(async () => {
    if (authCheckInProgress) return;

    setAuthCheckInProgress(true);
    try {
      const token = csrfToken || (await fetchCsrfToken());
      const response = await axios.get(`${API_BASE_URL}/check-auth`, {
        withCredentials: true,
        headers: {
          "X-CSRF-Token": token,
        },
      });

      if (response.data.authenticated) {
        const userData = {
          ...response.data.user,
          firstname: response.data.user.firstname || "",
          lastname: response.data.user.lastname || "",
        };
        setUser(userData);
      } else {
        clearAuth();
      }
    } catch (err) {
      console.error("Auth check failed:", err);
      clearAuth();
    } finally {
      setLoading(false);
    }
  }, [csrfToken, fetchCsrfToken, authCheckInProgress]);

  const clearAuth = () => {
    setUser(null);
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");
  };

  // Initialize auth and CSRF token
  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      await fetchCsrfToken();
      if (isMounted) {
        await checkAuthStatus();
      }
    };

    initializeAuth();

    return () => {
      isMounted = false;
    };
  }, [checkAuthStatus, fetchCsrfToken]);

  const login = async (credentials) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/login`, credentials, {
        withCredentials: true,
        headers: {
          "X-CSRF-Token": csrfToken,
        },
      });

      setUser(res.data.user);
      setCsrfToken(res.data.csrf_token);
      return {
        success: true,
        redirectTo: res.data.redirect_to,
      };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.error || "Login failed",
      };
    }
  };

  const logout = async () => {
    try {
      // Get fresh CSRF token before logout
      const token = await fetchCsrfToken();

      const response = await axios.post(
        `${API_BASE_URL}/logout`,
        {},
        {
          withCredentials: true,
          headers: {
            "X-CSRF-Token": token,
            "Content-Type": "application/json",
          },
        }
      );

      // Update with new CSRF token from response
      if (response.data.csrf_token) {
        setCsrfToken(response.data.csrf_token);
      }

      // Clear auth state
      clearAuth();

      // Fetch new CSRF token for future requests
      await fetchCsrfToken();

      return true; // Explicitly return true on success
    } catch (err) {
      console.error("Logout failed:", err);
      clearAuth();
      await fetchCsrfToken();
      return false; // Explicitly return false on failure
    }
  };

  // Create axios instance with default credentials
  const authAxios = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
      "X-CSRF-Token": csrfToken,
    },
  });

  const updateUser = (updatedUserData) => {
    setUser((prev) => ({
      ...prev,
      ...updatedUserData,
    }));
  };

  const forgotPassword = async (email) => {
    try {
      const token = csrfToken || (await fetchCsrfToken());
      const response = await axios.post(
        `${API_BASE_URL}/forgot-password`,
        { email },
        {
          withCredentials: true,
          headers: {
            "X-CSRF-Token": token,
          },
        }
      );

      if (response.data.message) {
        return {
          success: true,
          message: response.data.message,
          resetToken: response.data.reset_token,
        };
      }
    } catch (err) {
      console.error("Forgot password error:", err);
      return {
        success: false,
        error:
          err.response?.data?.error || "An error occurred. Please try again.",
      };
    }
  };

  // kasdmkasmd

  const verifyResetOTP = async (resetToken, otpCode) => {
    try {
      const token = csrfToken || (await fetchCsrfToken());
      const response = await axios.post(
        `${API_BASE_URL}/verify-reset-otp`,
        {
          reset_token: resetToken,
          otp_code: otpCode,
        },
        {
          withCredentials: true,
          headers: {
            "X-CSRF-Token": token,
          },
        }
      );

      if (response.data.verified) {
        return {
          success: true,
          message: response.data.message,
          verified: true,
        };
      }
    } catch (err) {
      console.error("OTP verification error:", err);
      return {
        success: false,
        error:
          err.response?.data?.error || "Verification failed. Please try again.",
      };
    }
  };

  const resetPassword = async (resetToken, newPassword, confirmPassword) => {
    try {
      const token = csrfToken || (await fetchCsrfToken());
      const response = await axios.post(
        `${API_BASE_URL}/reset-password`,
        {
          reset_token: resetToken,
          new_password: newPassword,
          confirm_password: confirmPassword,
        },
        {
          withCredentials: true,
          headers: {
            "X-CSRF-Token": token,
          },
        }
      );

      if (response.data.message) {
        return {
          success: true,
          message: response.data.message,
        };
      }
    } catch (err) {
      console.error("Password reset error:", err);
      return {
        success: false,
        error:
          err.response?.data?.error ||
          "Password reset failed. Please try again.",
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        checkAuthStatus,
        authAxios,
        csrfToken, // Make sure this is exposed
        fetchCsrfToken, // Add this to exposed functions
        updateUser,
        forgotPassword,
        verifyResetOTP,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
