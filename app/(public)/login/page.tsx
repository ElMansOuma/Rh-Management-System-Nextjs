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
                body: JSON.stringify({
                    email,
                    password
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Erreur de connexion');
            }

            // Vérification explicite du rôle ADMIN
            if (data.role !== 'ADMIN') {
                throw new Error('Accès réservé aux administrateurs');
            }

            // Stocker le token et les informations utilisateur de manière sécurisée
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify({
                name: data.name,
                email: data.email,
                role: data.role
            }));

            // Redirection vers le tableau de bord admin
            router.push('/Admin/dashboard');
        } catch (err) {
            console.error('Login error:', err);
            setError(err instanceof Error ? err.message : 'Erreur de connexion');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="w-full max-w-md mx-auto">
            <div className="space-y-6 p-6">
                <div className="text-center">
                    <h1 className="text-2xl font-bold">Connexion Admin</h1>
                    <p className="text-sm text-gray-500">Espace réservé à l'administration</p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label>Email administrateur</Label>
                        <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="bg-gray-700/50 border-gray-600 text-white placeholder:text-white/50"
                        />
                    </div>

                    <div>
                        <Label>Mot de passe</Label>
                        <Input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="bg-gray-700/50 border-gray-600 text-white"
                        />
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? 'Connexion en cours...' : 'Se connecter'}
                    </Button>
                </form>

                <div className="text-center space-y-2">
                    <Link href="/" className="text-sm text-blue-500 hover:underline flex items-center justify-center">
                        <ArrowLeft className="mr-2" size={16} /> Retour à l'accueil
                    </Link>
                </div>
            </div>
        </Card>
    );
}