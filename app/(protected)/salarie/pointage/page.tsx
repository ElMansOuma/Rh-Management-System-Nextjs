"use client";

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Check, X } from 'lucide-react';
import authUserService from "@/services/authUser";
import pointageService from "@/services/pointage-api";
import { toast } from "@/components/ui/use-toast";
import { PointageEntry } from "@/types/pointage";

export default function PointagePage() {
    const [userInfo, setUserInfo] = useState<{
        cin: string;
        nom: string;
        prenom: string;
    } | null>(null);
    const [todayPointage, setTodayPointage] = useState<PointageEntry | null>(null);
    const [pointageHistory, setPointageHistory] = useState<PointageEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    useEffect(() => {
        const storedUserInfo = localStorage.getItem('userInfo');
        if (storedUserInfo) {
            const parsedUserInfo = JSON.parse(storedUserInfo);
            setUserInfo(parsedUserInfo);
            fetchInitialData();
        } else {
            authUserService.logout();
        }
    }, [selectedMonth, selectedYear]);

    const fetchInitialData = async () => {
        try {
            const [pointage, history] = await Promise.all([
                pointageService.getTodayPointage(),
                pointageService.getUserPointages(
                    selectedMonth.toString().padStart(2, '0'),
                    selectedYear
                )
            ]);
            setTodayPointage(pointage);
            setPointageHistory(history);
        } catch (error) {
            console.error('Erreur de récupération des données:', error);
            toast({
                title: 'Erreur',
                description: 'Impossible de récupérer les données',
                variant: 'destructive'
            });
        } finally {
            setLoading(false);
        }
    };

    const handlePointage = async (type: 'ARRIVEE' | 'DEPART') => {
        if (!userInfo) return;

        try {
            const newPointage = await pointageService.createPointage({
                type: type
            });

            setTodayPointage(newPointage);
            fetchInitialData(); // Refresh history after new pointage

            toast({
                title: 'Pointage enregistré',
                description: `${type === 'ARRIVEE' ? 'Arrivée' : 'Départ'} enregistré avec succès`,
            });
        } catch (error: any) {
            toast({
                title: 'Erreur de pointage',
                description: error.message || 'Impossible d\'enregistrer le pointage',
                variant: 'destructive',
            });
        }
    };

    const renderMonthSelector = () => {
        const months = [
            'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
            'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
        ];

        return (
            <div className="flex items-center space-x-4 mb-4">
                <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(Number(e.target.value))}
                    className="px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    {months.map((month, index) => (
                        <option key={index} value={index + 1}>{month}</option>
                    ))}
                </select>
                <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                    className="px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    {[2023, 2024, 2025].map((year) => (
                        <option key={year} value={year}>{year}</option>
                    ))}
                </select>
            </div>
        );
    };

    const renderPointageHistory = () => {
        if (pointageHistory.length === 0) {
            return (
                <div className="text-gray-500 text-center py-4">
                    Aucun historique de pointage pour cette période
                </div>
            );
        }

        return (
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-100 border-b">
                    <tr>
                        <th className="p-3 text-left">Date</th>
                        <th className="p-3 text-left">Heure</th>
                        <th className="p-3 text-left">Type</th>
                    </tr>
                    </thead>
                    <tbody>
                    {pointageHistory.map((entry) => {
                        const date = new Date(entry.timestamp);
                        return (
                            <tr key={entry.id} className="border-b last:border-b-0 hover:bg-gray-50">
                                <td className="p-3">
                                    <div className="flex items-center">
                                        <Calendar className="mr-2 text-gray-500" size={18} />
                                        {date.toLocaleDateString()}
                                    </div>
                                </td>
                                <td className="p-3">
                                    <div className="flex items-center">
                                        <Clock className="mr-2 text-gray-500" size={18} />
                                        {date.toLocaleTimeString()}
                                    </div>
                                </td>
                                <td className="p-3">
                                    {entry.type === 'ARRIVEE' ? (
                                        <span className="flex items-center text-green-600">
                                                <Check className="mr-2" size={18} /> Arrivée
                                            </span>
                                    ) : (
                                        <span className="flex items-center text-red-600">
                                                <X className="mr-2" size={18} /> Départ
                                            </span>
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>
        );
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Chargement...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">
                Pointage de {userInfo?.prenom} {userInfo?.nom}
            </h1>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Today's Pointage Section */}
                <div className="bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4 text-gray-700">Pointage du jour</h2>
                    {todayPointage ? (
                        <div className="flex items-center space-x-4 mb-4">
                            <Clock className="text-blue-500" size={24} />
                            <p className="text-gray-700">
                                Dernier pointage :
                                {todayPointage.type === 'ARRIVEE' ? ' Arrivée ' : ' Départ '}
                                à {new Date(todayPointage.timestamp).toLocaleTimeString()}
                            </p>
                        </div>
                    ) : (
                        <p className="text-gray-500 mb-4">Aucun pointage aujourd'hui</p>
                    )}

                    <div className="flex space-x-4">
                        <button
                            onClick={() => handlePointage('ARRIVEE')}
                            disabled={todayPointage?.type === 'ARRIVEE'}
                            className="flex-1 bg-green-500 text-white px-4 py-2 rounded
                            disabled:bg-green-200 hover:bg-green-600 transition-colors
                            flex items-center justify-center space-x-2"
                        >
                            <Check size={20} />
                            <span>Pointer Arrivée</span>
                        </button>
                        <button
                            onClick={() => handlePointage('DEPART')}
                            disabled={!todayPointage || todayPointage.type === 'DEPART'}
                            className="flex-1 bg-red-500 text-white px-4 py-2 rounded
                            disabled:bg-red-200 hover:bg-red-600 transition-colors
                            flex items-center justify-center space-x-2"
                        >
                            <X size={20} />
                            <span>Pointer Départ</span>
                        </button>
                    </div>
                </div>

                {/* Month Selection and Stats */}
                <div className="bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4 text-gray-700">Statistiques</h2>
                    {renderMonthSelector()}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-blue-50 p-4 rounded-lg text-center">
                            <p className="text-sm text-gray-600">Total Pointages</p>
                            <p className="text-2xl font-bold text-blue-600">{pointageHistory.length}</p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg text-center">
                            <p className="text-sm text-gray-600">Arrivées</p>
                            <p className="text-2xl font-bold text-green-600">
                                {pointageHistory.filter(p => p.type === 'ARRIVEE').length}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Pointage History Section */}
            <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Historique de Pointage</h2>
                {renderPointageHistory()}
            </div>
        </div>
    );
}