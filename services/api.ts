"use client";

// Types
export interface PieceJustificative {
    id?: number;
    nom: string;
    type: string;
    fichierUrl: string;
}

// Map pour les types de documents (pour l'affichage)
export const documentTypeMap: Record<string, string> = {
    "ID": "Carte d'identité",
    "DIPLOMA": "Diplôme",
    "CV": "CV",
    "CONTRACT": "Contrat",
    "OTHER": "Autre document"
};

export interface Collaborateur {
    id?: number;
    nom: string;
    prenom: string;
    cin: string;
    dateNaissance: string;
    lieuNaissance: string;
    adresseDomicile: string;
    adresse?: string; // Pour compatibilité avec le formulaire
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
        // Préparer les données en supprimant les champs temporaires
        const { tempDocuments, ...collaborateurData } = collaborateur as any;

        const response = await fetch(`${API_URL}/api/collaborateurs`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(collaborateurData),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(errorData?.message || 'Erreur lors de la création du collaborateur');
        }

        const newCollaborateur = await response.json();

        // Si nous avons des documents temporaires et un ID de collaborateur
        if (tempDocuments && tempDocuments.length > 0 && newCollaborateur.id) {
            try {
                // Pour chaque document temporaire, appeler l'API pour l'uploader
                for (const doc of tempDocuments) {
                    await pieceJustificativeService.upload(
                        newCollaborateur.id,
                        doc.type,
                        doc.file
                    );
                }
            } catch (error) {
                console.error("Erreur lors de l'upload des documents temporaires:", error);
            }
        }

        return newCollaborateur;
    },

    update: async (id: number, collaborateur: Collaborateur): Promise<Collaborateur> => {
        // Préparer les données en supprimant les champs temporaires
        const { tempDocuments, ...collaborateurData } = collaborateur as any;

        const response = await fetch(`${API_URL}/api/collaborateurs/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(collaborateurData),
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la mise à jour du collaborateur');
        }

        const updatedCollaborateur = await response.json();

        // Si nous avons des documents temporaires et un ID de collaborateur
        if (tempDocuments && tempDocuments.length > 0 && id) {
            try {
                // Pour chaque document temporaire, appeler l'API pour l'uploader
                for (const doc of tempDocuments) {
                    await pieceJustificativeService.upload(
                        id,
                        doc.type,
                        doc.file
                    );
                }
            } catch (error) {
                console.error("Erreur lors de l'upload des documents temporaires:", error);
            }
        }

        return updatedCollaborateur;
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

    uploadMultiple: async (collaborateurId: number, files: File[], types: string[]): Promise<PieceJustificative[]> => {
        const formData = new FormData();

        files.forEach((file, index) => {
            formData.append('files', file);
        });

        types.forEach((type, index) => {
            formData.append('types', type);
        });

        const response = await fetch(`${API_URL}/api/pieces-justificatives/batch/${collaborateurId}`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Erreur lors de l\'upload des pièces justificatives');
        }

        return await response.json();
    },

    update: async (id: number, type: string, file: File): Promise<PieceJustificative> => {
        const formData = new FormData();
        formData.append('type', type);
        formData.append('file', file);

        const response = await fetch(`${API_URL}/api/pieces-justificatives/${id}`, {
            method: 'PUT',
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la mise à jour de la pièce justificative');
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