// types/index.ts
export interface LoginUserRequest {
    cin: string;
    password: string;
}

export interface AuthUserResponse {
    id: number;
    nom: string;
    prenom: string;
    cin: string;
    resetPassword: boolean;
    token: string;
}

export interface CollaborateurDTO {
    id?: number;
    nom: string;
    prenom: string;
    cin: string;
    dateNaissance?: string;
    lieuNaissance?: string;
    adresseDomicile?: string;
    cnss?: string;
    origine?: string;
    niveauEtude?: string;
    specialite?: string;
    dateEntretien?: string;
    dateEmbauche?: string;
    description?: string;
    piecesJustificatives?: PieceJustificativeDTO[];
}

export interface PieceJustificativeDTO {
    id: number;
    nom: string;
    chemin: string;
    dateCreation: string;
    type: string;
}