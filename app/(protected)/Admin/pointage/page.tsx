"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon, Search, Edit2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";

// Types
interface Pointage {
    id: string;
    employeeId: string;
    employeeName: string;
    type: "arrivee" | "depart";
    timestamp: number;
    manual: boolean;
}

export default function PointagesAdmin() {
    const { toast } = useToast();
    const [pointages, setPointages] = useState<Pointage[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [currentPointage, setCurrentPointage] = useState<Pointage | null>(null);
    const [editTime, setEditTime] = useState("");

    useEffect(() => {
        fetchPointages();
    }, [selectedDate]);

    const fetchPointages = async () => {
        try {
            setLoading(true);
            // Dans une application réelle, vous feriez un appel API ici
            // const response = await fetch('/api/admin/pointages?date=' + selectedDate);
            // const data = await response.json();

            // Données simulées
            await new Promise(resolve => setTimeout(resolve, 800));

            const simulatedData: Pointage[] = [
                {
                    id: "p001",
                    employeeId: "emp1",
                    employeeName: "Sophie Martin",
                    type: "arrivee",
                    timestamp: new Date(new Date().setHours(8, 30)).getTime(),
                    manual: false,
                },
                {
                    id: "p002",
                    employeeId: "emp1",
                    employeeName: "Sophie Martin",
                    type: "depart",
                    timestamp: new Date(new Date().setHours(17, 15)).getTime(),
                    manual: false,
                },
                {
                    id: "p003",
                    employeeId: "emp2",
                    employeeName: "Thomas Bernard",
                    type: "arrivee",
                    timestamp: new Date(new Date().setHours(9, 5)).getTime(),
                    manual: false,
                },
                {
                    id: "p004",
                    employeeId: "emp2",
                    employeeName: "Thomas Bernard",
                    type: "depart",
                    timestamp: new Date(new Date().setHours(18, 0)).getTime(),
                    manual: true,
                },
                {
                    id: "p005",
                    employeeId: "emp3",
                    employeeName: "Julie Dubois",
                    type: "arrivee",
                    timestamp: new Date(new Date().setHours(8, 45)).getTime(),
                    manual: false,
                },
            ];

            setPointages(simulatedData);
        } catch (error) {
            console.error("Erreur lors du chargement des pointages", error);
            toast({
                title: "Erreur",
                description: "Impossible de charger les pointages",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = (pointage: Pointage) => {
        setCurrentPointage(pointage);
        const date = new Date(pointage.timestamp);
        const hours = date.getHours().toString().padStart(2, "0");
        const minutes = date.getMinutes().toString().padStart(2, "0");
        setEditTime(`${hours}:${minutes}`);
        setIsEditDialogOpen(true);
    };

    const handleEditSubmit = async () => {
        if (!currentPointage || !editTime) return;

        try {
            const [hours, minutes] = editTime.split(":").map(Number);
            const newDate = new Date(currentPointage.timestamp);
            newDate.setHours(hours, minutes);

            // Dans une application réelle, vous feriez un appel API ici
            // await fetch(`/api/admin/pointages/${currentPointage.id}`, {
            //   method: 'PUT',
            //   body: JSON.stringify({ timestamp: newDate.getTime(), manual: true }),
            // });

            // Simulation
            await new Promise(resolve => setTimeout(resolve, 500));

            // Mettre à jour l'état local
            setPointages(pointages.map(p =>
                p.id === currentPointage.id
                    ? { ...p, timestamp: newDate.getTime(), manual: true }
                    : p
            ));

            toast({
                title: "Pointage modifié",
                description: "Le pointage a été modifié avec succès",
            });

            setIsEditDialogOpen(false);
        } catch (error) {
            console.error("Erreur lors de la modification du pointage", error);
            toast({
                title: "Erreur",
                description: "Impossible de modifier le pointage",
                variant: "destructive",
            });
        }
    };

    const formatTimestamp = (timestamp: number) => {
        const date = new Date(timestamp);
        return format(date, "HH:mm", { locale: fr });
    };

    const formatDate = (date: Date) => {
        return format(date, "PPP", { locale: fr });
    };

    const filteredPointages = pointages.filter(pointage =>
        pointage.employeeName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle>Gestion des pointages</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-2 top-3 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Rechercher un employé..."
                                    className="pl-8"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                        <div>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className="w-full md:w-auto">
                                        {selectedDate ? formatDate(selectedDate) : "Sélectionner une date"}
                                        <CalendarIcon className="ml-2 h-4 w-4" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={selectedDate}
                                        onSelect={setSelectedDate}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>

                    {loading ? (
                        <div className="text-center py-8">Chargement...</div>
                    ) : filteredPointages.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            Aucun pointage trouvé pour cette date
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Employé</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Heure</TableHead>
                                    <TableHead>Statut</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredPointages.map((pointage) => (
                                    <TableRow key={pointage.id}>
                                        <TableCell className="font-medium">{pointage.employeeName}</TableCell>
                                        <TableCell>
                                            {pointage.type === "arrivee" ? "Arrivée" : "Départ"}
                                        </TableCell>
                                        <TableCell>{formatTimestamp(pointage.timestamp)}</TableCell>
                                        <TableCell>
                                            {pointage.manual ? (
                                                <span className="text-amber-600 text-sm">Modifié manuellement</span>
                                            ) : (
                                                <span className="text-green-600 text-sm">Automatique</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleEditClick(pointage)}
                                            >
                                                <Edit2 className="h-4 w-4 mr-1" />
                                                Modifier
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            <Button onClick={() => {
                setPointages([]);
                setLoading(true);
                fetchPointages();
            }}>
                Actualiser les données
            </Button>

            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Modifier le pointage</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        {currentPointage && (
                            <>
                                <div className="space-y-2">
                                    <p className="text-sm font-medium">Employé</p>
                                    <p>{currentPointage.employeeName}</p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm font-medium">Type</p>
                                    <p>{currentPointage.type === "arrivee" ? "Arrivée" : "Départ"}</p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm font-medium">Date</p>
                                    <p>{format(new Date(currentPointage.timestamp), "PPP", { locale: fr })}</p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm font-medium">Nouvelle heure</p>
                                    <Input
                                        type="time"
                                        value={editTime}
                                        onChange={(e) => setEditTime(e.target.value)}
                                    />
                                </div>
                            </>
                        )}
                    </div>
                    <div className="flex justify-end gap-3">
                        <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                            Annuler
                        </Button>
                        <Button onClick={handleEditSubmit}>
                            Enregistrer
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}