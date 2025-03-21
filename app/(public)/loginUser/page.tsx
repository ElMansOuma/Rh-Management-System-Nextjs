"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "@/hooks/use-toast";
import Cookies from 'js-cookie'; // You'll need to install this: npm install js-cookie @types/js-cookie

export default function LoginUserPage() {
    const router = useRouter();
    const [cin, setCin] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/user/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ cin, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Erreur de connexion");
            }

            // Store the token in both localStorage (for client-side access) and cookies (for middleware)
            localStorage.setItem("userToken", data.token);
            localStorage.setItem("userId", data.id);
            localStorage.setItem("userCin", data.cin);
            localStorage.setItem("userName", `${data.prenom} ${data.nom}`);

            // Also save in cookies for middleware auth check
            Cookies.set("userToken", data.token, { path: '/' });

            // Store userInfo object for profile page
            localStorage.setItem("userInfo", JSON.stringify({
                id: data.id,
                cin: data.cin,
                nom: data.nom,
                prenom: data.prenom
            }));

            toast({
                title: "Connexion réussie",
                description: "Vous êtes maintenant connecté",
            });

            // Redirection en fonction du resetPassword
            if (data.resetPassword) {
                // Rediriger vers la page de changement de mot de passe
                router.push("/salarie/change-password");
            } else {
                // Rediriger vers le tableau de bord
                router.push("/salarie/dashboard");
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
                <div className="text-center">
                    <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                        Espace Collaborateur
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Connectez-vous avec votre CIN et votre mot de passe
                    </p>
                </div>
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
                            <div className="mt-1">
                                <input
                                    id="cin"
                                    name="cin"
                                    type="text"
                                    autoComplete="cin"
                                    required
                                    value={cin}
                                    onChange={(e) => setCin(e.target.value)}
                                    className="block w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                    placeholder="Votre numéro CIN"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Mot de passe
                            </label>
                            <div className="mt-1">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                    placeholder="Par défaut: 4 derniers chiffres de votre CIN"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                {loading ? "Connexion en cours..." : "Se connecter"}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="bg-white px-2 text-gray-500">ou</span>
                            </div>
                        </div>

                        <div className="mt-6 text-center">
                            <Link href="/login" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                                Connexion Admin
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}