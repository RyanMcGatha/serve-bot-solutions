"use client";
import { Loader } from "@react-three/drei";
import { useEffect, useState } from "react";

type AppData = {
  link: string;
};

const AppPage = ({ params }: { params: Promise<{ appId: string }> }) => {
  const [appData, setAppData] = useState<AppData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [appId, setAppId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAppById = async (id: string) => {
    try {
      const res = await fetch(`/api/apps/fetchAppById?id=${id}`);
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
    const getParams = async () => {
      const { appId } = await params;
      setAppId(appId);
    };
    getParams();
  }, [params]);

  useEffect(() => {
    if (appId) {
      fetchAppById(appId);
    }
  }, [appId]);

  return (
    <div className="w-full h-full ">
      {error && <p className="text-red-500 text-center">{error}</p>}
      {appData?.link ? (
        <iframe
          src={appData.link}
          className="w-full h-[80vh] sm:h-[92vh]"
          onLoad={() => setLoading(false)}
        ></iframe>
      ) : (
        <div className="h-full w-full p-10 overflow-hidden flex items-center justify-center">
          <Loader />
        </div>
      )}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader />
        </div>
      )}
    </div>
  );
};

export default AppPage;
