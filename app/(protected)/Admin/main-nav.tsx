"use client";

import { usePathname } from "next/navigation";
import { Building2 } from "lucide-react";

export function MainNav() {
    const pathname = usePathname();

    return (
        <div className="flex items-center gap-2 ml-4">
            <Building2 className="h-7 w-7 text-blue-200" />
            <span className="font-bold text-xl text-white">RH Pro</span>
        </div>
    );
}
