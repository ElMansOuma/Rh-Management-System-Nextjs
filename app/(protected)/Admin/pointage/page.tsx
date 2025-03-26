"use client";

import { useState, useEffect } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import AdminAbsencesList from "./absences-list";
import AdminPointageList from "./pointage-list";
import AdminAbsenceStats from "./absence-stats";

export default function AdminPointagePage() {
    const { toast } = useToast();
    const [currentTab, setCurrentTab] = useState("pointages");

    return (
        <div className="container mx-auto py-6">
            <h1 className="text-2xl font-bold mb-6">Gestion du temps - Administration</h1>

            <Tabs value={currentTab} onValueChange={setCurrentTab}>
                <TabsList className="mb-4">
                    <TabsTrigger value="pointages">Pointages</TabsTrigger>
                    <TabsTrigger value="absences">Demandes d{"'"}absence</TabsTrigger>
                    <TabsTrigger value="stats">Statistiques</TabsTrigger>
                </TabsList>

                <TabsContent value="pointages">
                    <AdminPointageList />
                </TabsContent>

                <TabsContent value="absences">
                    <AdminAbsencesList />
                </TabsContent>

                <TabsContent value="stats">
                    <AdminAbsenceStats />
                </TabsContent>
            </Tabs>
        </div>
    );
}