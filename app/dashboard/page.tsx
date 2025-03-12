"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Clock, Calendar, FileText } from "lucide-react";
import {collaborateurService} from "@/services/api";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalCollaborateurs: 0,
    presencesAujourdhui: 0,
    congesEnCours: 0,
    contratsActifs: 0,
    loading: true
  });

  useEffect(() => {
    async function fetchData() {
      try {
        // Récupérer tous les collaborateurs
        const collaborateurs = await collaborateurService.getAll();

        setStats({
          totalCollaborateurs: collaborateurs.length,
          // Pour les autres statistiques, vous pourriez implémenter des API spécifiques
          // ou calculer ici à partir des données des collaborateurs
          presencesAujourdhui: 0, // À implémenter
          congesEnCours: 0, // À implémenter
          contratsActifs: 0, // À implémenter
          loading: false
        });
      } catch (error) {
        console.error("Erreur lors du chargement des statistiques:", error);
        setStats(prev => ({ ...prev, loading: false }));
      }
    }

    fetchData();
  }, []);

  return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Tableau de bord</h1>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Collaborateurs
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.loading ? (
                    <div className="h-6 w-12 bg-gray-200 animate-pulse rounded"></div>
                ) : (
                    stats.totalCollaborateurs
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Présences aujourd{"'"}hui
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.loading ? (
                    <div className="h-6 w-12 bg-gray-200 animate-pulse rounded"></div>
                ) : (
                    stats.presencesAujourdhui
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Congés en cours
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.loading ? (
                    <div className="h-6 w-12 bg-gray-200 animate-pulse rounded"></div>
                ) : (
                    stats.congesEnCours
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Contrats actifs
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.loading ? (
                    <div className="h-6 w-12 bg-gray-200 animate-pulse rounded"></div>
                ) : (
                    stats.contratsActifs
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
  );
}