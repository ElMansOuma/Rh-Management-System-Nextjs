"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, FileText, Download, Trash2, CheckCircle, XCircle, Clock, Eye } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { pieceJustificativeService, documentTypeMap } from "@/services/api";
import { PieceJustificativeForm } from './piece-justificative-form';
import { DocumentPreview } from './document-preview';

// Define the DocumentStatus type here so it's available in this component
export type DocumentStatus = "EN_ATTENTE" | "VALIDE" | "REJETE" | null;

interface PieceJustificativeListProps {
    collaborateurId?: number;
    isAdminView?: boolean;
    statusFilter?: DocumentStatus; // Add this prop to the interface
}

export function PieceJustificativeList({ collaborateurId, isAdminView = false, statusFilter = null }: PieceJustificativeListProps) {
    const [documents, setDocuments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [openDialogId, setOpenDialogId] = useState<number | null>(null);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState<any>(null);
    const [previewDocument, setPreviewDocument] = useState<any>(null);

    // Charger les documents au chargement du composant ou lorsque le filtre change
    useEffect(() => {
        loadDocuments();
    }, [collaborateurId, statusFilter]); // Add statusFilter as a dependency

    const loadDocuments = async () => {
        try {
            setLoading(true);
            let data;

            if (collaborateurId) {
                data = await pieceJustificativeService.getByCollaborateurId(collaborateurId);
            } else {
                data = await pieceJustificativeService.getAll();
            }

            // Filter the documents based on statusFilter if it's provided
            if (statusFilter) {
                data = data.filter((doc: any) => doc.statut === statusFilter);
            }

            setDocuments(data);
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

    const handleStatusChange = async (id: number, status: string) => {
        try {
            await pieceJustificativeService.updateStatut(id, status);
            toast({
                title: "Succès",
                description: "Statut mis à jour avec succès",
            });
            loadDocuments();
        } catch (error) {
            console.error("Erreur lors de la mise à jour du statut:", error);
            toast({
                title: "Erreur",
                description: "Impossible de mettre à jour le statut",
                variant: "destructive",
            });
        }
    };

    const handleDownload = (fileName: string) => {
        const downloadUrl = pieceJustificativeService.getDownloadUrl(fileName);
        window.open(downloadUrl, '_blank');
    };

    const handleDelete = async (id: number) => {
        try {
            await pieceJustificativeService.delete(id);
            setDeleteId(null);
            toast({
                title: "Succès",
                description: "Document supprimé avec succès",
            });
            loadDocuments();
        } catch (error) {
            console.error("Erreur lors de la suppression:", error);
            toast({
                title: "Erreur",
                description: "Impossible de supprimer le document",
                variant: "destructive",
            });
        }
    };

    const handleDocumentAdded = () => {
        setShowAddForm(false);
        setSelectedDocument(null);
        loadDocuments();
    };

    const handleEditDocument = (document: any) => {
        setSelectedDocument(document);
        setShowAddForm(true);
    };

    const handlePreviewDocument = (document: any) => {
        setPreviewDocument(document);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'VALIDE':
            case 'Validée':
                return <Badge className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" /> Validé</Badge>;
            case 'REJETE':
            case 'Rejetée':
                return <Badge className="bg-red-500"><XCircle className="h-3 w-3 mr-1" /> Rejeté</Badge>;
            default:
                return <Badge className="bg-yellow-500"><Clock className="h-3 w-3 mr-1" /> En attente</Badge>;
        }
    };

    // Détermine si un fichier peut être prévisualisé
    const canPreview = (fileName: string) => {
        if (!fileName) return false;
        const extension = fileName.split('.').pop()?.toLowerCase();
        return ['pdf', 'jpg', 'jpeg', 'png', 'gif', 'bmp'].includes(extension || '');
    };

    return (
        <Card className="w-full">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Documents justificatifs</CardTitle>
                {collaborateurId && (
                    <Button onClick={() => {
                        setSelectedDocument(null);
                        setShowAddForm(true);
                    }}>
                        Ajouter un document
                    </Button>
                )}
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="flex justify-center p-8">
                        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                    </div>
                ) : documents.length === 0 ? (
                    <div className="text-center p-8 text-gray-500">
                        Aucun document disponible
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nom</TableHead>
                                    <TableHead>Type</TableHead>
                                    {!collaborateurId && <TableHead>Collaborateur</TableHead>}
                                    <TableHead>Date d{"'"}ajout</TableHead>
                                    <TableHead>Statut</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {documents.map((doc) => (
                                    <TableRow key={doc.id}>
                                        <TableCell className="font-medium">
                                            <div className="flex items-center">
                                                <FileText className="h-4 w-4 mr-2 text-blue-500" />
                                                {doc.nom}
                                            </div>
                                        </TableCell>
                                        <TableCell>{documentTypeMap[doc.type] || doc.type}</TableCell>
                                        {!collaborateurId && (
                                            <TableCell>
                                                {doc.collaborateurNom} {doc.collaborateurPrenom}
                                            </TableCell>
                                        )}
                                        <TableCell>
                                            {new Date(doc.dateCreation).toLocaleDateString('fr-FR')}
                                        </TableCell>
                                        <TableCell>{getStatusBadge(doc.statut)}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                {canPreview(doc.nomFichier || doc.cheminFichier) && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handlePreviewDocument(doc)}
                                                        title="Prévisualiser"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                )}

                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleDownload(doc.cheminFichier)}
                                                    title="Télécharger"
                                                >
                                                    <Download className="h-4 w-4" />
                                                </Button>

                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleEditDocument(doc)}
                                                    title="Modifier"
                                                >
                                                    <FileText className="h-4 w-4" />
                                                </Button>

                                                {isAdminView && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => setOpenDialogId(doc.id)}
                                                        title="Changer le statut"
                                                    >
                                                        <CheckCircle className="h-4 w-4" />
                                                    </Button>
                                                )}

                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setDeleteId(doc.id)}
                                                    className="text-red-500 hover:bg-red-50"
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
                    </div>
                )}
            </CardContent>

            {/* Dialog for status update */}
            <Dialog open={openDialogId !== null} onOpenChange={(open) => !open && setOpenDialogId(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Mettre à jour le statut</DialogTitle>
                        <DialogDescription>
                            Choisissez un statut pour ce document
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="flex flex-col gap-2">
                            <Button
                                className="flex items-center gap-2"
                                onClick={() => {
                                    if (openDialogId) handleStatusChange(openDialogId, 'VALIDE');
                                    setOpenDialogId(null);
                                }}
                            >
                                <CheckCircle className="h-4 w-4" /> Valider
                            </Button>

                            <Button
                                variant="outline"
                                className="flex items-center gap-2 text-red-500"
                                onClick={() => {
                                    if (openDialogId) handleStatusChange(openDialogId, 'REJETE');
                                    setOpenDialogId(null);
                                }}
                            >
                                <XCircle className="h-4 w-4" /> Rejeter
                            </Button>

                            <Button
                                variant="outline"
                                className="flex items-center gap-2 text-yellow-500"
                                onClick={() => {
                                    if (openDialogId) handleStatusChange(openDialogId, 'EN_ATTENTE');
                                    setOpenDialogId(null);
                                }}
                            >
                                <Clock className="h-4 w-4" /> Mettre en attente
                            </Button>
                        </div>
                    </div>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="secondary">Annuler</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Dialog for delete confirmation */}
            <Dialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirmer la suppression</DialogTitle>
                        <DialogDescription>
                            Êtes-vous sûr de vouloir supprimer ce document ? Cette action est irréversible.
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setDeleteId(null)}
                        >
                            Annuler
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => deleteId && handleDelete(deleteId)}
                        >
                            Supprimer
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Dialog for adding new document */}
            <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>
                            {selectedDocument ? "Modifier le document" : "Ajouter un document"}
                        </DialogTitle>
                        <DialogDescription>
                            {selectedDocument
                                ? "Modifiez les informations du document"
                                : "Ajoutez un nouveau document justificatif pour ce collaborateur"}
                        </DialogDescription>
                    </DialogHeader>

                    {collaborateurId && (
                        <PieceJustificativeForm
                            collaborateurId={collaborateurId}
                            onSuccess={handleDocumentAdded}
                            onCancel={() => {
                                setShowAddForm(false);
                                setSelectedDocument(null);
                            }}
                            initialData={selectedDocument ? {
                                id: selectedDocument.id,
                                nom: selectedDocument.nom,
                                type: selectedDocument.type,
                                description: selectedDocument.description || "",
                                collaborateurId: collaborateurId,
                                statut: selectedDocument.statut,
                                fichierNom: selectedDocument.nomFichier,
                                fichierPath: selectedDocument.cheminFichier
                            } : undefined}
                        />
                    )}
                </DialogContent>
            </Dialog>

            {/* Document Preview Modal */}
            <DocumentPreview
                document={previewDocument}
                isOpen={previewDocument !== null}
                onClose={() => setPreviewDocument(null)}
            />
        </Card>
    );
}