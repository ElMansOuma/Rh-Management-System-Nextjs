"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Clock, Calendar, FileText, ArrowUpRight } from "lucide-react";
import { collaborateurService } from "@/services/api";

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
      <div className="space-y-8 p-6 bg-gray-50 min-h-screen">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-800">Tableau de bord</h1>
          <div className="text-sm text-gray-500">
            {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-none shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Collaborateurs
              </CardTitle>
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                <Users className="h-4 w-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.loading ? (
                    <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
                ) : (
                    stats.totalCollaborateurs
                )}
              </div>
              <p className="text-xs font-medium text-gray-500 mt-1 flex items-center">
                <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                <span className="text-green-500">+2.5%</span> depuis le mois dernier
              </p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Présences aujourd{"'"}hui
              </CardTitle>
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                <Clock className="h-4 w-4 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.loading ? (
                    <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
                ) : (
                    stats.presencesAujourdhui
                )}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '65%' }}></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">65% du personnel</p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Congés en cours
              </CardTitle>
              <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
                <Calendar className="h-4 w-4 text-amber-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.loading ? (
                    <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
                ) : (
                    stats.congesEnCours
                )}
              </div>
              <p className="text-xs font-medium text-gray-500 mt-1 flex items-center">
                <span>Retour prévu: 28 mars</span>
              </p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Contrats actifs
              </CardTitle>
              <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                <FileText className="h-4 w-4 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.loading ? (
                    <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
                ) : (
                    stats.contratsActifs
                )}
              </div>
              <p className="text-xs font-medium text-gray-500 mt-1 flex items-center">
                <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                <span className="text-green-500">+3</span> ce mois-ci
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
  );
}