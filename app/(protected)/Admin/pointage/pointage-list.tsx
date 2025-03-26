"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Types pour les données de pointage
interface Pointage {
    id: string;
    collaborateurId: string;
    collaborateurNom: string;
    type: "arrivee" | "depart";
    timestamp: string;
    status: "valide" | "en_retard" | "anomalie";
}

export default function AdminPointageList() {
    const [pointages, setPointages] = useState<Pointage[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPointages();
    }, []);

    const fetchPointages = async () => {
        try {
            // Appel API pour récupérer les pointages
            // À implémenter selon votre API
            // const response = await fetch('/api/admin/pointages');
            // const data = await response.json();
            // setPointages(data);

            // Données simulées
            setPointages([
                {
                    id: "point-001",
                    collaborateurId: "collab-123",
                    collaborateurNom: "Jean Dupont",
                    type: "arrivee",
                    timestamp: new Date(2025, 2, 15, 8, 5).toISOString(),
                    status: "en_retard",
                },
                {
                    id: "point-002",
                    collaborateurId: "collab-456",
                    collaborateurNom: "Marie Dubois",
                    type: "depart",
                    timestamp: new Date(2025, 2, 15, 17, 30).toISOString(),
                    status: "valide",
                },
                {
                    id: "point-003",
                    collaborateurId: "collab-789",
                    collaborateurNom: "Pierre Martin",
                    type: "arrivee",
                    timestamp: new Date(2025, 2, 15, 9, 15).toISOString(),
                    status: "anomalie",
                },
            ]);
        } catch (error) {
            console.error("Erreur lors du chargement des pointages", error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        return format(new Date(dateString), "dd MMM yyyy HH:mm", { locale: fr });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "valide":
                return <Badge variant="default">Validé</Badge>;
            case "en_retard":
                return <Badge variant="secondary">En retard</Badge>;
            case "anomalie":
                return <Badge variant="destructive">Anomalie</Badge>;
            default:
                return <Badge variant="outline">Non défini</Badge>;
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Suivi des pointages</CardTitle>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="flex justify-center py-6">Chargement...</div>
                ) : pointages.length === 0 ? (
                    <div className="text-center py-6 text-gray-500">
                        Aucun pointage trouvé
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Collaborateur</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Date et Heure</TableHead>
                                <TableHead>Statut</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {pointages.map((pointage) => (
                                <TableRow key={pointage.id}>
                                    <TableCell>{pointage.collaborateurNom}</TableCell>
                                    <TableCell>
                                        {pointage.type === "arrivee" ? "Arrivée" : "Départ"}
                                    </TableCell>
                                    <TableCell>{formatDate(pointage.timestamp)}</TableCell>
                                    <TableCell>{getStatusBadge(pointage.status)}</TableCell>
                                    <TableCell>
                                        <Button variant="outline" size="sm">
                                            Détails
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    );
}