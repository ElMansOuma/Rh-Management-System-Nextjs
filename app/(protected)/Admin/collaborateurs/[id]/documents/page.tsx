"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { toast } from "@/hooks/use-toast";
import { collaborateurService } from "@/services/api";
import { PieceJustificativeList } from '../../../PieceJustificative/Piece-Justificative-List';
import Link from 'next/link';

export default function CollaborateurDocumentsPage() {
    const params = useParams();
    const collaborateurId = parseInt(params.id as string);

    const [collaborateur, setCollaborateur] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadCollaborateur = async () => {
            try {
                setLoading(true);
                const data = await collaborateurService.getById(collaborateurId);
                setCollaborateur(data);
            } catch (error) {
                console.error("Erreur lors du chargement du collaborateur:", error);
                toast({
                    title: "Erreur",
                    description: "Impossible de charger les informations du collaborateur",
                    variant: "destructive",
                });
            } finally {
                setLoading(false);
            }
        };

        if (collaborateurId && !isNaN(collaborateurId)) {
            loadCollaborateur();
        }
    }, [collaborateurId]);

    return (
        <div className="container mx-auto p-4">
            <Breadcrumb className="mb-6">
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/Admin/dashboard">Tableau de bord</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/Admin/collaborateurs">Collaborateurs</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink href={`/Admin/collaborateurs/${collaborateurId}`}>
                            {loading ? "Chargement..." : `${collaborateur?.prenom} ${collaborateur?.nom}`}
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink>Documents</BreadcrumbLink>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold">
                    Documents {collaborateur ? `de ${collaborateur.prenom} ${collaborateur.nom}` : ""}
                </h1>

                <Link href={`/Admin/collaborateurs/${collaborateurId}`}>
                    <Button variant="outline" className="flex items-center gap-2">
                        <ArrowLeft className="h-4 w-4" /> Retour
                    </Button>
                </Link>
            </div>

            {loading ? (
                <Card>
                    <CardContent className="p-8 flex justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                    </CardContent>
                </Card>
            ) : (
                <Card>
                    <CardHeader>
                        <CardTitle>Documents justificatifs</CardTitle>
                        <CardDescription>
                            Gérez les documents justificatifs de {collaborateur?.prenom} {collaborateur?.nom}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <PieceJustificativeList
                            collaborateurId={collaborateurId}
                            isAdminView={true}
                        />
                    </CardContent>
                </Card>
            )}
        </div>
    );
}