"use client";

import { useEffect, useState } from "react";
import { useLoginStore } from "@/store";
import Sidebar from "./components/Sidebar";
import Home from "./page";
import Spinner from "./components/Spinner";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userToken = useLoginStore((state) => state.userToken);
  const add = useLoginStore((state) => state.add);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const res = await fetch("/api/token", { credentials: "include" });
        const data = await res.json();
        if (data.token) {
          add(data.token);
        }
      } catch (err) {
        console.error("Erro ao buscar token:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchToken();
  }, [add]);

  if (loading) {
    return (
      <main className="flex flex-1 justify-center items-center overflow-y-auto h-screen  bg-neutral-900 text-white">
        <Spinner />
      </main>
    );
  }

  if (!userToken) {
    return (
      <main className="flex flex-1 justify-center items-center overflow-y-auto h-screen  bg-neutral-900 text-white">
        <Home />
      </main>
    );
  }

  return (
    <>
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-pages-bg">
        <div className="p-8">{children}</div>
      </main>
    </>
  );
}
