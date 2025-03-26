// services/pointage-api.ts
import { PieceJustificative } from "@/services/api";

export interface PointageDTO {
    id?: number;
    type: 'ARRIVEE' | 'DEPART';
    timestamp: string;
}

export interface PointageResumeDTO {
    totalArrivees: number;
    totalDeparts: number;
    pointages: PointageDTO[];
}

export interface ApiErrorResponse {
    message: string;
    status: number;
}

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

export class ApiError extends Error {
    status: number;

    constructor(message: string, status: number) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
    }
}

export const pointageService = {
    enregistrerPointage: async (cin: string, type: 'ARRIVEE' | 'DEPART') => {
        try {
            const authToken = localStorage.getItem('authToken');
            if (!authToken) {
                throw new ApiError('Token non authentifié', 401);
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pointage/${cin}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify({ type })
            });

            if (!response.ok) {
                const errorData: ApiErrorResponse = await response.json();
                throw new ApiError(
                    errorData.message || "Impossible d'enregistrer le pointage",
                    response.status
                );
            }

            return await response.json() as PointageDTO;
        } catch (error) {
            console.error("Erreur lors de l'enregistrement du pointage:", error);
            throw error;
        }
    },

    getDernierPointage: async (cin: string): Promise<PointageDTO | null> => {
        try {
            const authToken = localStorage.getItem('authToken');
            if (!authToken) {
                throw new ApiError('Token non authentifié', 401);
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pointage/last/${cin}`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });

            if (response.status === 204) {
                return null;
            }

            if (!response.ok) {
                const errorData: ApiErrorResponse = await response.json();
                throw new ApiError(
                    errorData.message || "Impossible de récupérer le dernier pointage",
                    response.status
                );
            }

            return await response.json() as PointageDTO;
        } catch (error) {
            console.error("Erreur lors de la récupération du dernier pointage:", error);
            throw error;
        }
    },

    getPointageResume: async (cin: string): Promise<PointageResumeDTO> => {
        try {
            const authToken = localStorage.getItem('authToken');
            if (!authToken) {
                throw new ApiError('Token non authentifié', 401);
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pointage/resume/${cin}`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });

            if (!response.ok) {
                const errorData: ApiErrorResponse = await response.json();
                throw new ApiError(
                    errorData.message || "Impossible de récupérer le résumé des pointages",
                    response.status
                );
            }

            return await response.json() as PointageResumeDTO;
        } catch (error) {
            console.error("Erreur lors de la récupération du résumé des pointages:", error);
            throw error;
        }
    }
};
