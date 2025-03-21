"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Clock,
  Calendar,
  FileText
} from "lucide-react";

const sidebarItems = [
  {
    title: "Tableau de bord",
    href: "/Admin/dashboard",
    icon: LayoutDashboard
  },
  {
    title: "Collaborateurs",
    href: "/Admin/collaborateurs",
    icon: Users
  },
  {
    title: "Pointage",
    href: "/Admin/pointage",
    icon: Clock
  },
  {
    title: "Congés",
    href: "/Admin/conges",
    icon: Calendar
  },
  {
    title: "Contrats",
    href: "/Admin/contrats",
    icon: FileText
  }
];

export function Sidebar() {
  const pathname = usePathname();

  return (
      <div className="h-screen w-64 bg-gradient-to-b from-gray-800 via-gray-600 to-blue-200 text-white fixed left-0 top-0 shadow-xl">
        <div className="p-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-800 bg-clip-text text-transparent mb-8">
            <br />
          </h1>
          <nav className="space-y-2">
            {sidebarItems.map((item) => (
                <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                        "flex items-center space-x-3 p-4 rounded-xl transition-all duration-200",
                        pathname === item.href
                            ? "bg-gradient-to-r from-gray-800 via-gray-600 shadow-lg scale-105"
                            : "hover:bg-white/10"
                    )}
                >
                  <item.icon
                      className={cn(
                          "h-5 w-5 transition-transform duration-200",
                          pathname === item.href ? "scale-110" : ""
                      )}
                  />
                  <b>
                    <span className="font-medium">{item.title}</span>
                  </b>
                </Link>
            ))}
          </nav>
        </div>
      </div>
  );
}