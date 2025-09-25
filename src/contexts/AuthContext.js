import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { authAPI } from "../utils/api";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuthStatus = useCallback(async () => {
    try {
      // Check if we have a token first
      const token = localStorage.getItem("token");
      if (!token) {
        setUser(null);
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      // Try to get user from localStorage first (for backward compatibility)
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setIsAuthenticated(true);
      }

      // Verify with backend to ensure token is still valid
      const response = await authAPI.getMe();
      if (response.data.success) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      // Clear any stored data on auth failure
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);

  // Check if user is logged in on app start
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      if (response.data.success) {
        const { user: userData, token } = response.data;
        // Store user data in localStorage (token is handled by cookies)
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("token", token);
        setUser(userData);
        setIsAuthenticated(true);
        toast.success("Login successful!");
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || "Login failed";
      toast.error(message);
      return { success: false, message };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      if (response.data.success) {
        const { user: newUser, token } = response.data;
        // Store user data in localStorage (token is handled by cookies)
        localStorage.setItem("user", JSON.stringify(newUser));
        localStorage.setItem("token", token);
        setUser(newUser);
        setIsAuthenticated(true);
        toast.success("Registration successful!");
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || "Registration failed";
      toast.error(message);
      return { success: false, message };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear localStorage (cookies are cleared by backend)
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      setIsAuthenticated(false);
      toast.success("Logged out successfully");
    }
  };

  const updateUser = (userData) => {
    setUser((prev) => ({ ...prev, ...userData }));
    localStorage.setItem("user", JSON.stringify({ ...user, ...userData }));
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateUser,
    checkAuthStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
