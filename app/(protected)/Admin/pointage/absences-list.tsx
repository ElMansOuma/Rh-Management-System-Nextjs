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

type AbsenceStatus = "en_attente" | "approuve" | "refuse";
type AbsenceType = "conge_paye" | "maladie" | "rtt" | "sans_solde" | "autre";

interface Absence {
    id: string;
    collaborateurId: string;
    collaborateurNom: string;
    dateDebut: string;
    dateFin: string;
    typeAbsence: AbsenceType;
    status: AbsenceStatus;
    commentaire?: string;
    dateCreation: string;
}

export default function AdminAbsencesList() {
    const [absences, setAbsences] = useState<Absence[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAbsences();
    }, []);

    const fetchAbsences = async () => {
        try {
            // Appel API pour récupérer les demandes d'absence
            // À implémenter selon votre API
            // const response = await fetch('/api/admin/absences');
            // const data = await response.json();
            // setAbsences(data);

            // Données simulées
            setAbsences([
                {
                    id: "abs-001",
                    collaborateurId: "collab-123",
                    collaborateurNom: "Jean Dupont",
                    dateDebut: "2025-03-15",
                    dateFin: "2025-03-20",
                    typeAbsence: "conge_paye",
                    status: "approuve",
                    commentaire: "Vacances en famille",
                    dateCreation: "2025-02-20",
                },
                {
                    id: "abs-002",
                    collaborateurId: "collab-456",
                    collaborateurNom: "Marie Dubois",
                    dateDebut: "2025-04-10",
                    dateFin: "2025-04-11",
                    typeAbsence: "rtt",
                    status: "en_attente",
                    dateCreation: "2025-03-20",
                },
                {
                    id: "abs-003",
                    collaborateurId: "collab-789",
                    collaborateurNom: "Pierre Martin",
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

    const getTypeAbsenceLabel = (type: AbsenceType): string => {
        const types: Record<AbsenceType, string> = {
            conge_paye: "Congé payé",
            maladie: "Arrêt maladie",
            rtt: "RTT",
            sans_solde: "Congé sans solde",
            autre: "Autre",
        };
        return types[type];
    };

    const getStatusBadge = (status: AbsenceStatus) => {
        switch (status) {
            case "approuve":
                return <Badge variant="default">Approuvé</Badge>;
            case "refuse":
                return <Badge variant="destructive">Refusé</Badge>;
            case "en_attente":
            default:
                return <Badge variant="outline">En attente</Badge>;
        }
    };

    const handleAbsenceAction = (id: string, action: "approuver" | "refuser") => {
        // Logique pour approuver ou refuser une demande d'absence
        console.log(`${action} absence ${id}`);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Demandes d{"'"}absence</CardTitle>
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
                                <TableHead>Collaborateur</TableHead>
                                <TableHead>Période</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Statut</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {absences.map((absence) => (
                                <TableRow key={absence.id}>
                                    <TableCell>{absence.collaborateurNom}</TableCell>
                                    <TableCell>
                                        {formatDate(absence.dateDebut)} - {formatDate(absence.dateFin)}
                                    </TableCell>
                                    <TableCell>{getTypeAbsenceLabel(absence.typeAbsence)}</TableCell>
                                    <TableCell>{getStatusBadge(absence.status)}</TableCell>
                                    <TableCell>
                                        {absence.status === "en_attente" && (
                                            <div className="flex space-x-2">
                                                <Button
                                                    variant="default"
                                                    size="sm"
                                                    onClick={() => handleAbsenceAction(absence.id, "approuver")}
                                                >
                                                    Approuver
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => handleAbsenceAction(absence.id, "refuser")}
                                                >
                                                    Refuser
                                                </Button>
                                            </div>
                                        )}
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