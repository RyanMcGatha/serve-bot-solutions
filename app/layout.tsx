"use client";
import { AuthProvider } from "@/app/contexts/AuthContext";
import "./globals.css";
import { useState } from "react";
import { ToastProvider } from "@/app/contexts/ToastContext";
import { ModalProvider } from "./dashboard/components/animated-modal";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [darkMode, setDarkMode] = useState(true);

  return (
    <html lang="en">
      <body className="h-screen w-screen ">
        <AuthProvider>
          <ModalProvider>
            <ToastProvider>{children}</ToastProvider>
          </ModalProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
