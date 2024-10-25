"use client";
import { useAuth } from "@/app/contexts/AuthContext";
import { NewUserModal } from "./modals/newUser";

export default function DashboardPage() {
  const { user } = useAuth();
  const subscription = user?.subscription;
  return (
    <div className="w-full h-full  flex items-center justify-center">
      {subscription === "NONE" && <NewUserModal />}
    </div>
  );
}
