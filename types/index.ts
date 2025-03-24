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
    cin: string;
    dateNaissance: string;
    lieuNaissance: string;
    adresseDomicile: string;
    adresse?: string; // For compatibility with the form
    cnss: string;
    origine: string;
    niveauEtude: string;
    specialite: string;
    dateEntretien: string;
    dateEmbauche: string;
    description: string;
    piecesJustificatives?: PieceJustificative[];
}

export interface LoginUserRequest {
    cin: string;
    password: string;
}

export interface AuthUserResponse {
    id: number;
    nom: string;
    prenom: string;
    cin: string;
    token: string;
    resetPassword: boolean;
}

