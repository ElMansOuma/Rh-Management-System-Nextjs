"use client";

import { Button } from "@/components/ui/button";

export function UserNav() {
    return (
        <div className="flex items-center space-x-4">
            <Button variant="ghost" className="text-white/75 hover:text-white hover:bg-white/10">
                Se connecter
            </Button>
            <Button className="bg-white text-blue-600 hover:bg-white/90">
                S{"'"}inscrire
            </Button>
        </div>
    );
}