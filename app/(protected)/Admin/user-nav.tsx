"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { LogOut, User, ChevronDown, Shield } from 'lucide-react';
import { useRouter } from "next/navigation";
import { logout } from "@/services/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

interface UserData {
    name: string;
    email: string;
    role: string;
}

export function Header() {
    return (
        <header className="sticky top-0 z-50 w-full bg-white dark:bg-gray-900 border-b shadow-sm">
            <div className="container flex h-16 items-center justify-between px-4 md:px-6">
                <div className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                    Mon Application
                </div>
                <UserNav />
            </div>
        </header>
    );
}

export function UserNav() {
    const router = useRouter();
    const [userData, setUserData] = useState<UserData>({
        name: "Administrateur",
        email: "admin@example.com",
        role: "Administrateur"
    });

    // Récupérer les données utilisateur au chargement du composant
    useEffect(() => {
        const getUserFromStorage = () => {
            if (typeof window !== 'undefined') {
                const storedUser = localStorage.getItem("user");
                if (storedUser) {
                    try {
                        const parsedUser = JSON.parse(storedUser);
                        setUserData({
                            name: parsedUser.name || "Administrateur",
                            email: parsedUser.email || "admin@example.com",
                            role: parsedUser.role || "Administrateur"
                        });
                    } catch (e) {
                        console.error("Erreur lors du parsing des données utilisateur:", e);
                    }
                }
            }
        };

        getUserFromStorage();
    }, []);

    const handleLogout = () => {
        logout();
        // Rediriger vers la page de connexion après la déconnexion
        router.push("/login");
    };

    // Obtenir les initiales pour l'avatar
    const getInitials = (name: string): string => {
        return name.split(" ").map((n: string) => n[0]).join("");
    };

    // Détermine la couleur de fond de l'avatar en fonction du rôle
    const getAvatarBgColor = (role: string): string => {
        return role.toLowerCase() === "administrateur" ? "bg-red-500" : "bg-primary";
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 h-10 pl-2 pr-3">
                    <Avatar className="h-8 w-8 mr-1">
                        <AvatarImage src="" />
                        <AvatarFallback className={getAvatarBgColor(userData.role) + " text-white"}>
                            {getInitials(userData.name)}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start">
                        <span className="font-medium text-sm">{userData.name}</span>
                        <Badge variant="outline" className={`text-xs px-1 py-0 ${userData.role.toLowerCase() === "administrateur" ? "border-red-500 text-red-500" : ""}`}>
                            {userData.role}
                        </Badge>
                    </div>
                    <ChevronDown className="h-4 w-4 opacity-50 ml-1" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium">{userData.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{userData.email}</p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/profile")} className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Mon profil</span>
                </DropdownMenuItem>
                {userData.role.toLowerCase() === "administrateur" && (
                    <DropdownMenuItem onClick={() => router.push("/admin/dashboard")} className="cursor-pointer">
                        <Shield className="mr-2 h-4 w-4" />
                        <span>Panneau d{"'"}administration</span>
                    </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 dark:text-red-400 focus:text-red-700 dark:focus:text-red-300">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Déconnexion</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}