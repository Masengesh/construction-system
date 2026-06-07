"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar, Header } from "@/components/layout/sidebar";
import { cn } from "@/lib/utils";

function getStoredUser() {
  try {
    const stored = typeof window !== "undefined" ? localStorage.getItem("user") : null;
    if (stored) return JSON.parse(stored) as { id: string; name: string; role: string };
  } catch {}
  return null;
}

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<{ id: string; name: string; role: string } | null>(null);
  const [checking, setChecking] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const parsed = getStoredUser();
    if (parsed && parsed.role !== "client") {
      router.push("/login");
      return;
    }
    setUser(parsed);
    setChecking(false);
  }, [router]);

  if (checking) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar role="client" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Client Portal" user={{ name: user.name, role: user.role }} />
        <main className={cn("flex-1 overflow-y-auto p-6 scrollbar-thin")}>
          {children}
        </main>
      </div>
    </div>
  );
}
