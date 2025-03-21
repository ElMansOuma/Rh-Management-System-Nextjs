"use client";

import { useState } from "react";
import { CollaborateurForm, CollaborateurData } from "@/app/(protected)/Admin/collaborateurs/collaborateur-form";
import { collaborateurService } from "@/services/api";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

export default function AddCollaborateurPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // Fonction pour convertir CollaborateurData en Collaborateur
    const convertFormDataToAPI = (formData: CollaborateurData) => {
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

    // Ajouter un collaborateur
    const handleAddCollaborateur = async (formData: CollaborateurData | null) => {
        if (!formData) {
            router.push("/collaborateurs");
            return;
        }

        setLoading(true);
        try {
            const collaborateurData = convertFormDataToAPI(formData);
            await collaborateurService.create(collaborateurData);
            toast({
                title: "Collaborateur ajouté",
                description: "Le collaborateur a été ajouté avec succès.",
            });
            router.push("/Admin/collaborateurs");
        } catch (err) {
            console.error("Erreur lors de l'ajout du collaborateur:", err);
            toast({
                title: "Erreur",
                description: "Impossible d'ajouter le collaborateur. Veuillez réessayer.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <CollaborateurForm onSuccess={handleAddCollaborateur} />
        </div>
    );
}