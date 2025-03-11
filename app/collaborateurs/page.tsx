// C:\Users\DELL\Downloads\managerhr\project\app\collaborateurs\page.tsx
"use client";

import { useState, useEffect } from "react";
import { CollaborateursTable } from "@/components/collaborateurs-table";
import { CollaborateurForm, CollaborateurData } from "@/components/collaborateur-form";
import { Button } from "@/components/ui/button";
import { Collaborateur, collaborateurService } from "@/services/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {toast} from "@/components/ui/use-toast";

export default function CollaborateursPage() {
    const [collaborateurs, setCollaborateurs] = useState<Collaborateur[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [addDialogOpen, setAddDialogOpen] = useState<boolean>(false);

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
            nom: formData.nom,
            prenom: formData.prenom,
            cin: formData.cin,
            dateNaissance: formData.dateNaissance,
            lieuNaissance: formData.lieuNaissance,
            adresseDomicile: formData.adresse, // Conversion du nom de champ
            cnss: formData.cnss,
            origine: formData.origine,
            niveauEtude: formData.niveauEtude,
            specialite: formData.specialite,
            dateEntretien: formData.dateEntretien,
            dateEmbauche: formData.dateEmbauche,
            description: formData.description
        };
    };

    // Fonction pour convertir Collaborateur en CollaborateurData
    const convertAPIToFormData = (collaborateur: Collaborateur): CollaborateurData => {
        return {
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

    // Ajouter un collaborateur
    const handleAddCollaborateur = async (formData: CollaborateurData | null) => {
        if (!formData) {
            setAddDialogOpen(false);
            return;
        }

        try {
            const collaborateurData = convertFormDataToAPI(formData);
            await collaborateurService.create(collaborateurData);
            await fetchCollaborateurs(); // Recharger la liste après ajout
            setAddDialogOpen(false);
            toast({
                title: "Collaborateur ajouté",
                description: "Le collaborateur a été ajouté avec succès.",
            });
        } catch (err) {
            console.error("Erreur lors de l'ajout du collaborateur:", err);
            toast({
                title: "Erreur",
                description: "Impossible d'ajouter le collaborateur. Veuillez réessayer.",
                variant: "destructive",
            });
        }
    };

    // Modifier un collaborateur
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

    if (loading) return <div className="flex justify-center p-6">Chargement...</div>;
    if (error) return <div className="text-red-500 p-6">{error}</div>;

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Gestion des Collaborateurs</h1>
                <Button onClick={() => setAddDialogOpen(true)}>Ajouter un collaborateur</Button>
            </div>

            <CollaborateursTable
                collaborateurs={collaborateurs.map(convertAPIToFormData)}
                onEdit={handleEditCollaborateur}
                onDelete={handleDeleteCollaborateur}
            />

            <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
                <DialogContent className="max-w-4xl">
                    <DialogHeader>
                        <DialogTitle>Ajouter un nouveau collaborateur</DialogTitle>
                    </DialogHeader>
                    <CollaborateurForm onSuccess={handleAddCollaborateur} />
                </DialogContent>
            </Dialog>
        </div>
    );
}