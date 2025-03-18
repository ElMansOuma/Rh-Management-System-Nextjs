"use client";

import { Button } from "@/components/ui/button";
import { LogIn, UserPlus, User, Settings, LogOut } from 'lucide-react';
import { useRouter } from "next/navigation";
import { logout } from "@/services/auth"; // Importez la fonction logout
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
    return (
        <header className="flex justify-between items-center p-4 border-b">
            <div className="text-xl font-bold">My Application</div>
            <UserNav />
        </header>
    );
}

export function UserNav() {
    const router = useRouter();

    const handleLogout = () => {
        // Utiliser la fonction logout du service d'authentification
        logout();
        // Pas besoin de router.push car logout() fait déjà la redirection
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    <span>Profil</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/profile")}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Voir le profil</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Déconnexion</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}