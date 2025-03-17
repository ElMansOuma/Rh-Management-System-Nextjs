'use client';

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Register() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Vérification des mots de passe
        if (formData.password !== formData.confirmPassword) {
            setError('Les mots de passe ne correspondent pas');
            return;
        }

        // Vérification de la longueur du mot de passe
        if (formData.password.length < 6) {
            setError('Le mot de passe doit contenir au moins 6 caractères');
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Erreur lors de l\'inscription');
            }

            // Afficher le message de succès
            setSuccess('Votre compte a été créé avec succès! Redirection vers la page de connexion...');

            // Attendre 2 secondes avant de rediriger vers la page de connexion
            setTimeout(() => {
                router.push('/login');
            }, 2000);

        } catch (err) {
            console.error('Register error:', err);
            setError(err instanceof Error ? err.message : 'Erreur lors de l\'inscription');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value,
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <Card className="w-full max-w-md p-8 bg-gray-800/50 backdrop-blur-sm border-gray-700">
                <div className="flex flex-col items-center mb-8">
                    <Building2 className="h-12 w-12 text-blue-200 mb-4" />
                    <h1 className="text-3xl font-bold text-white">Créer un compte</h1>
                    <p className="text-white/70 mt-2 text-center">
                        Rejoignez notre plateforme de gestion RH
                    </p>
                </div>

                {error && (
                    <div className="bg-red-500/20 border border-red-500 p-3 rounded mb-4 text-white">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="bg-green-500/20 border border-green-500 p-3 rounded mb-4 text-white">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-white">Nom complet</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="bg-gray-700/50 border-gray-600 text-white"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-white">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="votre@email.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="bg-gray-700/50 border-gray-600 text-white placeholder:text-white/50"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password" className="text-white">Mot de passe</Label>
                        <Input
                            id="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="bg-gray-700/50 border-gray-600 text-white"
                        />
                        <p className="text-xs text-white/50">Au moins 6 caractères</p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword" className="text-white">Confirmer le mot de passe</Label>
                        <Input
                            id="confirmPassword"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            className="bg-gray-700/50 border-gray-600 text-white"
                        />
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-blue-200 text-gray-800 hover:bg-blue-300"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Inscription en cours...' : 'S\'inscrire'}
                    </Button>
                </form>

                <div className="mt-6 text-center space-y-4">
                    <p className="text-sm text-white/70">
                        Vous avez déjà un compte ?{' '}
                        <Link href="/login" className="text-blue-200 hover:underline">
                            Se connecter
                        </Link>
                    </p>

                    <Link href="/" className="text-sm text-white/70 hover:text-blue-200 inline-flex items-center">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Retour à l&apos;accueil
                    </Link>
                </div>
            </Card>
        </div>
    );
}