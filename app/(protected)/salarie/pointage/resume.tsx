"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface TimeStats {
    thisWeek: {
        worked: number;
        expected: number;
    };
    leaveBalance: {
        paid: number;
        sick: number;
        rtt: number;
    };
}

export default function Resume() {
    const [stats, setStats] = useState<TimeStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            // Appel API pour récupérer les statistiques
            // À implémenter selon votre API
            // const response = await fetch('/api/pointage/stats');
            // const data = await response.json();
            // setStats(data);

            // Données simulées
            setStats({
                thisWeek: {
                    worked: 28,
                    expected: 35,
                },
                leaveBalance: {
                    paid: 18,
                    sick: 3,
                    rtt: 5,
                },
            });
        } catch (error) {
            console.error("Erreur lors du chargement des statistiques", error);
        } finally {
            setLoading(false);
        }
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

    const weekProgress = (stats.thisWeek.worked / stats.thisWeek.expected) * 100;

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Heures travaillées cette semaine</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <Progress value={weekProgress} className="h-2" />
                        <div className="flex justify-between text-sm">
                            <span>{stats.thisWeek.worked}h travaillées</span>
                            <span>{stats.thisWeek.expected}h attendues</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Solde de congés</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-blue-50 p-4 rounded-lg text-center">
                            <div className="text-3xl font-bold text-blue-600">
                                {stats.leaveBalance.paid}
                            </div>
                            <div className="text-sm text-gray-600">Jours de congés payés</div>
                        </div>

                        <div className="bg-green-50 p-4 rounded-lg text-center">
                            <div className="text-3xl font-bold text-green-600">
                                {stats.leaveBalance.rtt}
                            </div>
                            <div className="text-sm text-gray-600">RTT</div>
                        </div>

                        <div className="bg-purple-50 p-4 rounded-lg text-center">
                            <div className="text-3xl font-bold text-purple-600">
                                {stats.leaveBalance.sick}
                            </div>
                            <div className="text-sm text-gray-600">Jours maladie</div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}