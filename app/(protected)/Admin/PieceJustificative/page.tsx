"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PieceJustificativeList } from './Piece-Justificative-List';
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";

// Define the possible status values as a type
export type DocumentStatus = "EN_ATTENTE" | "VALIDE" | "REJETE" | null;

// Assurez-vous que cette interface correspond exactement à celle définie dans le composant PieceJustificativeList
// Il est préférable d'importer cette interface directement depuis le fichier du composant
interface PieceJustificativeListProps {
    isAdminView: boolean;
    statusFilter?: DocumentStatus;
    collaborateurId?: number;
}

export default function PieceJustificativePage() {
    // Update the state type to match our DocumentStatus type
    const [statusFilter, setStatusFilter] = useState<DocumentStatus>(null);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Gestion des documents</h1>

            <Tabs defaultValue="all" className="w-full">
                <TabsList className="mb-4">
                    <TabsTrigger value="all" onClick={() => setStatusFilter(null)}>
                        Tous les documents
                    </TabsTrigger>
                    <TabsTrigger value="pending" onClick={() => setStatusFilter("EN_ATTENTE")}>
                        En attente
                    </TabsTrigger>
                    <TabsTrigger value="validated" onClick={() => setStatusFilter("VALIDE")}>
                        Validés
                    </TabsTrigger>
                    <TabsTrigger value="rejected" onClick={() => setStatusFilter("REJETE")}>
                        Rejetés
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="all">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Tous les documents justificatifs</CardTitle>
                                <CardDescription>
                                    Visualisez et gérez tous les documents justificatifs des collaborateurs
                                </CardDescription>
                            </div>
                            {statusFilter && (
                                <Button
                                    variant="outline"
                                    onClick={() => setStatusFilter(null)}
                                    className="flex items-center gap-2"
                                >
                                    <Filter className="h-4 w-4" />
                                    Effacer le filtre
                                </Button>
                            )}
                        </CardHeader>
                        <CardContent>
                            <PieceJustificativeList
                                isAdminView={true}
                                statusFilter={statusFilter}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="pending">
                    <Card>
                        <CardHeader>
                            <CardTitle>Documents en attente</CardTitle>
                            <CardDescription>
                                Documents nécessitant une validation
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <PieceJustificativeList
                                isAdminView={true}
                                statusFilter="EN_ATTENTE"
                            />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="validated">
                    <Card>
                        <CardHeader>
                            <CardTitle>Documents validés</CardTitle>
                            <CardDescription>
                                Documents qui ont été validés
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <PieceJustificativeList
                                isAdminView={true}
                                statusFilter="VALIDE"
                            />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="rejected">
                    <Card>
                        <CardHeader>
                            <CardTitle>Documents rejetés</CardTitle>
                            <CardDescription>
                                Documents qui ont été rejetés
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <PieceJustificativeList
                                isAdminView={true}
                                statusFilter="REJETE"
                            />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}