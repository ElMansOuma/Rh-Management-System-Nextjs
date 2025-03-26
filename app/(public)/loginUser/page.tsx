// app/loginUser/page.tsx
"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authUserService } from '../../../services/authUser';
import {toast} from "@/components/ui/use-toast";

export default function LoginUserPage() {
    const router = useRouter();
    const [cin, setCin] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const userData = await authUserService.login({ cin, password });

            toast({
                title: "Connexion réussie",
                description: "Vous êtes maintenant connecté",
            });

            // Redirection en fonction du besoin de réinitialisation de mot de passe
            if (userData.resetPassword) {
                router.push('/salarie/change-password');
            } else {
                router.push('/salarie/dashboard');
            }
        } catch (err: any) {
            setError(err.message || "Une erreur est survenue lors de la connexion");
            toast({
                title: "Erreur de connexion",
                description: err.message || "Veuillez vérifier vos identifiants",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen flex-col justify-center bg-gray-100 py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                    Espace Collaborateur
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Connectez-vous avec votre CIN et votre mot de passe
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
                    {error && (
                        <div className="mb-4 rounded-md bg-red-50 p-4">
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="cin" className="block text-sm font-medium text-gray-700">
                                CIN
                            </label>
                            <input
                                id="cin"
                                name="cin"
                                type="text"
                                required
                                value={cin}
                                onChange={(e) => setCin(e.target.value)}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm"
                                placeholder="Votre numéro CIN"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Mot de passe
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm"
                                placeholder="Votre mot de passe"
                            />
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
                            >
                                {loading ? "Connexion en cours..." : "Se connecter"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}