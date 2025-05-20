"use client";

import { useLoginStore } from "@/store";
import { useEffect } from "react";

export default function Header() {
  const add = useLoginStore((state) => state.add);
  useEffect(() => {
    const getToken = async () => {
      const res = await (
        await fetch("/api/token", { credentials: "include" })
      ).json();

      console.log(res);

      useLoginStore.getState().add(res.token!);
    };

    getToken();
  }, [add]);

  return (
    <header className="flex items-center justify-between px-8 py-4 border-b border-neutral-800 bg-neutral-900">
      <h1 className="text-2xl font-bold text-white tracking-tight">
        Admin Dashboard
      </h1>
    </header>
  );
}
