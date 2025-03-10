"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export function MainNav() {
    const pathname = usePathname();

    return (
        <div className="flex items-center space-x-6 text-sm font-medium">
            <Link
                href="/"
                className={cn(
                    "transition-colors hover:text-white/90",
                    pathname === "/" ? "text-white" : "text-white/75"
                )}
            >

            </Link>
            <Link
                href="/collaborateurs"
                className={cn(
                    "transition-colors hover:text-white/90",
                    pathname === "/collaborateurs" ? "text-white" : "text-white/75"
                )}
            >
            </Link>
        </div>
    );
}