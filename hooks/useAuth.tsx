"use client";

import { useState, useEffect } from 'react';

interface User {
    id: number;
    cin?: string;
    email?: string;
    role: string;
    collaborateurId?: number;
}

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadUser() {
            try {
                // Récupérer le token JWT stocké
                const token = localStorage.getItem('authToken');

                if (!token) {
                    setUser(null);
                    setLoading(false);
                    return;
                }

                // Récupérer les informations de l'utilisateur
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const userData = await response.json();
                    setUser(userData);
                } else {
                    // Token invalide ou expiré
                    localStorage.removeItem('authToken');
                    setUser(null);
                }
            } catch (err) {
                console.error("Erreur d'authentification:", err);
                setError("Problème d'authentification");
            } finally {
                setLoading(false);
            }
        }

        loadUser();
    }, []);

    // Fonction pour se connecter avec CIN (pour les salariés)
    const login = async (cin: string, password: string): Promise<User> => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/loginUser`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ cin, password })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Identifiants invalides');
            }

            const data = await response.json();
            localStorage.setItem('authToken', data.token);
            setUser(data.user);
            return data.user;
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    // Fonction pour se connecter avec Email (pour les admins)
    const loginAdmin = async (email: string, password: string): Promise<User> => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Identifiants invalides');
            }

            const data = await response.json();
            localStorage.setItem('authToken', data.token);
            setUser(data.user);
            return data.user;
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    // Fonction pour se déconnecter
    const logout = () => {
        localStorage.removeItem('authToken');
        setUser(null);
    };

    return {
        user,
        loading,
        error,
        login,
        loginAdmin,
        logout,
        isAuthenticated: !!user
    };
}