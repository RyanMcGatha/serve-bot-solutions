"use client";
import { useEffect, useState } from "react";
import { use } from "react";

// Define a type for appData
type AppData = {
  link: string;
  // Add other properties if needed
};

const AppPage = ({ params }: { params: Promise<{ appId: string }> }) => {
  const { appId } = use(params);
  const [appData, setAppData] = useState<AppData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchAppById = async (appId: string) => {
    try {
      const res = await fetch(`/api/apps/fetchAppById?id=${appId}`);
      if (!res.ok) {
        throw new Error(`Error: ${res.statusText}`);
      }
      const data = await res.json();
      setAppData(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    if (appId) {
      fetchAppById(appId);
    }
  }, [appId]);

  return (
    <div className="w-full h-full">
      {error && <p>Error: {error}</p>}
      {appData?.link ? (
        <iframe
          src={appData.link}
          height="100%"
          width="100%"
          frameBorder="0"
          title="New Application"
        ></iframe>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default AppPage;
