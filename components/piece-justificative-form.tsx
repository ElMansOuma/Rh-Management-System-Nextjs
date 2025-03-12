"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PieceJustificative, pieceJustificativeService } from "@/services/api";
import { toast } from "@/components/ui/use-toast";
import { FileCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PieceJustificativeFormProps {
    collaborateurId: number;
    onSuccess?: () => void;
}

export function PieceJustificativeForm({ collaborateurId, onSuccess }: PieceJustificativeFormProps) {
    const [documentType, setDocumentType] = useState<string>("CIN");
    const [loading, setLoading] = useState<boolean>(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<boolean>(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedFile(!!e.target.files && e.target.files.length > 0);
    };

    const handleDocumentTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setDocumentType(e.target.value);
    };

    const handlePieceUpload = async () => {
        // Verify collaborateur ID is valid
        if (!collaborateurId) {
            toast({
                title: "Information",
                description: "Veuillez d'abord enregistrer les informations du collaborateur.",
                variant: "default",
            });
            return;
        }

        const file = fileInputRef.current?.files?.[0];

        if (!documentType || !file) {
            toast({
                title: "Information",
                description: "Veuillez sélectionner un type de document et un fichier.",
                variant: "default",
            });
            return;
        }

        try {
            setLoading(true);
            await pieceJustificativeService.upload(collaborateurId, documentType, file);
            toast({
                title: "Succès",
                description: "Document ajouté avec succès",
            });

            // Reset form fields after successful upload
            setDocumentType("CIN");
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
                setSelectedFile(false);
            }

            // Call the onSuccess callback to refresh the list
            if (onSuccess) {
                onSuccess();
            }
        } catch (error) {
            console.error("Error uploading document:", error);
            toast({
                title: "Erreur",
                description: "Une erreur est survenue lors de l'upload du document.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="bg-gray-50">
            <CardHeader>
                <CardTitle>Ajouter un document</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="documentType">Type de document</Label>
                        <select
                            id="documentType"
                            className="w-full border border-gray-300 rounded-md p-2"
                            value={documentType}
                            onChange={handleDocumentTypeChange}
                        >
                            <option value="CIN">CIN</option>
                            <option value="DIPLOME">Diplôme</option>
                            <option value="AUTRE">Autre</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="documentFile">Fichier</Label>
                        <Input
                            id="documentFile"
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                        />
                    </div>
                </div>

                <Button
                    className="mt-4"
                    onClick={handlePieceUpload}
                    disabled={loading || !documentType || !selectedFile || !collaborateurId}
                >
                    <FileCheck className="mr-2 h-4 w-4" />
                    {loading ? "En cours d'upload..." : "Ajouter le document"}
                </Button>
            </CardContent>
        </Card>
    );
}