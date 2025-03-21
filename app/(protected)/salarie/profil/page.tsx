"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Calendar, MapPin, FileText, Briefcase, Phone, Mail, User, Info, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Interface pour les données du collaborateur
interface CollaborateurData {
    id?: number;
    nom: string;
    prenom: string;
    cin: string;
    dateNaissance: string | null;
    lieuNaissance: string;
    adresse?: string;
    adresseDomicile?: string;
    cnss: string;
    origine: string;
    niveauEtude: string;
    specialite: string;
    dateEntretien: string | null;
    dateEmbauche: string | null;
    description: string;
}

// Fonction pour formater les dates
const formatDate = (dateString: string | null): string => {
    if (!dateString) return "Non spécifié";

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Date invalide";

    return new Intl.DateTimeFormat('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }).format(date);
};

// API URL avec fallback
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export default function SalarieProfilePage() {
    const [collaborateur, setCollaborateur] = useState<CollaborateurData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        const fetchCollaborateurProfile = async () => {
            setLoading(true);
            try {
                // Obtenir le token du localStorage
                const token = localStorage.getItem('userToken');
                const userInfo = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo') || '{}') : null;

                if (!token || !userInfo || !userInfo.cin) {
                    throw new Error("Veuillez vous connecter pour accéder à votre profil");
                }

                console.log("Tentative de récupération du profil avec CIN:", userInfo.cin);

                // Appel API pour récupérer le profil utilisateur avec l'URL complète
                const response = await fetch(`${API_URL}/api/auth/user/profile?cin=${userInfo.cin}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                console.log("Statut de la réponse:", response.status);

                if (response.status === 404) {
                    throw new Error(`Profil utilisateur avec CIN ${userInfo.cin} non trouvé. Veuillez vous connecter à nouveau.`);
                } else if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.message || `Erreur lors de la récupération du profil: ${response.status}`);
                }

                const data = await response.json();
                console.log("Données reçues:", data);

                if (!data || Object.keys(data).length === 0) {
                    throw new Error("Aucune donnée de profil reçue");
                }

                setCollaborateur(data);
                setLoading(false);
            } catch (err) {
                console.error("Erreur lors du chargement des données:", err);
                setError(err instanceof Error ? err.message : "Impossible de charger votre profil. Veuillez réessayer plus tard.");

                toast({
                    title: "Erreur",
                    description: err instanceof Error ? err.message : "Erreur de chargement du profil",
                    variant: "destructive"
                });

                setLoading(false);
            }
        };

        fetchCollaborateurProfile();
    }, [toast]);

    // Fonction de déconnexion
    const handleLogout = () => {
        // Clear localStorage
        localStorage.removeItem('userToken');
        localStorage.removeItem('userInfo');
        localStorage.removeItem('userId');
        localStorage.removeItem('userCin');
        localStorage.removeItem('userName');

        // Clear cookies too
        import('js-cookie').then(Cookies => {
            Cookies.default.remove('userToken', { path: '/' });
        });

        // Show notification
        toast({
            title: "Déconnexion",
            description: "Vous avez été déconnecté avec succès",
            variant: "default"
        });

        // Redirect to login page
        window.location.href = '/loginUser';
    };

    // Fonction pour essayer de récupérer le profil manuellement avec un CIN spécifique
    const tryWithSpecificCin = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('userToken');
            if (!token) {
                throw new Error("Token d'authentification manquant");
            }

            const specificCin = "ouma1234"; // CIN spécifique
            console.log("Tentative avec CIN spécifique:", specificCin);

            const response = await fetch(`${API_URL}/api/auth/user/profile?cin=${specificCin}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log("Statut de la réponse (CIN spécifique):", response.status);

            if (!response.ok) {
                throw new Error(`Erreur lors de la récupération du profil avec CIN ${specificCin}: ${response.status}`);
            }

            const data = await response.json();
            console.log("Données reçues avec CIN spécifique:", data);

            if (!data || Object.keys(data).length === 0) {
                throw new Error("Aucune donnée de profil reçue avec le CIN spécifique");
            }

            setCollaborateur(data);
            setError(null);

            // Mettre à jour userInfo dans localStorage
            const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
            userInfo.cin = specificCin;
            localStorage.setItem('userInfo', JSON.stringify(userInfo));

            toast({
                title: "Succès",
                description: "Profil récupéré avec succès",
                variant: "default"
            });
        } catch (err) {
            console.error("Erreur avec CIN spécifique:", err);
            setError(err instanceof Error ? err.message : "Tentative de récupération avec CIN spécifique échouée");

            toast({
                title: "Erreur",
                description: err instanceof Error ? err.message : "Erreur avec CIN spécifique",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
                    <p className="mt-4 text-gray-600">Chargement de votre profil...</p>
                </div>
            </div>
        );
    }

    if (error || !collaborateur) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
                <Card className="max-w-md w-full shadow-lg border-t-4 border-t-red-600">
                    <CardContent className="pt-6 text-center">
                        <Info className="h-12 w-12 text-red-600 mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-gray-800 mb-2">Erreur</h2>
                        <p className="text-gray-600 mb-6">{error || "Profil non trouvé"}</p>
                        <div className="flex space-x-3 justify-center flex-wrap gap-2">
                            <Button
                                onClick={() => window.location.href = '/salarie/dashboard'}
                                className="bg-gray-600 hover:bg-gray-700"
                            >
                                Retour au Tableau de Bord
                            </Button>
                            <Button
                                onClick={handleLogout}
                                variant="destructive"
                            >
                                Déconnexion
                            </Button>
                            <Button
                                onClick={tryWithSpecificCin}
                                className="bg-blue-600 hover:bg-blue-700 mt-2 w-full"
                            >
                                Essayer avec CIN: ouma1234
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
            <div className="container mx-auto py-10 px-4">
                <Card className="max-w-4xl mx-auto shadow-lg border-t-4 border-t-blue-600">
                    <CardHeader className="border-b pb-6">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-4">
                                <div className="bg-blue-100 p-3 rounded-full">
                                    <User className="h-7 w-7 text-blue-600" />
                                </div>
                                <div>
                                    <CardTitle className="text-2xl font-bold text-gray-900">
                                        Mon Profil
                                    </CardTitle>
                                    <p className="text-gray-500 text-sm mt-1">
                                        Vos informations personnelles et professionnelles
                                    </p>
                                </div>
                            </div>
                            <div className="flex space-x-2">
                                <Button
                                    onClick={() => window.location.href = '/salarie/dashboard'}
                                    variant="outline"
                                    className="border-gray-300 hover:bg-gray-100"
                                >
                                    Retour au Tableau de Bord
                                </Button>
                                <Button
                                    onClick={handleLogout}
                                    variant="destructive"
                                    className="bg-red-500 hover:bg-red-600 flex items-center gap-1"
                                >
                                    <LogOut className="h-4 w-4" />
                                    Déconnexion
                                </Button>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="px-6 pt-6 pb-8">
                        <div className="space-y-8">
                            {/* En-tête du profil */}
                            <div className="bg-blue-50 p-6 rounded-lg border border-blue-100 flex flex-col md:flex-row items-center md:items-start gap-6">
                                <div className="bg-white p-4 rounded-full border-4 border-blue-200 shadow-sm">
                                    <div className="bg-blue-600 text-white text-3xl font-bold rounded-full w-20 h-20 flex items-center justify-center">
                                        {collaborateur.prenom?.charAt(0) || "?"}{collaborateur.nom?.charAt(0) || "?"}
                                    </div>
                                </div>
                                <div className="text-center md:text-left flex-1">
                                    <h2 className="text-2xl font-bold text-gray-800">
                                        {collaborateur.prenom || "Prénom"} {collaborateur.nom || "Nom"}
                                    </h2>
                                    <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-2">
                                        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200">
                                            {collaborateur.specialite || "Spécialité non spécifiée"}
                                        </Badge>
                                        <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-200">
                                            {collaborateur.niveauEtude || "Niveau d'étude non spécifié"}
                                        </Badge>
                                    </div>
                                    <div className="mt-4 text-gray-600">
                                        <p className="flex items-center justify-center md:justify-start gap-2 mb-1">
                                            <Calendar className="h-4 w-4" />
                                            Embauché le {formatDate(collaborateur.dateEmbauche)}
                                        </p>
                                        <p className="flex items-center justify-center md:justify-start gap-2">
                                            <MapPin className="h-4 w-4" />
                                            {collaborateur.adresseDomicile || collaborateur.adresse || "Adresse non spécifiée"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Informations personnelles */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                                    <span className="bg-blue-100 text-blue-600 w-6 h-6 rounded-full inline-flex items-center justify-center mr-2 text-sm">1</span>
                                    Informations Personnelles
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
                                    <div>
                                        <p className="text-sm text-gray-500">CIN</p>
                                        <p className="font-medium">{collaborateur.cin || "Non spécifié"}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">CNSS</p>
                                        <p className="font-medium">{collaborateur.cnss || "Non spécifié"}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Date de naissance</p>
                                        <p className="font-medium">{formatDate(collaborateur.dateNaissance)}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Lieu de naissance</p>
                                        <p className="font-medium">{collaborateur.lieuNaissance || "Non spécifié"}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Adresse</p>
                                        <p className="font-medium">{collaborateur.adresseDomicile || collaborateur.adresse || "Non spécifiée"}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Origine</p>
                                        <p className="font-medium">{collaborateur.origine || "Non spécifiée"}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Informations professionnelles */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                                    <span className="bg-blue-100 text-blue-600 w-6 h-6 rounded-full inline-flex items-center justify-center mr-2 text-sm">2</span>
                                    Informations Professionnelles
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
                                    <div>
                                        <p className="text-sm text-gray-500">Niveau d'étude</p>
                                        <p className="font-medium">{collaborateur.niveauEtude || "Non spécifié"}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Spécialité</p>
                                        <p className="font-medium">{collaborateur.specialite || "Non spécifiée"}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Date d'entretien</p>
                                        <p className="font-medium">{formatDate(collaborateur.dateEntretien)}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Date d'embauche</p>
                                        <p className="font-medium">{formatDate(collaborateur.dateEmbauche)}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Informations additionnelles */}
                            {collaborateur.description && (
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                                        <span className="bg-blue-100 text-blue-600 w-6 h-6 rounded-full inline-flex items-center justify-center mr-2 text-sm">3</span>
                                        Informations Additionnelles
                                    </h3>
                                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                                        <p className="text-sm text-gray-500 mb-1">Description / Notes</p>
                                        <p className="whitespace-pre-line">{collaborateur.description}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}