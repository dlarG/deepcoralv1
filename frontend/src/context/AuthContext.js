import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [csrfToken, setCsrfToken] = useState("");

  // Initialize CSRF token and auth status
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // 1. Get CSRF token first
        const csrfRes = await axios.get("http://localhost:5000/csrf-token", {
          withCredentials: true,
        });
        setCsrfToken(csrfRes.data.csrf_token);

        // 2. Then check auth status with the new token
        const authRes = await axios.get("http://localhost:5000/check-auth", {
          withCredentials: true,
          headers: {
            "X-CSRF-Token": csrfRes.data.csrf_token,
          },
        });

        if (authRes.data.authenticated) {
          setUser(authRes.data.user);
        }
      } catch (err) {
        console.error("Initialization error:", err);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Initialize CSRF token
  const fetchCsrfToken = async () => {
    try {
      const response = await axios.get("http://localhost:5000/csrf-token", {
        withCredentials: true,
      });
      setCsrfToken(response.data.csrf_token);
    } catch (err) {
      console.error("CSRF token fetch failed:", err);
    }
  };

  // Enhanced auth check
  const checkAuthStatus = React.useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:5000/check-auth", {
        withCredentials: true,
        headers: {
          "X-CSRF-Token": csrfToken,
        },
      });

      if (response.data.authenticated) {
        const userData = {
          ...response.data.user,
          // Ensure all required fields exist
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
  }, [csrfToken]);

  const clearAuth = () => {
    setUser(null);
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");
  };

  // Initialize auth and CSRF token
  useEffect(() => {
    const initializeAuth = async () => {
      await fetchCsrfToken();
      await checkAuthStatus();
    };
    initializeAuth();
  }, [checkAuthStatus]);

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
      const response = await axios.post(
        "http://localhost:5000/logout",
        {},
        {
          withCredentials: true,
          headers: {
            "X-CSRF-Token": csrfToken,
            "Content-Type": "application/json",
          },
        }
      );

      // Clear auth state regardless of response
      clearAuth();

      // Fetch new CSRF token for future requests
      await fetchCsrfToken();

      return true;
    } catch (err) {
      console.error("Logout failed:", err);
      // Even if the request failed, clear local auth state
      clearAuth();
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

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        checkAuthStatus,
        authAxios, // Provide pre-configured axios instance
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
