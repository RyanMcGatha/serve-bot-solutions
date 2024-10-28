"use client";
import { useAuth } from "@/app/contexts/AuthContext";
import { NewUserModal } from "./modals/newUser";
import { FocusCards } from "./components/focus-cards";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Loader } from "../components/Loader";
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

      console.log(response.data);
      setCards(response.data);
    } catch (error: any) {
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (user) {
      fetchUserApps();
    } else {
      setLoading(false);
    }
  }, [user]);

  const subscription = user?.subscription;

  if (loading) {
    return (
      <div className="h-full w-full p-10 overflow-hidden flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="h-full w-full overflow-hidden">
      {subscription === "NONE" ? (
        <NewUserModal
          onCompleted={() => {
            console.log("completed");
            window.location.reload();
          }}
        />
      ) : (
        <div className="h-full w-full p-10">
          <FocusCards cards={cards} />
        </div>
      )}
    </div>
  );
}
