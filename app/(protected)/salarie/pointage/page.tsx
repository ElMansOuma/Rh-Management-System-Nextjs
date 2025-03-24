"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import AbsenceForm from "./absence-form";
import AbsencesList from "./absences-list";
import Resume from "./resume";

export default function PointagePage() {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [lastPointage, setLastPointage] = useState<any>(null);
    const [currentTab, setCurrentTab] = useState("pointage");

    useEffect(() => {
        // Charger le dernier pointage de l'utilisateur
        fetchLastPointage();
    }, []);

    const fetchLastPointage = async () => {
        try {
            // Appel API pour récupérer le dernier pointage
            // À implémenter selon votre API
            // const response = await fetch('/api/pointage/last');
            // const data = await response.json();
            // setLastPointage(data);

            // Pour le moment, simulons des données
            setLastPointage({
                type: "arrivee",
                timestamp: new Date().getTime() - 3600000, // 1 heure avant
            });
        } catch (error) {
            console.error("Erreur lors du chargement du pointage", error);
        }
    };

    const handlePointage = async (type: "arrivee" | "depart") => {
        setLoading(true);
        try {
            // Appel API pour enregistrer le pointage
            // À implémenter selon votre API
            // const response = await fetch('/api/pointage', {
            //   method: 'POST',
            //   body: JSON.stringify({ type }),
            // });

            // Simulation d'un appel API
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Mise à jour de l'état local
            setLastPointage({
                type,
                timestamp: new Date().getTime(),
            });

            toast({
                title: "Pointage enregistré",
                description: `Vous avez enregistré votre ${type === "arrivee" ? "arrivée" : "départ"} avec succès.`,
            });
        } catch (error) {
            toast({
                title: "Erreur",
                description: "Impossible d'enregistrer le pointage",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const shouldShowArriveeButton = !lastPointage || lastPointage.type === "depart";
    const shouldShowDepartButton = lastPointage && lastPointage.type === "arrivee";

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
                                            Dernier pointage : {lastPointage.type === "arrivee" ? "Arrivée" : "Départ"} à{" "}
                                            {new Date(lastPointage.timestamp).toLocaleTimeString()}
                                        </p>
                                    )}
                                </div>

                                <div className="flex space-x-4">
                                    {shouldShowArriveeButton && (
                                        <Button
                                            size="lg"
                                            onClick={() => handlePointage("arrivee")}
                                            disabled={loading}
                                            className="bg-green-600 hover:bg-green-700 text-white"
                                        >
                                            Arrivée
                                        </Button>
                                    )}

                                    {shouldShowDepartButton && (
                                        <Button
                                            size="lg"
                                            onClick={() => handlePointage("depart")}
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