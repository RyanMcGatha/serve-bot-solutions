"use client";
import { AuthProvider } from "@/app/contexts/AuthContext";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
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
    <html lang="en">
      <body className="min-h-screen min-w-screen bg-zinc-50 dark:bg-zinc-950 group text-zinc-700 dark:text-zinc-300 ">
        <Analytics />
        <SpeedInsights />
        <AuthProvider>
          <ToastProvider>{children}</ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
