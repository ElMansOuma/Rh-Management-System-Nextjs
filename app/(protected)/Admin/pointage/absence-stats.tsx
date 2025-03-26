"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";

interface AbsenceStats {
    globalStats: {
        totalAbsences: number;
        pendingAbsences: number;
        approvedAbsences: number;
        rejectedAbsences: number;
    };
    typeBreakdown: {
        conge_paye: number;
        maladie: number;
        rtt: number;
        sans_solde: number;
        autre: number;
    };
    collaborateurStats: Array<{
        id: string;
        nom: string;
        totalAbsences: number;
    }>;
}

export default function AdminAbsenceStats() {
    const [stats, setStats] = useState<AbsenceStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            // Appel API pour récupérer les statistiques
            // À implémenter selon votre API
            // const response = await fetch('/api/admin/absence-stats');
            // const data = await response.json();
            // setStats(data);

            // Données simulées
            setStats({
                globalStats: {
                    totalAbsences: 45,
                    pendingAbsences: 12,
                    approvedAbsences: 30,
                    rejectedAbsences: 3,
                },
                typeBreakdown: {
                    conge_paye: 20,
                    maladie: 8,
                    rtt: 10,
                    sans_solde: 4,
                    autre: 3,
                },
                collaborateurStats: [
                    { id: "collab-123", nom: "Jean Dupont", totalAbsences: 5 },
                    { id: "collab-456", nom: "Marie Dubois", totalAbsences: 3 },
                    { id: "collab-789", nom: "Pierre Martin", totalAbsences: 7 },
                ],
            });
        } catch (error) {
            console.error("Erreur lors du chargement des statistiques", error);
        } finally {
            setLoading(false);
        }
    };

    const getTypeAbsenceLabel = (type: keyof AbsenceStats['typeBreakdown']): string => {
        const types = {
            conge_paye: "Congés payés",
            maladie: "Arrêts maladie",
            rtt: "RTT",
            sans_solde: "Congés sans solde",
            autre: "Autres",
        };
        return types[type];
    };

    if (loading) {
        return <div className="flex justify-center py-6">Chargement...</div>;
    }

    if (!stats) {
        return (
            <div className="text-center py-6 text-gray-500">
                Impossible de charger les statistiques
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Statistiques globales des absences</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-blue-50 p-4 rounded-lg text-center">
                            <div className="text-3xl font-bold text-blue-600">
                                {stats.globalStats.totalAbsences}
                            </div>
                            <div className="text-sm text-gray-600">Total des absences</div>
                        </div>

                        <div className="bg-yellow-50 p-4 rounded-lg text-center">
                            <div className="text-3xl font-bold text-yellow-600">
                                {stats.globalStats.pendingAbsences}
                            </div>
                            <div className="text-sm text-gray-600">En attente</div>
                        </div>

                        <div className="bg-green-50 p-4 rounded-lg text-center">
                            <div className="text-3xl font-bold text-green-600">
                                {stats.globalStats.approvedAbsences}
                            </div>
                            <div className="text-sm text-gray-600">Approuvées</div>
                        </div>

                        <div className="bg-red-50 p-4 rounded-lg text-center">
                            <div className="text-3xl font-bold text-red-600">
                                {stats.globalStats.rejectedAbsences}
                            </div>
                            <div className="text-sm text-gray-600">Refusées</div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Répartition des types d{"'"}absence</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {Object.entries(stats.typeBreakdown).map(([type, count]) => (
                            <div key={type} className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span>{getTypeAbsenceLabel(type as keyof AbsenceStats['typeBreakdown'])}</span>
                                    <span>{count}</span>
                                </div>
                                <Progress
                                    value={(count / stats.globalStats.totalAbsences) * 100}
                                    className="h-2"
                                />
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Top collaborateurs par absences</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Collaborateur</TableHead>
                                <TableHead>Nombre d{"'"}absences</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {stats.collaborateurStats
                                .sort((a, b) => b.totalAbsences - a.totalAbsences)
                                .map((collab) => (
                                    <TableRow key={collab.id}>
                                        <TableCell>{collab.nom}</TableCell>
                                        <TableCell>{collab.totalAbsences}</TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}