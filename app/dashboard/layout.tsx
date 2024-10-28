"use client";
import { Nav } from "../components/navbar/Nav";
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className=" bg-zinc-50 dark:bg-zinc-950 text-zinc-700 dark:text-zinc-300 max-w-screen max-h-screen">
      <Nav isDashboard={true} />
      {children}
    </div>
  );
}
