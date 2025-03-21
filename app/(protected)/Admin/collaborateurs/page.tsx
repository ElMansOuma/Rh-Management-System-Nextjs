"use client";
import '../../../globals.css'

import { useState, useEffect } from "react";
import { CollaborateursTable } from "@/app/(protected)/Admin/collaborateurs/collaborateurs-table";
import { CollaborateurData } from "@/app/(protected)/Admin/collaborateurs/collaborateur-form";
import { Button } from "@/components/ui/button";
import { Collaborateur, collaborateurService } from "@/services/api";
import { toast } from "@/components/ui/use-toast";
import { PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CollaborateursPage() {
    const router = useRouter();
    const [collaborateurs, setCollaborateurs] = useState<Collaborateur[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Charger les collaborateurs au chargement de la page
    useEffect(() => {
        fetchCollaborateurs();
    }, []);

    // Fonction pour récupérer les collaborateurs
    const fetchCollaborateurs = async () => {
        try {
            setLoading(true);
            const data = await collaborateurService.getAll();
            setCollaborateurs(data);
            setError(null);
        } catch (err) {
            console.error("Erreur lors du chargement des collaborateurs:", err);
            setError("Impossible de charger les collaborateurs. Veuillez réessayer.");
        } finally {
            setLoading(false);
        }
    };

    // Fonction pour convertir CollaborateurData en Collaborateur
    const convertFormDataToAPI = (formData: CollaborateurData): Collaborateur => {
        return {
            nom: formData.nom ?? "",
            prenom: formData.prenom ?? "",
            cin: formData.cin ?? "",
            dateNaissance: formData.dateNaissance ?? "",
            lieuNaissance: formData.lieuNaissance ?? "",
            adresseDomicile: formData.adresse ?? "", // Conversion du nom de champ
            cnss: formData.cnss ?? "",
            origine: formData.origine ?? "",
            niveauEtude: formData.niveauEtude ?? "",
            specialite: formData.specialite ?? "",
            dateEntretien: formData.dateEntretien ?? "",
            dateEmbauche: formData.dateEmbauche ?? "",
            description: formData.description ?? ""
        };
    };


    // Fonction pour convertir Collaborateur en CollaborateurData
    const convertAPIToFormData = (collaborateur: Collaborateur): CollaborateurData => {
        return {
            id: collaborateur.id,
            nom: collaborateur.nom,
            prenom: collaborateur.prenom,
            cin: collaborateur.cin,
            dateNaissance: collaborateur.dateNaissance,
            lieuNaissance: collaborateur.lieuNaissance,
            adresse: collaborateur.adresseDomicile, // Conversion du nom de champ
            cnss: collaborateur.cnss,
            origine: collaborateur.origine,
            niveauEtude: collaborateur.niveauEtude,
            specialite: collaborateur.specialite,
            dateEntretien: collaborateur.dateEntretien,
            dateEmbauche: collaborateur.dateEmbauche,
            description: collaborateur.description || ""
        };
    };

    // Modifier un collaborateur - conservé comme dans votre code original
    const handleEditCollaborateur = async (index: number, formData: CollaborateurData) => {
        const collaborateur = collaborateurs[index];

        if (!collaborateur.id) {
            console.error("ID du collaborateur manquant");
            return;
        }

        try {
            const collaborateurData = convertFormDataToAPI(formData);
            await collaborateurService.update(collaborateur.id, collaborateurData);
            await fetchCollaborateurs(); // Recharger la liste après modification
            toast({
                title: "Collaborateur modifié",
                description: "Le collaborateur a été modifié avec succès.",
            });
        } catch (err) {
            console.error("Erreur lors de la modification du collaborateur:", err);
            toast({
                title: "Erreur",
                description: "Impossible de modifier le collaborateur. Veuillez réessayer.",
                variant: "destructive",
            });
        }
    };


    // Supprimer un collaborateur
    const handleDeleteCollaborateur = async (index: number) => {
        const collaborateur = collaborateurs[index];

        if (!collaborateur.id) {
            console.error("ID du collaborateur manquant");
            return;
        }

        if (!confirm("Êtes-vous sûr de vouloir supprimer ce collaborateur ?")) {
            return;
        }

        try {
            await collaborateurService.delete(collaborateur.id);
            await fetchCollaborateurs(); // Recharger la liste après suppression
            toast({
                title: "Collaborateur supprimé",
                description: "Le collaborateur a été supprimé avec succès.",
            });
        } catch (err) {
            console.error("Erreur lors de la suppression du collaborateur:", err);
            toast({
                title: "Erreur",
                description: "Impossible de supprimer le collaborateur. Veuillez réessayer.",
                variant: "destructive",
            });
        }
    };


    // Rediriger vers la page d'ajout
    const handleAddCollaborateur = () => {
        router.push("/Admin/collaborateurs/add");
    };

    if (loading) return <div className="flex justify-center p-6">Chargement...</div>;
    if (error) return <div className="text-red-500 p-6">{error}</div>;

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-extrabold text-gray-800">
                    Gestion des Collaborateurs
                </h1>
                <Button
                    onClick={handleAddCollaborateur}
                    className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-semibold py-2 px-5 rounded-lg shadow-md flex items-center transition-all duration-300"
                >
                    <PlusIcon className="w-5 h-5 mr-2 stroke-white" />
                    Ajouter un collaborateur
                </Button>
            </div>

            <CollaborateursTable
                collaborateurs={collaborateurs.map(convertAPIToFormData)}
                onEdit={handleEditCollaborateur}
                onDelete={handleDeleteCollaborateur}
            />
        </div>
    );
}