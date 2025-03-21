"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";import { pieceJustificativeService, PieceJustificative, documentTypeMap } from "@/services/api";
import { toast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, FileUp, FileText, Trash2, Download } from "lucide-react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import {PieceJustificativeForm} from "@/app/(protected)/Admin/PieceJustificative/piece-justificative-form";

export default function PieceJustificativePage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const collaborateurId = parseInt(params.id);
    const [documents, setDocuments] = useState<PieceJustificative[]>([]);
    const [loading, setLoading] = useState(true);
    const [collaborateur, setCollaborateur] = useState<any>(null);

    // Fonction pour charger les documents
    const loadDocuments = async () => {
        try {
            setLoading(true);
            const docs = await pieceJustificativeService.getAllByCollaborateur(collaborateurId);
            setDocuments(docs);
        } catch (error) {
            console.error("Erreur lors du chargement des documents:", error);
            toast({
                title: "Erreur",
                description: "Impossible de charger les documents",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    // Charger les informations du collaborateur et ses documents
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Charger les infos du collaborateur
                const response = await fetch(`/api/collaborateurs/${collaborateurId}`);
                if (response.ok) {
                    const data = await response.json();
                    setCollaborateur(data);
                }

                // Charger les documents
                await loadDocuments();
            } catch (error) {
                console.error("Erreur lors du chargement des données:", error);
            }
        };

        if (collaborateurId) {
            fetchData();
        }
    }, [collaborateurId]);

    const handleDeleteDocument = async (id: number) => {
        try {
            await pieceJustificativeService.delete(id);
            toast({
                title: "Succès",
                description: "Document supprimé avec succès",
                variant: "default",
            });
            loadDocuments(); // Recharger la liste
        } catch (error) {
            toast({
                title: "Erreur",
                description: "Impossible de supprimer le documents",
                variant: "destructive",
            });
        }
    };

    const handleDownload = (url: string, filename: string) => {
        // Créer un lien temporaire pour le téléchargement
        const link = document.createElement("a");
        link.href = url;
        link.target = "_blank";
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* Fil d'Ariane */}
            <Breadcrumb className="mb-6">
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/collaborateurs">Collaborateurs</BreadcrumbLink>
                    </BreadcrumbItem>


                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink>Pièces justificatives</BreadcrumbLink>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">
                    Pièces justificatives
                    {collaborateur && (
                        <span className="text-lg font-normal text-gray-500 ml-2">
              - {collaborateur.nom} {collaborateur.prenom}
            </span>
                    )}
                </h1>
                <Button variant="outline" onClick={() => router.back()} className="gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Retour
                </Button>
            </div>

            {/* Formulaire d'ajout */}
            <PieceJustificativeForm
                collaborateurId={collaborateurId}
                onSuccess={loadDocuments}
            />

            {/* Liste des documents */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <FileText className="mr-2 h-5 w-5" />
                        Documents disponibles
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="text-center py-8">Chargement des documents...</div>
                    ) : documents.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            Aucun document disponible pour ce collaborateur
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Nom</TableHead>
                                    <TableHead className="w-24">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {documents.map((document) => (
                                    <TableRow key={document.id}>
                                        <TableCell>
                                            {documentTypeMap[document.type] || document.type}
                                        </TableCell>
                                        <TableCell>{document.nom}</TableCell>
                                        <TableCell>
                                            <div className="flex space-x-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleDownload(document.fichierUrl, document.nom)}
                                                    title="Télécharger"
                                                >
                                                    <Download className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() => document.id && handleDeleteDocument(document.id)}
                                                    title="Supprimer"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}