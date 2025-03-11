"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PieceJustificative, pieceJustificativeService } from "@/services/api";
import { toast } from "@/components/ui/use-toast";
import { FileText, Trash2, Download, Plus } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { PieceJustificativeForm } from "./piece-justificative-form";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Props du composant
interface PieceJustificativeListProps {
    collaborateurId: number;
    pieces: PieceJustificative[];
    onUpdate: () => void;
    onDelete?: (id: number) => Promise<void>; // Optional prop for backward compatibility
}

export function PieceJustificativeList({ collaborateurId, pieces, onUpdate, onDelete }: PieceJustificativeListProps) {
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    // Fonction pour récupérer le nom du type
    const getTypeLabel = (type: string) => {
        switch (type) {
            case "CIN":
                return "Carte d'identité";
            case "DIPLOME":
                return "Diplôme";
            case "AUTRE":
                return "Autre document";
            default:
                return type;
        }
    };

    // Fonction pour générer la couleur du badge
    const getTypeBadgeColor = (type: string) => {
        switch (type) {
            case "CIN":
                return "bg-blue-100 text-blue-800";
            case "DIPLOME":
                return "bg-green-100 text-green-800";
            case "AUTRE":
                return "bg-gray-100 text-gray-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    // Fonction pour supprimer une pièce
    const handleDelete = async (id: number) => {
        if (!confirm("Êtes-vous sûr de vouloir supprimer cette pièce justificative ?")) {
            return;
        }

        try {
            setLoading(true);

            // If the parent component provided an onDelete callback, use it
            if (onDelete) {
                await onDelete(id);
            } else {
                // Otherwise use the service directly
                await pieceJustificativeService.delete(id);
                toast({
                    title: "Succès",
                    description: "Pièce justificative supprimée avec succès",
                });
            }

            onUpdate();
        } catch (error) {
            console.error("Erreur lors de la suppression :", error);
            toast({
                title: "Erreur",
                description: "Une erreur est survenue lors de la suppression",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    // Fonction pour télécharger une pièce
    const handleDownload = (piece: PieceJustificative) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
        window.open(`${API_URL}${piece.fichierUrl}`, '_blank');
    };

    // Fonction pour ajouter une pièce
    const handleAddSuccess = (piece: PieceJustificative) => {
        setAddDialogOpen(false);
        onUpdate();
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Pièces justificatives</h3>
                <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
                    <DialogTrigger asChild>
                        <Button size="sm">
                            <Plus className="h-4 w-4 mr-2" />
                            Ajouter
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Ajouter une pièce justificative</DialogTitle>
                        </DialogHeader>
                        <PieceJustificativeForm
                            collaborateurId={collaborateurId}
                            onSuccess={handleAddSuccess}
                        />
                    </DialogContent>
                </Dialog>
            </div>

            {pieces.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-md">
                    <FileText className="h-12 w-12 mx-auto text-gray-400" />
                    <p className="mt-2 text-gray-500">Aucune pièce justificative</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {pieces.map((piece) => (
                        <Card key={piece.id}>
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                    <CardTitle className="text-base font-medium truncate">{piece.nom}</CardTitle>
                                    <Badge className={getTypeBadgeColor(piece.type)}>
                                        {getTypeLabel(piece.type)}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardFooter className="pt-2 flex justify-between">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDownload(piece)}
                                >
                                    <Download className="h-4 w-4 mr-2" />
                                    Télécharger
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    disabled={loading}
                                    onClick={() => piece.id && handleDelete(piece.id)}
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Supprimer
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}