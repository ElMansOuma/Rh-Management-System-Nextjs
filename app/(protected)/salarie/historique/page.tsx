// app/(protected)/salarie/historique/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { Calendar, Clock, Filter, Download, Search, ChevronLeft, ChevronRight } from 'lucide-react';

// Type pour les entrées d'historique
type HistoriqueEntry = {
    id: number;
    date: string;
    heureArrivee: string;
    heureDepart: string | null;
    duree: string | null;
    status: 'complet' | 'incomplet' | 'absent' | 'conge';
    note?: string;
};

export default function Historique() {
    const [selectedMonth, setSelectedMonth] = useState(new Date());
    const [historique, setHistorique] = useState<HistoriqueEntry[]>([]);
    const [filteredHistorique, setFilteredHistorique] = useState<HistoriqueEntry[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('tous');
    const [isLoading, setIsLoading] = useState(true);

    // Fonction pour formater la date en français
    const formatDate = (date: Date): string => {
        return date.toLocaleDateString('fr-FR', {
            month: 'long',
            year: 'numeric'
        });
    };

    // Fonction pour naviguer entre les mois
    const navigateMonth = (direction: 'prev' | 'next') => {
        const newMonth = new Date(selectedMonth);
        if (direction === 'prev') {
            newMonth.setMonth(newMonth.getMonth() - 1);
        } else {
            newMonth.setMonth(newMonth.getMonth() + 1);
        }
        setSelectedMonth(newMonth);
    };

    // Fonction pour calculer la durée totale travaillée
    const calculateTotalHours = (entries: HistoriqueEntry[]): string => {
        // Filtre les entrées complètes uniquement
        const completedEntries = entries.filter(entry => entry.status === 'complet' && entry.duree);

        let totalMinutes = 0;
        completedEntries.forEach(entry => {
            if (entry.duree) {
                const [hours, minutes] = entry.duree.split(':').map(Number);
                totalMinutes += hours * 60 + minutes;
            }
        });

        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;

        return `${hours}h${minutes.toString().padStart(2, '0')}`;
    };

    // Simulation de données d'historique
    useEffect(() => {
        setIsLoading(true);

        // Simuler un appel API avec un délai
        setTimeout(() => {
            const currentYear = selectedMonth.getFullYear();
            const currentMonth = selectedMonth.getMonth();

            // Générer des données pour le mois sélectionné
            const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
            const mockData: HistoriqueEntry[] = [];

            for (let day = 1; day <= daysInMonth; day++) {
                const date = new Date(currentYear, currentMonth, day);

                // Exclure les weekends
                if (date.getDay() === 0 || date.getDay() === 6) {
                    continue;
                }

                // Générer des entrées aléatoires
                const random = Math.random();
                let status: 'complet' | 'incomplet' | 'absent' | 'conge' = 'complet';
                let heureArrivee = '09:00';
                let heureDepart: string | null = '18:00';
                let duree: string | null = '09:00';
                let note: string | undefined;

                if (random > 0.9) {
                    status = 'absent';
                    heureArrivee = '-';
                    heureDepart = null;
                    duree = null;
                    note = 'Absence maladie';
                } else if (random > 0.8) {
                    status = 'conge';
                    heureArrivee = '-';
                    heureDepart = null;
                    duree = null;
                    note = 'Congé payé';
                } else if (random > 0.7) {
                    status = 'incomplet';
                    heureArrivee = '09:00';
                    heureDepart = null;
                    duree = null;
                    note = 'Sortie non enregistrée';
                } else {
                    // Variations d'horaires pour les jours complets
                    const arrivalMinutes = Math.floor(Math.random() * 30) - 15;
                    const departureMinutes = Math.floor(Math.random() * 60) + 480; // 8h minimum + jusqu'à 1h

                    const arrivalHour = Math.floor((540 + arrivalMinutes) / 60);
                    const arrivalMin = (540 + arrivalMinutes) % 60;

                    const departureHour = Math.floor((540 + departureMinutes) / 60);
                    const departureMin = (540 + departureMinutes) % 60;

                    heureArrivee = `${arrivalHour.toString().padStart(2, '0')}:${arrivalMin.toString().padStart(2, '0')}`;
                    heureDepart = `${departureHour.toString().padStart(2, '0')}:${departureMin.toString().padStart(2, '0')}`;

                    const durationMinutes = departureMinutes - arrivalMinutes;
                    const durationHours = Math.floor(durationMinutes / 60);
                    const durationMins = durationMinutes % 60;

                    duree = `${durationHours.toString().padStart(2, '0')}:${durationMins.toString().padStart(2, '0')}`;
                }

                mockData.push({
                    id: day,
                    date: date.toISOString().split('T')[0],
                    heureArrivee,
                    heureDepart,
                    duree,
                    status,
                    note
                });
            }

            setHistorique(mockData);
            setFilteredHistorique(mockData);
            setIsLoading(false);
        }, 1000);
    }, [selectedMonth]);

    // Filtrer les données en fonction de la recherche et du filtre de statut
    useEffect(() => {
        let filtered = [...historique];

        // Appliquer le filtre de statut
        if (statusFilter !== 'tous') {
            filtered = filtered.filter(entry => entry.status === statusFilter);
        }

        // Appliquer la recherche
        if (searchQuery) {
            filtered = filtered.filter(entry =>
                entry.date.includes(searchQuery) ||
                (entry.note && entry.note.toLowerCase().includes(searchQuery.toLowerCase()))
            );
        }

        setFilteredHistorique(filtered);
    }, [historique, searchQuery, statusFilter]);

    // Export des données au format CSV
    const exportData = () => {
        // Préparer les en-têtes
        const headers = ['Date', 'Arrivée', 'Départ', 'Durée', 'Statut', 'Note'];

        // Préparer les lignes
        const rows = filteredHistorique.map(entry => [
            new Date(entry.date).toLocaleDateString('fr-FR'),
            entry.heureArrivee,
            entry.heureDepart || '-',
            entry.duree || '-',
            entry.status,
            entry.note || ''
        ]);

        // Combiner les en-têtes et les lignes
        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');

        // Créer un blob et télécharger
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `historique_${formatDate(selectedMonth).replace(' ', '_')}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Statut des couleurs
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'complet':
                return 'bg-green-100 text-green-800';
            case 'incomplet':
                return 'bg-yellow-100 text-yellow-800';
            case 'absent':
                return 'bg-red-100 text-red-800';
            case 'conge':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Statut des libellés
    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'complet':
                return 'Complet';
            case 'incomplet':
                return 'Incomplet';
            case 'absent':
                return 'Absent';
            case 'conge':
                return 'Congé';
            default:
                return status;
        }
    };

    return (
        <div className="bg-white shadow-md rounded-lg p-6">
            <h1 className="text-2xl font-bold mb-6">Historique de présence</h1>

            {/* Sélecteur de mois et exportation */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                <div className="flex items-center mb-4 md:mb-0">
                    <button
                        onClick={() => navigateMonth('prev')}
                        className="p-2 rounded-lg hover:bg-gray-100"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>

                    <div className="flex items-center mx-2 px-4 py-2 bg-gray-100 rounded-lg">
                        <Calendar className="w-5 h-5 mr-2 text-gray-600" />
                        <span className="font-medium">{formatDate(selectedMonth)}</span>
                    </div>

                    <button
                        onClick={() => navigateMonth('next')}
                        className="p-2 rounded-lg hover:bg-gray-100"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>

                <button
                    onClick={exportData}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    <Download className="w-5 h-5 mr-2" />
                    <span>Exporter</span>
                </button>
            </div>

            {/* Filtres et recherche */}
            <div className="flex flex-col md:flex-row justify-between mb-6">
                <div className="mb-4 md:mb-0">
                    <div className="flex items-center">
                        <Filter className="w-5 h-5 mr-2 text-gray-600" />
                        <span className="font-medium mr-2">Filtrer par statut:</span>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="tous">Tous</option>
                            <option value="complet">Complet</option>
                            <option value="incomplet">Incomplet</option>
                            <option value="absent">Absent</option>
                            <option value="conge">Congé</option>
                        </select>
                    </div>
                </div>

                <div className="relative">
                    <input
                        type="text"
                        placeholder="Rechercher..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
            </div>

            {/* Résumé des heures */}
            <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                        <Clock className="w-5 h-5 mr-2 text-blue-600" />
                        <span className="font-medium text-blue-800">Total des heures travaillées</span>
                    </div>
                    <p className="text-2xl font-bold text-blue-600">{calculateTotalHours(filteredHistorique)}</p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                        <Calendar className="w-5 h-5 mr-2 text-green-600" />
                        <span className="font-medium text-green-800">Jours de présence</span>
                    </div>
                    <p className="text-2xl font-bold text-green-600">
                        {filteredHistorique.filter(entry => entry.status === 'complet').length}
                    </p>
                </div>

                <div className="bg-red-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                        <Calendar className="w-5 h-5 mr-2 text-red-600" />
                        <span className="font-medium text-red-800">Jours d'absence</span>
                    </div>
                    <p className="text-2xl font-bold text-red-600">
                        {filteredHistorique.filter(entry => entry.status === 'absent').length}
                    </p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                        <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                        <span className="font-medium text-blue-800">Jours de congé</span>
                    </div>
                    <p className="text-2xl font-bold text-blue-600">
                        {filteredHistorique.filter(entry => entry.status === 'conge').length}
                    </p>
                </div>
            </div>

            {/* Tableau d'historique */}
            <div className="overflow-x-auto">
                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="loader"></div>
                        <p className="ml-4">Chargement des données...</p>
                    </div>
                ) : (
                    <table className="min-w-full bg-white border">
                        <thead>
                        <tr className="bg-gray-100">
                            <th className="py-3 px-4 text-left">Date</th>
                            <th className="py-3 px-4 text-left">Heure d'arrivée</th>
                            <th className="py-3 px-4 text-left">Heure de départ</th>
                            <th className="py-3 px-4 text-left">Durée</th>
                            <th className="py-3 px-4 text-left">Statut</th>
                            <th className="py-3 px-4 text-left">Note</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredHistorique.map((entry) => (
                            <tr key={entry.id} className="border-t hover:bg-gray-50">
                                <td className="py-3 px-4 font-medium">
                                    {new Date(entry.date).toLocaleDateString('fr-FR')}
                                </td>
                                <td className="py-3 px-4">{entry.heureArrivee}</td>
                                <td className="py-3 px-4">{entry.heureDepart || '-'}</td>
                                <td className="py-3 px-4">{entry.duree || '-'}</td>
                                <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(entry.status)}`}>
                      {getStatusLabel(entry.status)}
                    </span>
                                </td>
                                <td className="py-3 px-4">{entry.note || '-'}</td>
                            </tr>
                        ))}

                        {filteredHistorique.length === 0 && (
                            <tr>
                                <td colSpan={6} className="py-8 text-center text-gray-500">
                                    Aucune donnée disponible pour cette période
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Styles supplémentaires */}
            <style jsx>{`
        .loader {
          border: 4px solid #f3f3f3;
          border-top: 4px solid #3498db;
          border-radius: 50%;
          width: 30px;
          height: 30px;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
        </div>
    );
}