"use client";
import { AuthProvider } from "@/app/contexts/AuthContext";
import "./globals.css";
import { useState } from "react";
import { ToastProvider } from "@/app/contexts/ToastContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [darkMode, setDarkMode] = useState(true);

  return (
    <AuthProvider>
      <html lang="en">
        <body className="h-screen w-screen ">
          <ToastProvider>{children}</ToastProvider>
        </body>
      </html>
    </AuthProvider>
  );
}
