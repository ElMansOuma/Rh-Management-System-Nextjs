"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CollaborateurForm, CollaborateurData } from "@/components/collaborateur-form";
import { CollaborateursTable } from "@/components/collaborateurs-table";
import {useToast} from "@/hooks/use-toast";

export default function CollaborateursPage() {
    const [open, setOpen] = useState(false);
    const [collaborateurs, setCollaborateurs] = useState<CollaborateurData[]>([]);
    const { toast } = useToast();

    const handleAddCollaborateur = (newCollaborateur: CollaborateurData | null) => {
        if (newCollaborateur) {
            setCollaborateurs([...collaborateurs, newCollaborateur]);
            toast({
                title: "Collaborateur ajouté",
                description: `${newCollaborateur.prenom} ${newCollaborateur.nom} a été ajouté avec succès.`
            });
        }
        setOpen(false);
    };

    const handleEditCollaborateur = (index: number, updatedCollaborateur: CollaborateurData) => {
        const updatedCollaborateurs = [...collaborateurs];
        updatedCollaborateurs[index] = updatedCollaborateur;
        setCollaborateurs(updatedCollaborateurs);

        toast({
            title: "Collaborateur modifié",
            description: `Les informations de ${updatedCollaborateur.prenom} ${updatedCollaborateur.nom} ont été mises à jour.`
        });
    };

    const handleDeleteCollaborateur = (index: number) => {
        const collaborateurName = `${collaborateurs[index].prenom} ${collaborateurs[index].nom}`;
        const updatedCollaborateurs = [...collaborateurs];
        updatedCollaborateurs.splice(index, 1);
        setCollaborateurs(updatedCollaborateurs);

        toast({
            title: "Collaborateur supprimé",
            description: `${collaborateurName} a été supprimé avec succès.`,
            variant: "destructive"
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Collaborateurs</h1>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Ajouter un collaborateur
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl">
                        <DialogHeader>
                            <DialogTitle>Nouveau Collaborateur</DialogTitle>
                        </DialogHeader>
                        <CollaborateurForm onSuccess={handleAddCollaborateur} />
                    </DialogContent>
                </Dialog>
            </div>
            <CollaborateursTable
                collaborateurs={collaborateurs}
                onEdit={handleEditCollaborateur}
                onDelete={handleDeleteCollaborateur}
            />
        </div>
    );
}