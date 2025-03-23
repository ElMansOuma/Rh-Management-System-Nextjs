"use client";

import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, ExternalLink } from "lucide-react";
import { pieceJustificativeService } from "@/services/api";

// Define the interface for the document object
interface Document {
    cheminFichier: string;
    nomFichier?: string;
    nom: string;
    description?: string;
}

// Define the props interface for the component
interface DocumentPreviewProps {
    document: Document | null;
    isOpen: boolean;
    onClose: () => void;
}

export function DocumentPreview({ document, isOpen, onClose }: DocumentPreviewProps) {
    const [loading, setLoading] = useState(true);

    if (!document) return null;

    const fileUrl = pieceJustificativeService.getDownloadUrl(document.cheminFichier);
    const fileExtension = document.nomFichier?.split('.').pop()?.toLowerCase() || '';

    const isImage = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg'].includes(fileExtension);
    const isPdf = fileExtension === 'pdf';

    const handleDownload = () => {
        window.open(fileUrl, '_blank');
    };

    return (
        <Dialog open={isOpen} onOpenChange={() => onClose()}>
            <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>{document.nom}</DialogTitle>
                    <DialogDescription>
                        {document.description || `${document.nomFichier || document.cheminFichier.split('/').pop()}`}
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-hidden relative">
                    {loading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-100/40">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                        </div>
                    )}

                    {isImage ? (
                        <img
                            src={fileUrl}
                            alt={document.nom}
                            className="max-w-full max-h-full object-contain mx-auto"
                            onLoad={() => setLoading(false)}
                            onError={() => setLoading(false)}
                        />
                    ) : isPdf ? (
                        <iframe
                            src={`${fileUrl}#view=FitH`}
                            className="w-full h-full border-0"
                            onLoad={() => setLoading(false)}
                        ></iframe>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full">
                            <div className="p-6 border rounded-lg bg-gray-50 text-center">
                                <p className="text-lg font-medium mb-2">Ce type de fichier ne peut pas être prévisualisé</p>
                                <p className="text-sm text-gray-500 mb-4">Vous pouvez télécharger le fichier pour le visualiser.</p>
                                <Button onClick={handleDownload}>
                                    <Download className="h-4 w-4 mr-2" />
                                    Télécharger le fichier
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex justify-end space-x-2 mt-4">
                    <Button variant="outline" onClick={() => onClose()}>
                        Fermer
                    </Button>
                    <Button onClick={handleDownload} className="flex items-center">
                        <Download className="h-4 w-4 mr-2" />
                        Télécharger
                    </Button>
                    <Button variant="outline" onClick={() => window.open(fileUrl, '_blank')} className="flex items-center">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Ouvrir dans un nouvel onglet
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}