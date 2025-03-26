"use client";

import React, { useState, useEffect } from 'react';
import {
    Calendar,
    Filter,
    Download,
    UserCircle2,
    ArrowUpDown
} from 'lucide-react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import pointageService from '@/services/pointage-api';
import { PointageEntry } from '@/types/pointage';

export default function AdminPointageList() {
    const { toast } = useToast();
    const [pointages, setPointages] = useState<PointageEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        search: ''
    });
    const [sorting, setSorting] = useState<{
        column: keyof PointageEntry;
        direction: 'asc' | 'desc';
    }>({
        column: 'timestamp',
        direction: 'desc'
    });

    useEffect(() => {
        fetchPointages();
    }, [filters.month, filters.year]);

    const fetchPointages = async () => {
        try {
            setLoading(true);
            const fetchedPointages = await pointageService.getAllPointages(
                filters.month.toString().padStart(2, '0'),
                filters.year
            );
            setPointages(fetchedPointages);
        } catch (error) {
            toast({
                title: 'Erreur',
                description: 'Impossible de récupérer les pointages',
                variant: 'destructive'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleExportCSV = () => {
        // Créer et télécharger un fichier CSV
        const headers = ['CIN', 'Nom', 'Prénom', 'Date', 'Type', 'Heure'];
        const csvData = pointages.map(entry => {
            const date = new Date(entry.timestamp);
            return [
                entry.cin || '',
                entry.nom || '',
                entry.prenom || '',
                date.toLocaleDateString(),
                entry.type === 'ARRIVEE' ? 'Arrivée' : 'Départ',
                date.toLocaleTimeString()
            ].join(',');
        });

        const csvContent = headers.join(',') + '\n' + csvData.join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `pointages_${filters.month}_${filters.year}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const filteredAndSortedPointages = pointages
        .filter(entry =>
            (entry.nom?.toLowerCase().includes(filters.search.toLowerCase()) || false) ||
            (entry.prenom?.toLowerCase().includes(filters.search.toLowerCase()) || false) ||
            (entry.cin?.toLowerCase().includes(filters.search.toLowerCase()) || false)
        )
        .sort((a, b) => {
            // Safe sorting with null/undefined handling
            const getCompareValue = (entry: PointageEntry, column: keyof PointageEntry) => {
                const value = entry[column];

                // Handle timestamp sorting
                if (column === 'timestamp') {
                    return new Date(entry.timestamp).getTime();
                }

                // Handle string-based columns
                if (typeof value === 'string') {
                    return value.toLowerCase();
                }

                // Default fallback
                return value;
            };

            const valueA = getCompareValue(a, sorting.column);
            const valueB = getCompareValue(b, sorting.column);

            // Handle cases where values might be undefined
            if (valueA == null) return 1;
            if (valueB == null) return -1;

            if (valueA < valueB) return sorting.direction === 'asc' ? -1 : 1;
            if (valueA > valueB) return sorting.direction === 'asc' ? 1 : -1;
            return 0;
        });

    // Rest of the component remains the same as in the previous implementation
    const renderFilterSection = () => (
        <div className="flex flex-wrap items-center space-x-4 mb-6">
            {/* Mois */}
            <Select
                value={filters.month.toString()}
                onValueChange={(value) => setFilters(prev => ({ ...prev, month: Number(value) }))}
            >
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sélectionner un mois" />
                </SelectTrigger>
                <SelectContent>
                    {[
                        'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
                        'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
                    ].map((month, index) => (
                        <SelectItem key={month} value={(index + 1).toString()}>
                            {month}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {/* Année */}
            <Select
                value={filters.year.toString()}
                onValueChange={(value) => setFilters(prev => ({ ...prev, year: Number(value) }))}
            >
                <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Année" />
                </SelectTrigger>
                <SelectContent>
                    {[2023, 2024, 2025].map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                            {year}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {/* Recherche */}
            <div className="flex items-center space-x-2 flex-grow">
                <Input
                    placeholder="Rechercher un collaborateur"
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    className="w-full max-w-xs"
                />
                <Button variant="outline" size="icon" onClick={handleExportCSV}>
                    <Download className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );

    // Rest of the component (renderPointagesTable and return) remains the same
    const renderPointagesTable = () => {
        if (loading) {
            return <div className="text-center py-4">Chargement des pointages...</div>;
        }

        if (filteredAndSortedPointages.length === 0) {
            return <div className="text-center py-4">Aucun pointage trouvé</div>;
        }

        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <Calendar className="mr-2" />
                        Pointages Collaborateurs
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead
                                    className="cursor-pointer hover:bg-gray-100 flex items-center"
                                    onClick={() => setSorting(prev => ({
                                        column: 'cin',
                                        direction: prev.column === 'cin' && prev.direction === 'asc' ? 'desc' : 'asc'
                                    }))}
                                >
                                    CIN <ArrowUpDown className="ml-2 h-4 w-4" />
                                </TableHead>
                                <TableHead>Nom</TableHead>
                                <TableHead>Prénom</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Heure</TableHead>
                                <TableHead>Type</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredAndSortedPointages.map((entry) => {
                                const date = new Date(entry.timestamp);
                                return (
                                    <TableRow key={entry.id}>
                                        <TableCell>{entry.cin}</TableCell>
                                        <TableCell>{entry.nom}</TableCell>
                                        <TableCell>{entry.prenom}</TableCell>
                                        <TableCell>{date.toLocaleDateString()}</TableCell>
                                        <TableCell>{date.toLocaleTimeString()}</TableCell>
                                        <TableCell>
                                            <span
                                                className={`
                                                    px-2 py-1 rounded-full text-xs font-semibold
                                                    ${entry.type === 'ARRIVEE'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                }
                                                `}
                                            >
                                                {entry.type === 'ARRIVEE' ? 'Arrivée' : 'Départ'}
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        );
    };

    return (
        <div>
            {renderFilterSection()}
            {renderPointagesTable()}
        </div>
    );
}