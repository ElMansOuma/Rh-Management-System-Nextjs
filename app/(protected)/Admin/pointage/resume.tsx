"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TeamStats {
    totalEmployees: number;
    currentlyAbsent: number;
    workingHoursOverview: {
        totalHoursExpected: number;
        totalHoursWorked: number;
    };
    leaveBalances: {
        paidLeave: number;
        sickLeave: number;
        rtt: number;
    };
}

export default function AdminResume() {
    const [stats, setStats] = useState<TeamStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentTab, setCurrentTab] = useState("overview");

    useEffect(() => {
        fetchTeamStats();
    }, []);

    const fetchTeamStats = async () => {
        try {
            // Simulated team statistics
            setStats({
                totalEmployees: 50,
                currentlyAbsent: 5,
                workingHoursOverview: {
                    totalHoursExpected: 1750,
                    totalHoursWorked: 1400,
                },
                leaveBalances: {
                    paidLeave: 450,
                    sickLeave: 75,
                    rtt: 200,
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

    const workHoursProgress = (stats.workingHoursOverview.totalHoursWorked / stats.workingHoursOverview.totalHoursExpected) * 100;

    return (
        <div className="space-y-6">
            <Tabs value={currentTab} onValueChange={setCurrentTab}>
                <TabsList className="mb-4">
                    <TabsTrigger value="overview">Vue d{"'"}ensemble</TabsTrigger>
                    <TabsTrigger value="detailed">Stats détaillées</TabsTrigger>
                </TabsList>

                <TabsContent value="overview">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Présence</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex justify-between">
                                        <span>Total employés</span>
                                        <span className="font-bold">{stats.totalEmployees}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Absents actuellement</span>
                                        <span className="font-bold text-red-600">{stats.currentlyAbsent}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Pourcentage absent</span>
                                        <span className="font-bold text-red-600">
                                            {((stats.currentlyAbsent / stats.totalEmployees) * 100).toFixed(1)}%
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Heures travaillées</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <Progress value={workHoursProgress} className="h-2" />
                                    <div className="flex justify-between text-sm">
                                        <span>{stats.workingHoursOverview.totalHoursWorked}h travaillées</span>
                                        <span>{stats.workingHoursOverview.totalHoursExpected}h attendues</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="detailed">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Congés</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="bg-blue-50 p-4 rounded-lg text-center">
                                        <div className="text-3xl font-bold text-blue-600">
                                            {stats.leaveBalances.paidLeave}
                                        </div>
                                        <div className="text-sm text-gray-600">Jours de congés payés</div>
                                    </div>
                                    <div className="bg-green-50 p-4 rounded-lg text-center">
                                        <div className="text-3xl font-bold text-green-600">
                                            {stats.leaveBalances.rtt}
                                        </div>
                                        <div className="text-sm text-gray-600">RTT</div>
                                    </div>
                                    <div className="bg-purple-50 p-4 rounded-lg text-center">
                                        <div className="text-3xl font-bold text-purple-600">
                                            {stats.leaveBalances.sickLeave}
                                        </div>
                                        <div className="text-sm text-gray-600">Jours maladie</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}