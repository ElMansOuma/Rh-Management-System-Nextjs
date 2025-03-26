export type PointageType = 'ARRIVEE' | 'DEPART';

export interface PointageRequest {
    type: PointageType;
}

export interface PointageEntry {
    id: number;
    type: PointageType;
    timestamp: string;
}
export interface PointageEntry {
    id: number;
    type: PointageType;
    timestamp: string;
    cin?: string;
    nom?: string;
    prenom?: string;
}