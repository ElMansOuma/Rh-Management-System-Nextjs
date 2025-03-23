// types/index.ts

// Type pour les pièces justificatives
export interface PieceJustificative {
    id?: number;
    nom: string;
    description: string;
    type: string;
    cheminFichier?: string;
    dateCreation?: string;
    collaborateurId: number;
    statut?: string;
    collaborateurNom?: string;
    collaborateurPrenom?: string;
}

// Type pour les collaborateurs
export interface Collaborateur {
    id?: number;
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
    adresse: string;
    dateNaissance: string;
    cin: string;
    dateEmbauche: string;
    poste: string;
    departement: string;
    salaire: number;
}