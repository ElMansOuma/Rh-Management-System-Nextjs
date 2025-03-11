"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PieceJustificative, pieceJustificativeService } from "@/services/api";
import { toast } from "@/components/ui/use-toast";
import { FileCheck } from "lucide-react";

interface PieceJustificativeFormProps {
    collaborateurId: number;
    onSuccess?: (piece: PieceJustificative) => void;
}

export function PieceJustificativeForm({ collaborateurId, onSuccess }: PieceJustificativeFormProps) {
    const [file, setFile] = useState<File | null>(null);
    const [type, setType] = useState<string>("CIN");
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!file) {
            toast({
                title: "Erreur",
                description: "Veuillez sélectionner un fichier",
                variant: "destructive",
            });
            return;
        }

        try {
            setLoading(true);
            const piece = await pieceJustificativeService.upload(collaborateurId, type, file);
            setFile(null);
            toast({
                title: "Succès",
                description: "La pièce justificative a été ajoutée avec succès",
            });
            if (onSuccess) {
                onSuccess(piece);
            }
        } catch (error) {
            console.error("Erreur lors de l'upload :", error);
            toast({
                title: "Erreur",
                description: "Une erreur est survenue lors de l'ajout de la pièce justificative",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="pieceType">Type de pièce</Label>
                <select
                    id="pieceType"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-2"
                    required
                >
                    <option value="CIN">CIN</option>
                    <option value="DIPLOME">Diplôme</option>
                    <option value="AUTRE">Autre</option>
                </select>
            </div>

            <div className="space-y-2">
                <Label htmlFor="pieceFile">Fichier</Label>
                <Input
                    id="pieceFile"
                    type="file"
                    onChange={handleFileChange}
                    className="cursor-pointer"
                    required
                />
            </div>

            <Button type="submit" disabled={loading} className="w-full">
                <FileCheck className="mr-2 h-4 w-4" />
                {loading ? "Chargement..." : "Ajouter le document"}
            </Button>
        </form>
    );
}