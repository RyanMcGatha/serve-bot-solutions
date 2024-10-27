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
  logout: () => Promise<void>;
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
        withCredentials: true,
      });
      if (response.data.success) {
        setUser(response.data.data.user);
      } else {
        setUser(null);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to fetch user info");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Login function
  const login = async (
    email: string,
    password: string
  ): Promise<Response | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post<Response>("/api/signin", {
        email,
        password,
      });
      if (response.data.success) {
        setUser(response.data.data.user);
        router.push("/dashboard");
        return response.data;
      } else {
        setError(response.data.error || "Login failed");
        return response.data;
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Something went wrong");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Signup function
  const signup = async (
    email: string,
    password: string
  ): Promise<Response | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post<Response>("/api/signup", {
        email,
        password,
      });
      if (response.data.success) {
        setUser(response.data.data.user);
        router.push("/dashboard");
        return response.data;
      } else {
        setError(response.data.error || "Signup failed");
        return response.data;
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Something went wrong");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    setLoading(true);
    try {
      const response = await axios.post("/api/logout");
      if (response.status === 200) {
        setUser(null);
        router.push("/");
      } else {
        setError("Logout failed");
      }
    } catch (err: any) {
      setError("An error occurred during logout");
    } finally {
      setLoading(false);
    }
  };

  // Google and GitHub OAuth handlers
  const handleGoogleAuth = () => {
    window.location.href = "/api/auth/google";
  };
  const handleGitHubAuth = () => {
    window.location.href = "/api/auth/github";
  };

  useEffect(() => {
    session();
  }, []);

  const value = {
    user,
    login,
    signup,
    logout,
    handleGoogleAuth,
    handleGitHubAuth,
    session,
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
