"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

interface AuthContextProps {
  user: User | null;
  login: (email: string, password: string) => Promise<Response | null>;
  signup: (email: string, password: string) => Promise<Response | null>;
  logout: () => void;
  handleGoogleAuth: () => void;
  handleGitHubAuth: () => void;
  session: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

interface User {
  id: number;
  email: string;
  subscription: string;
}

interface Response {
  success: boolean;
  data?: any;
  error?: string;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Check User Info function
  const session = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get<Response>("/api/session", {
        withCredentials: true, // Ensures cookies are sent with the request
      });

      if (response.data.success) {
        setUser(response.data.data.user); // Set user data if valid
      } else {
        setUser(null); // Clear user if not authenticated
        router.push("/signin");
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to fetch user info");
      setUser(null);
      router.push("/signin");
    } finally {
      setLoading(false);
    }
  };

  // Login function
  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post<Response>("/api/signin", {
        email,
        password,
      });

      setLoading(false);
      router.push("/dashboard"); // Redirect to dashboard after successful login
    } catch (err: any) {
      setLoading(false);
      setError(err.response?.data?.error || "Something went wrong");
      return err.response?.data;
    }
  };

  // Signup function
  const signup = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post<Response>("/api/signup", {
        email,
        password,
      });

      setUser(response.data.data.user); // Set user data after successful signup
      setLoading(false);
      router.push("/dashboard");
    } catch (err: any) {
      setLoading(false);
      setError(err.response?.data?.error || "Something went wrong");
      return err.response?.data;
    }
  };

  // Logout function
  const logout = async () => {
    setLoading(true);
    try {
      const response = await axios.post("/api/logout");

      if (response.status === 200) {
        setUser(null); // Clear user on successful logout
        router.push("/");
      } else {
        setError("Logout failed");
        console.error("Logout failed with status:", response.status);
      }
    } catch (err: any) {
      setError("An error occurred during logout");
      return err.response?.data;
    } finally {
      setLoading(false);
    }
  };

  // Handle Google OAuth sign-in
  const handleGoogleAuth = () => {
    window.location.href = "/api/auth/google"; // Redirect to the Google OAuth route
  };

  // Handle GitHub OAuth sign-in
  const handleGitHubAuth = () => {
    window.location.href = "/api/auth/github"; // Redirect to the GitHub OAuth route
  };

  const value = {
    user,
    login,
    signup,
    logout,
    handleGoogleAuth,
    handleGitHubAuth,
    session, // Expose the checkUserInfo function
    loading,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
