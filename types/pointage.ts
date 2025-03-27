// types/pointage.ts
export interface PointageRequest {
    type: 'ARRIVEE' | 'DEPART';
}

export interface PointageEntry {
    id?: number;
    cin: string;
    nom: string;
    prenom: string;
    timestamp: string;
    type: 'ARRIVEE' | 'DEPART';
}

export interface UserInfo {
    cin: string;
    nom: string;
    prenom: string;
    roles: string[];
}