"use client";

import { Sidebar } from "./components/SideBar";
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-screen h-screen flex bg-zinc-50 dark:bg-zinc-950 group text-zinc-700 dark:text-zinc-300">
      <Sidebar />
      {children}
    </div>
  );
}
