'use client';

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Erreur de connexion');
            }

            // Stocker le token dans localStorage
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify({
                name: data.name,
                email: data.email,
                role: data.role
            }));

            // Redirection vers le tableau de bord
            router.push('/dashboard');
        } catch (err) {
            console.error('Login error:', err);
            setError(err instanceof Error ? err.message : 'Erreur de connexion');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <Card className="w-full max-w-md p-8 bg-gray-800/50 backdrop-blur-sm border-gray-700">
                <div className="flex flex-col items-center mb-8">
                    <Building2 className="h-12 w-12 text-blue-200 mb-4" />
                    <h1 className="text-3xl font-bold text-white">Connexion</h1>
                    <p className="text-white/70 mt-2 text-center">
                        Accédez à votre espace de gestion RH
                    </p>
                </div>

                {error && (
                    <div className="bg-red-500/20 border border-red-500 p-3 rounded mb-4 text-white">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-white">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="votre@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="bg-gray-700/50 border-gray-600 text-white placeholder:text-white/50"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password" className="text-white">Mot de passe</Label>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="bg-gray-700/50 border-gray-600 text-white"
                        />
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-blue-200 text-gray-800 hover:bg-blue-300"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Connexion en cours...' : 'Se connecter'}
                    </Button>
                </form>

                <div className="mt-6 text-center space-y-4">
                    <p className="text-sm text-white/70">
                        Vous n'avez pas de compte ?{' '}
                        <Link href="/register" className="text-blue-200 hover:underline">
                            S'inscrire
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