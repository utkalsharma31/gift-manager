"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Dashboard from "@/components/Dashboard";
import Loader from "@/components/Loader";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("Session data:", session);

    async function fetchDashboardData() {
      if (status === "authenticated") {
        try {
          const res = await fetch("/api/dashboard", { 
            //method: 'GET',
            headers: { Authorization: `Bearer ${session.user.id}` },
          });

          // Check for response status before parsing
          if (res.ok) {
            const data = await res.json();
            setDashboardData(data);
          } else {
            console.error(
              "Failed to fetch dashboard data, status:",
              res.status
            );
            setError("Failed to load dashboard data.");
          }

          console.log("Response from /api/dashboard:", res);
        } catch (error) {
          console.error("Error fetching dashboard data:", error);
          setError("An error occurred while loading your dashboard.");
        }
      }
    }

    fetchDashboardData();
  }, [status, session]);

  if (status === "loading")
    return (
      <Loader />
    );
  if (status === "unauthenticated")
    return (
      <div className="flex justify-center items-center h-screen">
        Access denied
      </div>
    );

  return <Dashboard dashboardData={dashboardData} error={error} />;
}
