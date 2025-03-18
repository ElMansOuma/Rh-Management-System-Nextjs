// app/(protected)/layout.tsx
"use client";

import '../globals.css'


import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/services/auth';
import { MainNav } from '@/app/(protected)/main-nav';
import { UserNav } from '@/app/(protected)/user-nav';
import { Sidebar } from '@/app/(protected)/sidebar';

export default function ProtectedLayout({
                                            children,
                                        }: {
    children: React.ReactNode;
}) {
    const router = useRouter();

    useEffect(() => {
        // Vérifier l'authentification côté client
        if (!isAuthenticated()) {
            router.push('/login');
        }
    }, [router]);

    // Afficher un état de chargement pendant la vérification d'authentification
    if (typeof window !== 'undefined' && !isAuthenticated()) {
        return <div className="flex items-center justify-center h-screen">Chargement...</div>;
    }

    return (
        <div className="gradient-bg min-h-screen">
            <div className="navbar sticky top-0 z-50">
                <div className="flex h-16 items-center px-4">
                    <MainNav />
                    <div className="ml-auto flex items-center space-x-4">
                        <UserNav />
                    </div>
                </div>
            </div>
            <div className="flex">
                <aside className="sidebar w-64 fixed h-[calc(100vh-4rem)] top-16">
                    <Sidebar />
                </aside>
                <main className="flex-1 ml-64 p-8">{children}</main>
            </div>
        </div>
    );
}