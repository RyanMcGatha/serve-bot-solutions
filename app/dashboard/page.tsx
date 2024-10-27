"use client";
import { useAuth } from "@/app/contexts/AuthContext";
import { NewUserModal } from "./modals/newUser";
import { FocusCards } from "./components/focus-cards";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchUserApps() {
    try {
      const response = await axios.get("/api/apps/fetchAppsByUser", {
        withCredentials: true,
      });

      console.log(response.data); // Handle response data
      setCards(response.data);
    } catch (error: any) {
    } finally {
      setLoading(false); // Ensure loading is set to false after attempt
    }
  }

  useEffect(() => {
    if (user) {
      fetchUserApps();
    } else {
      setLoading(false); // Set loading to false if user is null
    }
  }, [user]);

  const subscription = user?.subscription;

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full h-full flex items-center justify-center">
      {subscription === "NONE" ? (
        <NewUserModal
          onCompleted={() => {
            console.log("completed");
            window.location.reload();
          }}
        />
      ) : (
        <FocusCards cards={cards} />
      )}
    </div>
  );
}
