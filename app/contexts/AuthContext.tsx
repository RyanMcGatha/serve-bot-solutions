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

const sendDiscordNotification = async (message: string, channelId: string) => {
  try {
    await axios.post("/api/sendDiscordMessage", { message, channelId });
  } catch (error) {
    console.error("Failed to send Discord notification:", error);
  }
};

const handleAuthError = async (
  error: any,
  setError: (error: string | null) => void,
  errorMessage: string,
  discordMessage: string,
  channelId: string
) => {
  setError(error.response?.data?.error || errorMessage);
  await sendDiscordNotification(discordMessage, channelId);
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const session = async () => {
    setLoading(true);
    setError(null);
    await sendDiscordNotification(
      "Session check initiated.",
      process.env.NEXT_PUBLIC_SESSION_CHANNEL_ID || ""
    );
    try {
      const response = await axios.get<Response>("/api/session", {
        withCredentials: true,
      });
      if (response.data.success) {
        setUser(response.data.data.user);
        await sendDiscordNotification(
          `Session check successful for user: ${response.data.data.user.email}`,
          process.env.NEXT_PUBLIC_SESSION_CHANNEL_ID || ""
        );
      } else {
        setUser(null);
        await sendDiscordNotification(
          "Session check failed - user not found.",
          process.env.NEXT_PUBLIC_SESSION_CHANNEL_ID || ""
        );
      }
    } catch (err) {
      await handleAuthError(
        err,
        setError,
        "Failed to fetch user info",
        "Session check error occurred.",
        process.env.NEXT_PUBLIC_SESSION_CHANNEL_ID || ""
      );
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (
    email: string,
    password: string
  ): Promise<Response | null> => {
    setLoading(true);
    setError(null);
    await sendDiscordNotification(
      `Login attempt for user: ${email}`,
      process.env.NEXT_PUBLIC_LOGIN_CHANNEL_ID || ""
    );
    try {
      const response = await axios.post<Response>("/api/signin", {
        email,
        password,
      });
      if (response.data.success) {
        setUser(response.data.data.user);
        router.push("/dashboard");
        await sendDiscordNotification(
          `Login successful for user: ${email}`,
          process.env.NEXT_PUBLIC_LOGIN_CHANNEL_ID || ""
        );
        return response.data;
      } else {
        setError(response.data.error || "Login failed");
        await sendDiscordNotification(
          `Login failed for user: ${email}`,
          process.env.NEXT_PUBLIC_LOGIN_CHANNEL_ID || ""
        );
        return response.data;
      }
    } catch (err) {
      await handleAuthError(
        err,
        setError,
        "Something went wrong",
        `Login error occurred for user: ${email}`,
        process.env.NEXT_PUBLIC_LOGIN_CHANNEL_ID || ""
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (
    email: string,
    password: string
  ): Promise<Response | null> => {
    setLoading(true);
    setError(null);
    await sendDiscordNotification(
      `Signup attempt for user: ${email}`,
      process.env.NEXT_PUBLIC_NEW_USER_CHANNEL_ID || ""
    );
    try {
      const response = await axios.post<Response>("/api/signup", {
        email,
        password,
      });
      if (response.data.success) {
        setUser(response.data.data.user);
        router.push("/dashboard");
        await sendDiscordNotification(
          `@r_mcgat Signup successful for user: ${email}`,
          process.env.NEXT_PUBLIC_NEW_USER_CHANNEL_ID || ""
        );
        return response.data;
      } else {
        setError(response.data.error || "Signup failed");
        await sendDiscordNotification(
          `Signup failed for user: ${email}`,
          process.env.NEXT_PUBLIC_NEW_USER_CHANNEL_ID || ""
        );
        return response.data;
      }
    } catch (err) {
      await handleAuthError(
        err,
        setError,
        "Something went wrong",
        `Signup error occurred for user: ${email}`,
        process.env.NEXT_PUBLIC_NEW_USER_CHANNEL_ID || ""
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setLoading(true);
    await sendDiscordNotification(
      `Logout initiated for user: ${user?.email}`,
      process.env.NEXT_PUBLIC_LOGOUT_CHANNEL_ID || ""
    );
    try {
      const response = await axios.post("/api/logout");
      if (response.status === 200) {
        setUser(null);
        router.push("/");
        await sendDiscordNotification(
          "Logout successful.",
          process.env.NEXT_PUBLIC_LOGOUT_CHANNEL_ID || ""
        );
      } else {
        setError("Logout failed");
        await sendDiscordNotification(
          "Logout failed.",
          process.env.NEXT_PUBLIC_LOGOUT_CHANNEL_ID || ""
        );
      }
    } catch (err) {
      await handleAuthError(
        err,
        setError,
        "An error occurred during logout",
        "Logout error occurred.",
        process.env.NEXT_PUBLIC_LOGOUT_CHANNEL_ID || ""
      );
    } finally {
      setLoading(false);
    }
  };

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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
