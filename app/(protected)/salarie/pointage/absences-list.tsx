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

// Types pour les données
type AbsenceStatus = "en_attente" | "approuve" | "refuse";

interface Absence {
    id: string;
    dateDebut: string;
    dateFin: string;
    typeAbsence: string;
    status: AbsenceStatus;
    commentaire?: string;
    dateCreation: string;
}

// Fonction pour mapper les types d'absence
function getTypeAbsenceLabel(type: string): string {
    const types: Record<string, string> = {
        conge_paye: "Congé payé",
        maladie: "Arrêt maladie",
        rtt: "RTT",
        sans_solde: "Congé sans solde",
        autre: "Autre",
    };
    return types[type] || type;
}

// Fonction pour déterminer le style de badge en fonction du statut
function getStatusBadgeVariant(status: AbsenceStatus): "default" | "success" | "destructive" | "outline" {
    switch (status) {
        case "approuve":
            return "success";
        case "refuse":
            return "destructive";
        case "en_attente":
        default:
            return "outline";
    }
}

// Fonction pour obtenir le libellé du statut
function getStatusLabel(status: AbsenceStatus): string {
    switch (status) {
        case "approuve":
            return "Approuvé";
        case "refuse":
            return "Refusé";
        case "en_attente":
        default:
            return "En attente";
    }
}

export default function AbsencesList() {
    const [absences, setAbsences] = useState<Absence[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAbsences();
    }, []);

    const fetchAbsences = async () => {
        try {
            // Appel API pour récupérer les demandes d'absence
            // À implémenter selon votre API
            // const response = await fetch('/api/absences');
            // const data = await response.json();
            // setAbsences(data);

            // Données simulées
            setAbsences([
                {
                    id: "abs-001",
                    dateDebut: "2025-03-15",
                    dateFin: "2025-03-20",
                    typeAbsence: "conge_paye",
                    status: "approuve",
                    commentaire: "Vacances en famille",
                    dateCreation: "2025-02-20",
                },
                {
                    id: "abs-002",
                    dateDebut: "2025-04-10",
                    dateFin: "2025-04-11",
                    typeAbsence: "rtt",
                    status: "en_attente",
                    dateCreation: "2025-03-20",
                },
                {
                    id: "abs-003",
                    dateDebut: "2025-02-01",
                    dateFin: "2025-02-03",
                    typeAbsence: "maladie",
                    status: "refuse",
                    commentaire: "Pas de justificatif fourni",
                    dateCreation: "2025-01-28",
                },
            ]);
        } catch (error) {
            console.error("Erreur lors du chargement des absences", error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        return format(new Date(dateString), "dd MMM yyyy", { locale: fr });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Mes demandes d{"'"}absence</CardTitle>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="flex justify-center py-6">Chargement...</div>
                ) : absences.length === 0 ? (
                    <div className="text-center py-6 text-gray-500">
                        Aucune demande d{"'"}absence trouvée
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Période</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Statut</TableHead>
                                <TableHead>Date de demande</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {absences.map((absence) => (
                                <TableRow key={absence.id}>
                                    <TableCell>
                                        {formatDate(absence.dateDebut)} - {formatDate(absence.dateFin)}
                                    </TableCell>
                                    <TableCell>{getTypeAbsenceLabel(absence.typeAbsence)}</TableCell>
                                    <TableCell>
                                        <Badge variant={getStatusBadgeVariant(absence.status)}>
                                            {getStatusLabel(absence.status)}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{formatDate(absence.dateCreation)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    );
}