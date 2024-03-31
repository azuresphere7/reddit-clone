"use client";

import { usePathname } from "next/navigation";
import React from "react";
import Sidebar from "@/app/_components/sidebar";
import { EXCLUDE_ROUTES } from "@/utils/constants";

export default function SidebarProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname(); // Get current route url

  return (
    <main className="relative flex h-screen w-full justify-center overflow-auto">
      {!EXCLUDE_ROUTES.find((route: string) => pathname.includes(route)) && <Sidebar />}

      {children}
    </main>
  );
}
