"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { User, Save, X, Mail, Shield, Camera, Building2 } from "lucide-react";
import { Header } from "@/components/user-nav";

interface UserData {
    name: string;
    email: string;
    role: string;
    company?: string;
    location?: string;
    bio?: string;
}

interface FormData {
    name: string;
    email: string;
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
    company: string;
    location: string;
    bio: string;
}

export default function ProfilePage() {
    // Récupérer les données de l'utilisateur depuis localStorage
    const getUserFromStorage = (): UserData => {
        if (typeof window !== 'undefined') {
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                try {
                    const parsedUser = JSON.parse(storedUser);
                    return {
                        name: parsedUser.name || "Utilisateur",
                        email: parsedUser.email || "user@example.com",
                        role: parsedUser.role || "Utilisateur",
                        company: parsedUser.company || "Mon Entreprise",
                        location: parsedUser.location || "Paris, France",
                        bio: parsedUser.bio || "Bio non renseignée",
                    };
                } catch (e) {
                    console.error("Erreur lors du parsing des données utilisateur:", e);
                }
            }
        }

        return {
            name: "Utilisateur",
            email: "user@example.com",
            role: "Utilisateur",
            company: "Mon Entreprise",
            location: "Paris, France",
            bio: "Bio non renseignée",
        };
    };

    const [user, setUser] = useState<UserData>(getUserFromStorage());

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        name: user.name,
        email: user.email,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
        company: user.company || "",
        location: user.location || "",
        bio: user.bio || "",
    });

    const [activeTab, setActiveTab] = useState("general");
    const [isLoading, setIsLoading] = useState(false);
    const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

    // Mettre à jour formData quand user change
    useEffect(() => {
        setFormData({
            name: user.name,
            email: user.email,
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
            company: user.company || "",
            location: user.location || "",
            bio: user.bio || "",
        });
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simuler un appel API
        await new Promise(resolve => setTimeout(resolve, 1500));

        const updatedUser = {
            ...user,
            name: formData.name,
            email: formData.email,
            company: formData.company,
            location: formData.location,
            bio: formData.bio,
        };

        setUser(updatedUser);

        // Mettre à jour localStorage
        if (typeof window !== 'undefined') {
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                try {
                    const parsedUser = JSON.parse(storedUser);
                    const newStoredUser = {
                        ...parsedUser,
                        name: formData.name,
                        email: formData.email,
                    };
                    localStorage.setItem("user", JSON.stringify(newStoredUser));
                } catch (e) {
                    console.error("Erreur lors de la mise à jour de l'utilisateur:", e);
                }
            }
        }

        setNotification({ type: "success", message: "Profil mis à jour avec succès!" });
        setIsEditing(false);
        setIsLoading(false);
    };

    const handleCancel = () => {
        setFormData({
            name: user.name,
            email: user.email,
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
            company: user.company || "",
            location: user.location || "",
            bio: user.bio || "",
        });
        setIsEditing(false);
        setNotification(null);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">


            <div className="py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto space-y-8">
                    {/* Profile Header */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                        <div className="flex flex-col sm:flex-row items-center gap-6">
                            <div className="relative group">
                                <Avatar className="h-24 w-24 ring-4 ring-white dark:ring-gray-800">
                                    <AvatarImage src="" />
                                    <AvatarFallback className="text-2xl bg-primary">
                                        {user.name.split(" ").map(n => n[0]).join("")}
                                    </AvatarFallback>
                                </Avatar>
                                <button className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Camera className="h-4 w-4" />
                                </button>
                            </div>

                            <div className="flex-1 text-center sm:text-left">
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{user.name}</h1>
                                <div className="flex flex-col sm:flex-row items-center gap-2 mt-2">
                                    <div className="flex items-center text-gray-600 dark:text-gray-300">
                                        <Mail className="h-4 w-4 mr-2" />
                                        {user.email}
                                    </div>
                                    <Badge variant="secondary" className="flex items-center gap-1">
                                        <Shield className="h-3 w-3" />
                                        {user.role}
                                    </Badge>
                                </div>
                                <div className="flex items-center justify-center sm:justify-start gap-4 mt-4">
                                    <div className="flex items-center text-gray-600 dark:text-gray-300">
                                        <Building2 className="h-4 w-4 mr-2" />
                                        {user.company}
                                    </div>
                                    <div className="text-gray-600 dark:text-gray-300">{user.location}</div>
                                </div>
                            </div>

                            {!isEditing && (
                                <Button onClick={() => setIsEditing(true)} className="w-full sm:w-auto">
                                    Modifier le profil
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Profile Content */}
                    <Card>
                        <CardContent className="p-6">
                            {notification && (
                                <div className={`mb-6 p-4 rounded-lg ${
                                    notification.type === "success"
                                        ? "bg-green-50 text-green-700 border border-green-200"
                                        : "bg-red-50 text-red-700 border border-red-200"
                                }`}>
                                    {notification.message}
                                </div>
                            )}

                            {isEditing ? (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                                        <TabsList className="w-full justify-start">
                                            <TabsTrigger value="general">Général</TabsTrigger>
                                            <TabsTrigger value="security">Sécurité</TabsTrigger>
                                        </TabsList>

                                        <TabsContent value="general" className="space-y-6 mt-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <Label htmlFor="name">Nom complet</Label>
                                                    <Input
                                                        id="name"
                                                        value={formData.name}
                                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="email">Email</Label>
                                                    <Input
                                                        id="email"
                                                        type="email"
                                                        value={formData.email}
                                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="company">Entreprise</Label>
                                                    <Input
                                                        id="company"
                                                        value={formData.company}
                                                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="location">Localisation</Label>
                                                    <Input
                                                        id="location"
                                                        value={formData.location}
                                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="bio">Biographie</Label>
                                                <textarea
                                                    id="bio"
                                                    value={formData.bio}
                                                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                                    className="w-full min-h-[100px] px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                                                />
                                            </div>
                                        </TabsContent>

                                        <TabsContent value="security" className="space-y-6 mt-6">
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                                                    <Input
                                                        id="currentPassword"
                                                        type="password"
                                                        value={formData.currentPassword}
                                                        onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                                                    />
                                                </div>

                                                <Separator />

                                                <div className="space-y-2">
                                                    <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                                                    <Input
                                                        id="newPassword"
                                                        type="password"
                                                        value={formData.newPassword}
                                                        onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="confirmPassword">Confirmez le nouveau mot de passe</Label>
                                                    <Input
                                                        id="confirmPassword"
                                                        type="password"
                                                        value={formData.confirmPassword}
                                                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                        </TabsContent>
                                    </Tabs>

                                    <div className="flex justify-end gap-4 pt-4">
                                        <Button type="button" variant="outline" onClick={handleCancel}>
                                            <X className="mr-2 h-4 w-4" />
                                            Annuler
                                        </Button>
                                        <Button type="submit" disabled={isLoading}>
                                            <Save className="mr-2 h-4 w-4" />
                                            {isLoading ? "Enregistrement..." : "Enregistrer"}
                                        </Button>
                                    </div>
                                </form>
                            ) : (
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-medium">À propos</h3>
                                        <p className="mt-2 text-gray-600 dark:text-gray-300">{user.bio}</p>
                                    </div>

                                    <Separator />

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-500">Nom complet</h4>
                                            <p className="mt-1">{user.name}</p>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-500">Email</h4>
                                            <p className="mt-1">{user.email}</p>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-500">Entreprise</h4>
                                            <p className="mt-1">{user.company}</p>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-500">Localisation</h4>
                                            <p className="mt-1">{user.location}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}