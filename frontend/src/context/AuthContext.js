import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

const AuthContext = createContext();

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
      const response = await axios.get("http://localhost:5000/csrf-token", {
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
      const response = await axios.get("http://localhost:5000/check-auth", {
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
      const res = await axios.post("http://localhost:5000/login", credentials, {
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
        "http://localhost:5000/logout",
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

      return true;
    } catch (err) {
      console.error("Logout failed:", err);
      // Clear auth state anyway
      clearAuth();
      // Force new CSRF token
      await fetchCsrfToken();
      return false;
    }
  };

  // Create axios instance with default credentials
  const authAxios = axios.create({
    baseURL: "http://localhost:5000",
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
