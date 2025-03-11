"use client";

// Types
export interface PieceJustificative {
    id?: number;
    nom: string;
    type: string;
    fichierUrl: string;
}

export interface Collaborateur {
    id?: number;
    nom: string;
    prenom: string;
    cin: string;
    dateNaissance: string;
    lieuNaissance: string;
    adresseDomicile: string;
    cnss: string;
    origine: string;
    niveauEtude: string;
    specialite: string;
    dateEntretien: string;
    dateEmbauche: string;
    description: string;
    piecesJustificatives?: PieceJustificative[];
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// Service pour les collaborateurs
export const collaborateurService = {
    getAll: async (): Promise<Collaborateur[]> => {
        const response = await fetch(`${API_URL}/api/collaborateurs`);
        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des collaborateurs');
        }
        return await response.json();
    },

    getById: async (id: number): Promise<Collaborateur> => {
        const response = await fetch(`${API_URL}/api/collaborateurs/${id}`);
        if (!response.ok) {
            throw new Error('Collaborateur non trouvé');
        }
        return await response.json();
    },

    create: async (collaborateur: Collaborateur): Promise<Collaborateur> => {
        const response = await fetch(`${API_URL}/api/collaborateurs`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(collaborateur),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(errorData?.message || 'Erreur lors de la création du collaborateur');
        }

        return await response.json();
    },

    update: async (id: number, collaborateur: Collaborateur): Promise<Collaborateur> => {
        const response = await fetch(`${API_URL}/api/collaborateurs/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(collaborateur),
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la mise à jour du collaborateur');
        }

        return await response.json();
    },

    delete: async (id: number): Promise<boolean> => {
        const response = await fetch(`${API_URL}/api/collaborateurs/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la suppression du collaborateur');
        }

        return true;
    },
};

// Service pour les pièces justificatives
export const pieceJustificativeService = {
    getAllByCollaborateur: async (collaborateurId: number): Promise<PieceJustificative[]> => {
        const response = await fetch(`${API_URL}/api/pieces-justificatives/collaborateur/${collaborateurId}`);
        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des pièces justificatives');
        }
        return await response.json();
    },

    upload: async (collaborateurId: number, type: string, file: File): Promise<PieceJustificative> => {
        const formData = new FormData();
        formData.append('type', type);
        formData.append('file', file);

        const response = await fetch(`${API_URL}/api/pieces-justificatives/collaborateur/${collaborateurId}`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Erreur lors de l\'upload de la pièce justificative');
        }

        return await response.json();
    },

    delete: async (id: number): Promise<boolean> => {
        const response = await fetch(`${API_URL}/api/pieces-justificatives/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la suppression de la pièce justificative');
        }

        return true;
    },
};