"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { FileUpload } from "../PieceJustificative/FileUpload";
import { fetchWithAuth } from "../../../../services/auth"; // Import fetchWithAuth to ensure proper authentication

interface PieceJustificativeData {
    id?: number;
    nom: string;
    type: string;
    description: string;
    collaborateurId: number;
    statut?: string;
    dateCreation?: string;
    fichierNom?: string;
    fichierPath?: string;
}

interface PieceJustificativeFormProps {
    collaborateurId: number;
    onSuccess: () => void;
    onCancel?: () => void; // Make onCancel optional
    initialData?: PieceJustificativeData;
}

export function PieceJustificativeForm({
                                           collaborateurId,
                                           onSuccess,
                                           onCancel,
                                           initialData
                                       }: PieceJustificativeFormProps) {
    const [formData, setFormData] = useState<PieceJustificativeData>({
        nom: "",
        type: "",
        description: "",
        collaborateurId: collaborateurId,
        statut: "EN_ATTENTE"
    });

    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [fileError, setFileError] = useState<string | null>(null);

    // API URL from environment or default
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
                collaborateurId: collaborateurId
            });
        }
    }, [initialData, collaborateurId]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { id, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [id]: value
        }));
    };

    const handleFileChange = (selectedFile: File) => {
        setFileError(null);
        // Optional: Validate file size or type
        if (selectedFile.size > 10 * 1024 * 1024) {
            setFileError("Le fichier est trop volumineux (max 10MB)");
            return;
        }
        setFile(selectedFile);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (!initialData && !file) {
                setFileError("Veuillez sélectionner un fichier");
                setLoading(false);
                return;
            }

            const apiFormData = new FormData();

            // Add direct fields to FormData instead of using a JSON blob
            apiFormData.append('nom', formData.nom);
            apiFormData.append('type', formData.type);
            apiFormData.append('description', formData.description);
            apiFormData.append('collaborateurId', collaborateurId.toString());
            apiFormData.append('statut', formData.statut || "EN_ATTENTE");

            // Add ID if it's an update
            if (initialData?.id) {
                apiFormData.append('id', initialData.id.toString());
            }

            // Add the file if it exists
            if (file) {
                apiFormData.append('file', file);
            }

            // Determine if this is a create or update operation
            const isUpdate = !!initialData?.id;

            // Use the direct backend API URL instead of API routes
            const url = isUpdate
                ? `${API_URL}/api/pieces-justificatives/${initialData.id}`
                : `${API_URL}/api/pieces-justificatives`;

            console.log(`Envoi à ${url}`, {
                isUpdate,
                formDataKeys: Array.from(apiFormData.keys())
            });

            // Use fetchWithAuth to ensure the token is included
            const response = await fetchWithAuth(url, {
                method: isUpdate ? 'PUT' : 'POST',
                body: apiFormData,
                // Don't set Content-Type header for FormData, browser sets it automatically with boundary
            });

            if (!response.ok) {
                let errorMessage;
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.error || `Erreur ${response.status}: ${response.statusText}`;
                } catch (e) {
                    errorMessage = `Erreur ${response.status}: ${response.statusText}`;
                }
                throw new Error(errorMessage);
            }

            toast({
                title: "Succès",
                description: isUpdate
                    ? "Document mis à jour avec succès"
                    : "Document ajouté avec succès",
            });

            onSuccess();
        } catch (error) {
            console.error("Error:", error);
            toast({
                title: "Erreur",
                description: error instanceof Error ? error.message : "Une erreur est survenue",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader className="bg-white border-b">
                <CardTitle>
                    {initialData?.id ? "Modifier le document" : "Ajouter un document"}
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="nom">Nom du document</Label>
                            <Input
                                id="nom"
                                value={formData.nom}
                                onChange={handleChange}
                                placeholder="Contrat de travail, CV, etc."
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="type">Type de document</Label>
                            <select
                                id="type"
                                value={formData.type}
                                onChange={handleChange}
                                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            >
                                <option value="">Sélectionner un type</option>
                                <option value="CONTRAT">Contrat</option>
                                <option value="CV">CV</option>
                                <option value="DIPLOME">Diplôme</option>
                                <option value="PIECE_IDENTITE">Pièce d{"'"}identité</option>
                                <option value="CERTIFICAT">Certificat</option>
                                <option value="AUTRE">Autre</option>
                            </select>
                        </div>

                        <div>
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Description du document..."
                                rows={3}
                            />
                        </div>

                        <div>
                            <Label htmlFor="file">Fichier {!initialData && <span className="text-red-500">*</span>}</Label>
                            <div className="mt-1">
                                <FileUpload
                                    onFileSelected={handleFileChange}
                                    selectedFile={file}
                                    disabled={loading}
                                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                />
                                {fileError && <p className="text-red-500 text-sm mt-1">{fileError}</p>}
                                {initialData?.fichierNom && !file && (
                                    <p className="text-sm text-gray-500 mt-1">
                                        Fichier actuel: {initialData.fichierNom}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onCancel || (() => onSuccess())}
                            disabled={loading}
                        >
                            Annuler
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            {loading ? "Envoi en cours..." : initialData?.id ? "Mettre à jour" : "Enregistrer"}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}