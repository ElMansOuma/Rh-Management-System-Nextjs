"use client";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { pieceJustificativeService, documentTypeMap } from "@/services/api";
import { toast } from "@/components/ui/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, FileUp } from "lucide-react";

interface PieceJustificativeFormProps {
    collaborateurId: number;
    onSuccess: () => void;
}

export function PieceJustificativeForm({ collaborateurId, onSuccess }: PieceJustificativeFormProps) {
    const [documentType, setDocumentType] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setError("");
        }
    };

    const handleDocumentTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setDocumentType(e.target.value);
        setError("");
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");

        const file = fileInputRef.current?.files?.[0];

        // Validation
        if (!collaborateurId) {
            setError("ID du collaborateur manquant");
            return;
        }

        if (!file) {
            setError("Veuillez sélectionner un fichier");
            return;
        }

        if (!documentType) {
            setError("Veuillez sélectionner un type de documents");
            return;
        }

        try {
            setLoading(true);
            console.log("Uploading documents:", {
                collaborateurId,
                documentType,
                fileName: file.name
            });

            await pieceJustificativeService.upload(collaborateurId, documentType, file);

            toast({
                title: "Succès",
                description: "Document ajouté avec succès",
                variant: "default",
            });

            // Reset form
            setDocumentType("");
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }

            // Call onSuccess callback to reload documents
            if (typeof onSuccess === 'function') {
                onSuccess();
            }
        } catch (err) {
            console.error("Error uploading documents:", err);
            setError("Impossible d'ajouter le documents. Veuillez réessayer.");
            toast({
                title: "Erreur",
                description: "Impossible d'ajouter le documents",
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
                <form onSubmit={handleSubmit}>
                    {error && (
                        <Alert variant="destructive" className="mb-4">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="space-y-2">
                            <Label htmlFor="documentType">Type de document</Label>
                            <select
                                id="documentType"
                                className="w-full border border-gray-300 rounded-md p-2"
                                value={documentType}
                                onChange={handleDocumentTypeChange}
                            >
                                <option value="">Sélectionner un type</option>
                                {Object.entries(documentTypeMap).map(([value, label]) => (
                                    <option key={value} value={value}>
                                        {label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="fileInput">Fichier</Label>
                            <Input
                                id="fileInput"
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                            />
                        </div>
                    </div>

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full"
                        onClick={(e) => {
                            // Ce click handler est un backup au cas où le form onSubmit ne se déclenche pas
                            if (!loading) {
                                handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
                            }
                        }}
                    >
                        <FileUp className="mr-2 h-4 w-4" />
                        {loading ? "En cours d'upload..." : "Ajouter le documents"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}