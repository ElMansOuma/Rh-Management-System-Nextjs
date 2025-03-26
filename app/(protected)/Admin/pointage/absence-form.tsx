"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

const formSchema = z.object({
    collaborateurId: z.string({
        required_error: "Veuillez sélectionner un collaborateur.",
    }),
    dateDebut: z.date({
        required_error: "Veuillez sélectionner une date de début.",
    }),
    dateFin: z.date({
        required_error: "Veuillez sélectionner une date de fin.",
    }),
    typeAbsence: z.string({
        required_error: "Veuillez sélectionner un type d'absence.",
    }),
    commentaire: z.string().optional(),
});

interface AbsenceFormProps {
    isAdminMode?: boolean;
}

export default function AbsenceForm({ isAdminMode = false }: AbsenceFormProps) {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Simuler une liste de collaborateurs (à remplacer par un appel API réel)
    const collaborateurs = [
        { id: "1", name: "Jean Dupont" },
        { id: "2", name: "Marie Martin" },
        { id: "3", name: "Pierre Dubois" },
    ];

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            commentaire: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true);
        try {
            // Appel API pour soumettre la demande d'absence
            // À implémenter selon votre API
            await new Promise(resolve => setTimeout(resolve, 1000));

            toast({
                title: "Demande enregistrée",
                description: isAdminMode
                    ? "La demande d'absence a été créée avec succès."
                    : "Votre demande d'absence a été soumise avec succès.",
            });

            form.reset();
        } catch (error) {
            toast({
                title: "Erreur",
                description: "Impossible de soumettre la demande d'absence.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    {isAdminMode ? "Créer une demande d'absence" : "Nouvelle demande d'absence"}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        {isAdminMode && (
                            <FormField
                                control={form.control}
                                name="collaborateurId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Collaborateur</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Sélectionner un collaborateur" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {collaborateurs.map(collab => (
                                                    <SelectItem
                                                        key={collab.id}
                                                        value={collab.id}
                                                    >
                                                        {collab.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="dateDebut"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Date de début</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant={"outline"}
                                                        className="w-full pl-3 text-left font-normal"
                                                    >
                                                        {field.value ? (
                                                            format(field.value, "PPP", { locale: fr })
                                                        ) : (
                                                            <span>Sélectionner une date</span>
                                                        )}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    disabled={(date) =>
                                                        date < new Date(new Date().setHours(0, 0, 0, 0))
                                                    }
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="dateFin"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Date de fin</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant={"outline"}
                                                        className="w-full pl-3 text-left font-normal"
                                                    >
                                                        {field.value ? (
                                                            format(field.value, "PPP", { locale: fr })
                                                        ) : (
                                                            <span>Sélectionner une date</span>
                                                        )}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    disabled={(date) => {
                                                        const startDate = form.getValues("dateDebut");
                                                        return (
                                                            !startDate ||
                                                            date < startDate ||
                                                            date < new Date(new Date().setHours(0, 0, 0, 0))
                                                        );
                                                    }}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="typeAbsence"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Type d{"'"}absence</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Sélectionner un type d'absence" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="conge_paye">Congé payé</SelectItem>
                                            <SelectItem value="maladie">Arrêt maladie</SelectItem>
                                            <SelectItem value="rtt">RTT</SelectItem>
                                            <SelectItem value="sans_solde">Congé sans solde</SelectItem>
                                            <SelectItem value="autre">Autre</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="commentaire"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Commentaire (optionnel)</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Informations complémentaires..."
                                            className="resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                            {isSubmitting ? "Envoi en cours..." : "Soumettre la demande"}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}