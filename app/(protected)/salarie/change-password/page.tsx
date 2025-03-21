"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";

export default function ChangePasswordPage() {
    const router = useRouter();
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        // Vérifier si l'utilisateur est connecté
        const token = localStorage.getItem("userToken");
        const userId = localStorage.getItem("userId");

        if (!token || !userId) {
            // Rediriger vers la page de connexion si non connecté
            router.push("/loginUser");
        }
    }, [router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation des mots de passe
        if (newPassword.length < 6) {
            setError("Le mot de passe doit contenir au moins 6 caractères");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Les mots de passe ne correspondent pas");
            return;
        }

        setLoading(true);
        setError("");

        const userId = localStorage.getItem("userId");
        const token = localStorage.getItem("userToken");

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/user/change-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    id: userId,
                    newPassword: newPassword
                })
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || "Erreur lors du changement de mot de passe");
            }

            toast({
                title: "Mot de passe modifié",
                description: "Votre mot de passe a été changé avec succès",
            });

            // Rediriger vers le tableau de bord
            router.push("/salarie/dashboard");

        } catch (err: any) {
            setError(err.message || "Une erreur est survenue");
            toast({
                title: "Erreur",
                description: err.message || "Une erreur est survenue lors du changement de mot de passe",
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
                        Changer votre mot de passe
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Pour des raisons de sécurité, veuillez définir un nouveau mot de passe
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
                            <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">
                                Nouveau mot de passe
                            </label>
                            <div className="mt-1">
                                <input
                                    id="new-password"
                                    name="new-password"
                                    type="password"
                                    required
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="block w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                    placeholder="Au moins 6 caractères"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                                Confirmer le mot de passe
                            </label>
                            <div className="mt-1">
                                <input
                                    id="confirm-password"
                                    name="confirm-password"
                                    type="password"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="block w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                    placeholder="Confirmer votre nouveau mot de passe"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                {loading ? "Traitement en cours..." : "Changer mon mot de passe"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}