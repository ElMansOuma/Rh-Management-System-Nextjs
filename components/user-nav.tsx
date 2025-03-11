"use client";

import { Button } from "@/components/ui/button";
import { LogIn, UserPlus } from 'lucide-react';

export function Header() {
    return (
        <header className="fixed top-0 right-0 left-64 z-10 bg-gradient-to-r from-gray-800 via-gray-600 to-blue-200 text-white border-b border-gray-700 shadow-sm">
            <div className="flex justify-between items-center py-4 px-8">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-600 bg-clip-text text-transparent">
                    My Application
                </h2>
                <UserNav />
            </div>
        </header>
    );
}

export function UserNav() {
    return (
        <div className="flex items-center space-x-4">
            <Button
                variant="ghost"
                className="flex items-center space-x-2 px-6 py-2.5 text-gray-300 hover:text-white rounded-lg transition-all duration-200 hover:bg-gray-700"
            >
                <LogIn className="h-5 w-5" />
                <span><b>Se connecter</b></span>
            </Button>
            <Button
                className="flex items-center space-x-2 px-6 py-2.5 bg-gradient-to-r from-gray-700 to-gray-600 text-white rounded-lg transition-all duration-200 hover:shadow-lg hover:scale-105"
            >
                <UserPlus className="h-5 w-5" />
                <span><b>S{"'"}inscrire</b></span>
            </Button>
        </div>
    );
}