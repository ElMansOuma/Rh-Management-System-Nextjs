// app/(protected)/layout.tsx
"use client";
import '../../globals.css'

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { isAuthenticated } from '@/services/auth';
import Link from 'next/link';
import {
    Clock,
    Calendar,
    User,
    BookOpen,
    LogOut,
    Menu,
    X,
    Bell,
    HistoryIcon
} from 'lucide-react';

export default function ProtectedLayout({
                                            children,
                                        }: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [userInfo, setUserInfo] = useState<{ nom: string; prenom: string } | null>(null);

    // Menu items pour l'interface salarié
    const menuItems = [
        {
            title: 'Profil',
            icon: <User className="w-5 h-5" />,
            path: '/salarie/profil',
            description: 'Prendre des notes personnelles'
        },
       // {
          //  title: 'Documents',
            //icon: <FileText className="w-5 h-5" />,
           // path: '/salarie/documents',
            //description: 'Consulter vos documents RH'
        //},
        {
            title: 'Pointage',
            icon: <Clock className="w-5 h-5" />,
            path: '/salarie/pointage',
            description: 'Marquer votre entrée et sortie'
        },
        {
            title: 'Historique',
            icon: <HistoryIcon className="w-5 h-5" />,
            path: '/salarie/historique',
            description: 'Consulter votre historique'
        },

        {
            title: 'Congés',
            icon: <Calendar className="w-5 h-5" />,
            path: '/salarie/conges',
            description: 'Demander et suivre vos congés'
        },
        {
            title: 'Absences',
            icon: <Calendar className="w-5 h-5" />,
            path: '/salarie/absences',
            description: 'Déclarer vos absences'
        },
        {
            title: 'Notes',
            icon: <BookOpen className="w-5 h-5" />,
            path: '/salarie/notes',
            description: 'Prendre des notes personnelles'
        },
    ];

    // Notifications simulées
    const notifications = [
        { id: 1, message: "Votre demande de congé a été approuvée", date: "2025-03-19" },
        { id: 2, message: "Rappel : Réunion d'équipe demain à 10h", date: "2025-03-18" },
    ];

    useEffect(() => {
        // Vérifier l'authentification côté client
        if (!isAuthenticated()) {
            router.push('/login');
        } else {
            // Récupérer les informations de l'utilisateur depuis localStorage
            const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
            setUserInfo(userInfo);
        }
    }, [router]);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const handleLogout = () => {
        localStorage.removeItem('userToken');
        localStorage.removeItem('userInfo');
        router.push('/loginUser');
    };

    // Afficher un état de chargement pendant la vérification d'authentification
    if (typeof window !== 'undefined' && !isAuthenticated()) {
        return <div className="flex items-center justify-center h-screen">Chargement...</div>;
    }

    return (
        <div className="gradient-bg min-h-screen">
            {/* Navbar */}
            <div className="navbar sticky top-0 z-50 bg-white shadow-md">
                <div className="flex h-16 items-center px-4">
                    {/* Mobile menu button */}
                    <button
                        className="lg:hidden mr-4 p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
                        onClick={toggleMobileMenu}
                    >
                        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>



                    <div className="ml-auto flex items-center space-x-4">
                        {/* Notifications */}
                        <div className="relative">
                            <button
                                className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
                                onClick={() => setShowNotifications(!showNotifications)}
                            >
                                <Bell className="w-6 h-6" />
                                {notifications.length > 0 && (
                                    <span className="absolute top-0 right-0 block w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
                                )}
                            </button>

                            {/* Dropdown notifications */}
                            {showNotifications && (
                                <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 z-50">
                                    <div className="px-4 py-2 border-b border-gray-100">
                                        <p className="text-sm font-medium text-gray-700">Notifications</p>
                                    </div>
                                    {notifications.length > 0 ? (
                                        <div className="max-h-60 overflow-y-auto">
                                            {notifications.map((notification) => (
                                                <div
                                                    key={notification.id}
                                                    className="px-4 py-3 hover:bg-gray-50 border-b border-gray-100"
                                                >
                                                    <p className="text-sm text-gray-800">{notification.message}</p>
                                                    <p className="text-xs text-gray-500 mt-1">{notification.date}</p>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="px-4 py-2">
                                            <p className="text-sm text-gray-500">Aucune notification</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* User profil */}
                        <div className="relative">
                            <button
                                className="flex items-center text-gray-600 hover:text-gray-900 focus:outline-none"
                                onClick={() => setShowUserMenu(!showUserMenu)}
                            >
                                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                                    <User className="w-5 h-5" />
                                </div>
                                <span className="hidden md:block ml-2">{userInfo ? `${userInfo.prenom} ${userInfo.nom}` : 'Utilisateur'}</span>

                            </button>

                            {/* Dropdown user menu */}
                            {showUserMenu && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 z-50">
                                    <Link href="/salarie/profil">
                                        <div className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                            Mon profil
                                        </div>
                                    </Link>
                                    <Link href="/salarie/parametres">
                                        <div className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                            Paramètres
                                        </div>
                                    </Link>
                                    <div className="border-t border-gray-100"></div>
                                    <button
                                        onClick={handleLogout}
                                        className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                                    >
                                        Déconnexion
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex">
                {/* Sidebar for desktop */}
                <aside className="sidebar hidden lg:block w-64 fixed h-[calc(100vh-4rem)] top-16 bg-gray-800 text-white">
                    <div className="flex-1 overflow-y-auto">
                        <nav className="p-4">
                            <ul className="space-y-2">
                                {menuItems.map((item) => (
                                    <li key={item.path}>
                                        <Link href={item.path}>
                                            <div className={`flex items-center p-3 rounded-lg ${
                                                pathname === item.path
                                                    ? 'bg-blue-600 text-white'
                                                    : 'hover:bg-gray-700'
                                            }`}>
                                                {item.icon}
                                                <span className="ml-3">{item.title}</span>
                                            </div>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>
                    <div className="p-4 border-t border-gray-700">
                        <button
                            onClick={handleLogout}
                            className="flex items-center justify-center w-full p-2 hover:bg-gray-700 rounded-lg"
                        >
                            <LogOut className="w-5 h-5 mr-2" />
                            <span>Déconnexion</span>
                        </button>
                    </div>
                </aside>

                {/* Mobile sidebar */}
                <div className={`lg:hidden fixed inset-0 z-40 bg-gray-800 transform transition-transform duration-300 ${
                    isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                }`}>
                    <div className="flex flex-col h-full pt-16">
                        <div className="flex-1 overflow-y-auto">
                            <nav className="p-4">
                                <ul className="space-y-2">
                                    {menuItems.map((item) => (
                                        <li key={item.path}>
                                            <Link href={item.path}>
                                                <div
                                                    className={`flex items-center p-3 rounded-lg text-white ${
                                                        pathname === item.path
                                                            ? 'bg-blue-600'
                                                            : 'hover:bg-gray-700'
                                                    }`}
                                                    onClick={toggleMobileMenu}
                                                >
                                                    {item.icon}
                                                    <span className="ml-3">{item.title}</span>
                                                </div>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                        </div>
                        <div className="p-4 border-t border-gray-700">
                            <button
                                onClick={handleLogout}
                                className="flex items-center justify-center w-full p-2 hover:bg-gray-700 rounded-lg text-white"
                            >
                                <LogOut className="w-5 h-5 mr-2" />
                                <span>Déconnexion</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main content */}
                <main className="flex-1 lg:ml-64 p-8 pt-16">
                    {children}

                </main>
            </div>
        </div>
    );
}