"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface SidebarProps {
  role?: "admin" | "client" | "architect" | "manager" | "worker" | "default";
  className?: string;
}

const navigationByRole: Record<string, { name: string; href: string; icon: string }[]> = {
  admin: [
    { name: "Admin Panel", href: "/admin", icon: "⚙️" },
    { name: "Projects", href: "/admin/projects", icon: "🏗️" },
    { name: "Users", href: "/admin/users", icon: "👥" },
    { name: "Reports", href: "/admin/reports", icon: "📊" },
    { name: "Messages", href: "/admin/messages", icon: "💬" },
  ],
  architect: [
    { name: "Overview", href: "/architect", icon: "📊" },
    { name: "My Designs", href: "/architect/designs", icon: "📐" },
    { name: "Marketplace", href: "/architect/marketplace", icon: "🛒" },
    { name: "Profile", href: "/architect/profile", icon: "👤" },
  ],
  client: [
    { name: "Overview", href: "/client", icon: "📊" },
    { name: "Projects", href: "/client/projects", icon: "🏗️" },
    { name: "Reports", href: "/client/reports", icon: "📈" },
    { name: "Messages", href: "/client/messages", icon: "💬" },
    { name: "Profile", href: "/client/profile", icon: "👤" },
  ],
  manager: [
    { name: "Dashboard", href: "/dashboard", icon: "📊" },
    { name: "Projects", href: "/projects", icon: "🏗️" },
    { name: "Tasks", href: "/tasks", icon: "📋" },
    { name: "Users", href: "/users", icon: "👥" },
  ],
  worker: [
    { name: "My Tasks", href: "/worker", icon: "📋" },
    { name: "Projects", href: "/projects", icon: "🏗️" },
  ],
  default: [
    { name: "Dashboard", href: "/dashboard", icon: "📊" },
    { name: "Projects", href: "/projects", icon: "🏗️" },
    { name: "Tasks", href: "/tasks", icon: "📋" },
    { name: "Users", href: "/users", icon: "👥" },
  ],
};

export function Sidebar({ role = "default", className }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    document.cookie = "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.push("/login");
  };

  const navItems = navigationByRole[role] || navigationByRole.default;

  const roleBadgeColors: Record<string, string> = {
    admin: "bg-blue-600",
    architect: "bg-purple-600",
    client: "bg-green-600",
    manager: "bg-orange-600",
    worker: "bg-gray-600",
  };

  const roleLabels: Record<string, string> = {
    admin: "ADMIN",
    architect: "ARCHITECT",
    client: "CLIENT",
    manager: "MANAGER",
    worker: "WORKER",
  };

  return (
    <aside className={cn("flex flex-col w-64 h-full bg-white border-r", className)}>
      <div className="flex items-center h-16 px-6 border-b">
        <h1 className="text-xl font-bold text-construction-blue">ConstructPro</h1>
        <span className={`ml-2 text-xs text-white px-2 py-0.5 rounded ${roleBadgeColors[role] || "bg-gray-600"}`}>{roleLabels[role] || "USER"}</span>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center px-4 py-2.5 rounded-lg transition-colors text-sm font-medium",
                isActive ? "bg-primary-50 text-primary-600" : "text-gray-700 hover:bg-gray-50"
              )}
            >
              <span className="mr-3">{item.icon}</span>
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-2 text-gray-700 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <span className="mr-3">🚪</span>
          Logout
        </button>
      </div>
    </aside>
  );
}

export function Header({ title, user }: { title?: string; user?: { name?: string; role?: string } }) {
  const avatarLetter = user?.name?.charAt(0).toUpperCase() || "U";
  return (
    <header className="flex items-center justify-between h-16 px-6 bg-white border-b">
      <h2 className="text-lg font-semibold text-gray-800">{title || "Dashboard"}</h2>
      <div className="flex items-center space-x-4">
        {user?.name && <span className="text-sm text-gray-600">{user.name}</span>}
        <div className="w-9 h-9 bg-primary-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
          {avatarLetter}
        </div>
      </div>
    </header>
  );
}
