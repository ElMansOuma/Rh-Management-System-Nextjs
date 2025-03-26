"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { pointageService, PointageDTO } from "@/services/pointage-api";
import AbsenceForm from "./absence-form";
import AbsencesList from "./absences-list";
import Resume from "./resume";

export default function PointagePage() {
    const { toast } = useToast();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [lastPointage, setLastPointage] = useState<PointageDTO | null>(null);
    const [currentTab, setCurrentTab] = useState("pointage");

    useEffect(() => {
        // Charger le dernier pointage de l'utilisateur
        fetchLastPointage();
    }, []);

    const fetchLastPointage = async () => {
        try {
            const data = await pointageService.getDernierPointage();
            setLastPointage(data);
        } catch (error) {
            console.error("Erreur lors du chargement du pointage", error);
            toast({
                title: "Erreur",
                description: "Impossible de charger le dernier pointage",
                variant: "destructive",
            });
        }
    };

    const handlePointage = async (type: "ARRIVEE" | "DEPART") => {
        setLoading(true);
        try {
            const pointage = await pointageService.enregistrerPointage(type);

            // Mise à jour de l'état local
            setLastPointage(pointage);

            toast({
                title: "Pointage enregistré",
                description: `Vous avez enregistré votre ${type === "ARRIVEE" ? "arrivée" : "départ"} avec succès.`,
            });
        } catch (error: any) {
            toast({
                title: "Erreur",
                description: error.message || "Impossible d'enregistrer le pointage",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const shouldShowArriveeButton = !lastPointage || lastPointage.type === "DEPART";
    const shouldShowDepartButton = lastPointage && lastPointage.type === "ARRIVEE";

    return (
        <div className="container mx-auto py-6">
            <h1 className="text-2xl font-bold mb-6">Gestion du temps</h1>

            <Tabs value={currentTab} onValueChange={setCurrentTab}>
                <TabsList className="mb-4">
                    <TabsTrigger value="pointage">Pointage</TabsTrigger>
                    <TabsTrigger value="absence">Demande d{"'"}absence</TabsTrigger>
                    <TabsTrigger value="resume">Mon résumé</TabsTrigger>
                </TabsList>

                <TabsContent value="pointage">
                    <Card>
                        <CardHeader>
                            <CardTitle>Pointage journalier</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col items-center space-y-4">
                                <div className="text-center mb-6">
                                    {lastPointage && (
                                        <p>
                                            Dernier pointage : {lastPointage.type === "ARRIVEE" ? "Arrivée" : "Départ"} à{" "}
                                            {new Date(lastPointage.timestamp).toLocaleTimeString()}
                                        </p>
                                    )}
                                </div>

                                <div className="flex space-x-4">
                                    {shouldShowArriveeButton && (
                                        <Button
                                            size="lg"
                                            onClick={() => handlePointage("ARRIVEE")}
                                            disabled={loading}
                                            className="bg-green-600 hover:bg-green-700 text-white"
                                        >
                                            Arrivée
                                        </Button>
                                    )}

                                    {shouldShowDepartButton && (
                                        <Button
                                            size="lg"
                                            onClick={() => handlePointage("DEPART")}
                                            disabled={loading}
                                            className="bg-orange-500 hover:bg-orange-600 text-white"
                                        >
                                            Départ
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="absence">
                    <div className="space-y-6">
                        <AbsenceForm />
                        <AbsencesList />
                    </div>
                </TabsContent>

                <TabsContent value="resume">
                    <Resume />
                </TabsContent>
            </Tabs>
        </div>
    );
}