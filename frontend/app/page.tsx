"use client";

import { useEffect, useState } from "react";

type HealthResponse = {
  status: string;
};

export default function Home() {
  const [status, setStatus] = useState("loading...");

  useEffect(() => {
    async function loadHealth() {
      try {
        const response = await fetch("http://localhost:4000/health");
        if (!response.ok) {
          throw new Error("Health endpoint unavailable");
        }
        const data = (await response.json()) as HealthResponse;
        setStatus(data.status);
      } catch (_error) {
        setStatus("unreachable");
      }
    }

    loadHealth();
  }, []);

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-3xl font-bold">NSTU Marketplace</h1>
      <p className="text-lg">
        Backend health: <span className="font-semibold">{status}</span>
      </p>
    </main>
  );
}
