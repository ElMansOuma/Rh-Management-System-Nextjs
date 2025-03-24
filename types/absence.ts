// types/absence.ts
export interface TypeAbsence {
    id: string;
    nom: string;
    description?: string;
    affecteCongesRestants: boolean;
}

export interface DemandeAbsence {
    id: string;
    userId: string;
    dateDebut: Date;
    dateFin: Date;
    typeId: string;
    commentaire?: string;
    statut: 'en_attente' | 'approuvee' | 'refusee';
    raisonRefus?: string;
}
