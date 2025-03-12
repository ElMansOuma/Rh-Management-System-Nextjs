"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PieceJustificative, pieceJustificativeService } from "@/services/api";
import { toast } from "@/components/ui/use-toast";
import { FileText, Trash2, Download } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface PieceJustificativeListProps {
    collaborateurId: number;
    pieces: PieceJustificative[];
    onUpdate: () => void;
    onDelete: (id: number) => Promise<void>;
}

export function PieceJustificativeList({
                                           collaborateurId,
                                           pieces,
                                           onUpdate,
                                           onDelete
                                       }: PieceJustificativeListProps) {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedPieceId, setSelectedPieceId] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

    const handleDeleteClick = (id: number) => {
        setSelectedPieceId(id);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (selectedPieceId) {
            try {
                setLoading(true);
                await onDelete(selectedPieceId);
                setDeleteDialogOpen(false);
            } catch (error) {
                console.error("Error deleting document:", error);
                toast({
                    title: "Erreur",
                    description: "Une erreur est survenue lors de la suppression du document.",
                    variant: "destructive",
                });
            } finally {
                setLoading(false);
                setSelectedPieceId(null);
            }
        }
    };

    const handleDownload = (pieceUrl: string) => {
        // Format the URL correctly
        const downloadUrl = pieceUrl.startsWith("http")
            ? pieceUrl
            : `${API_URL}${pieceUrl}`;

        // Open in a new tab or trigger download
        window.open(downloadUrl, '_blank');
    };

    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead>Nom du fichier</TableHead>
                        <TableHead className="w-24">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {pieces.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={3} className="text-center py-4 italic text-gray-500">
                                Aucun document disponible
                            </TableCell>
                        </TableRow>
                    ) : (
                        pieces.map((piece) => (
                            <TableRow key={piece.id}>
                                <TableCell>{piece.type}</TableCell>
                                <TableCell>{piece.nom}</TableCell>
                                <TableCell>
                                    <div className="flex space-x-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleDownload(piece.fichierUrl)}
                                        >
                                            <Download className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="text-red-500 hover:text-red-700"
                                            onClick={() => handleDeleteClick(piece.id!)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>

            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirmation de suppression</AlertDialogTitle>
                        <AlertDialogDescription>
                            Êtes-vous sûr de vouloir supprimer ce document ? Cette action est irréversible.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={loading}>Annuler</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            disabled={loading}
                            className="bg-red-500 hover:bg-red-600"
                        >
                            {loading ? "Suppression..." : "Supprimer"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}