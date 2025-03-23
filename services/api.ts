"use client";

// Types
export interface PieceJustificative {
    id?: number;
    nom: string;
    type: string;
    fichierUrl: string;
    statut?: string; // Ajouté pour le filtre par statut
}

// Updated Map for document types (for display)
export const documentTypeMap: Record<string, string> = {
    "CONTRAT": "Contrat",
    "CV": "CV",
    "DIPLOME": "Diplôme",
    "PIECE_IDENTITE": "Pièce d'identité",
    "CERTIFICAT": "Certificat",
    "AUTRE": "Autre"
};

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

// Import fetchWithAuth from authentication service
import { fetchWithAuth } from './auth';
import axios from 'axios';

// API URL correction - ensure it points to the backend not frontend
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
const API_ENDPOINT = `${API_URL}/api`;

// Debug log for the URL being used
console.log("API URL used:", API_URL);

// Axios configuration
const api = axios.create({
    baseURL: API_ENDPOINT,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor to add JWT token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Service for collaborateurs
export const collaborateurService = {
    getAll: async (): Promise<Collaborateur[]> => {
        try {
            console.log(`API Call: GET ${API_URL}/api/collaborateurs`);
            const response = await fetchWithAuth(`${API_URL}/api/collaborateurs`);

            console.log(`Response: ${response.status} ${response.statusText}`);

            if (!response.ok) {
                if (response.status === 404) {
                    console.warn('No collaborateurs found in database');
                    return [];
                }
                throw new Error(`Error retrieving collaborateurs: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            console.log(`Data received: ${data.length} collaborateurs`);
            return data;
        } catch (error) {
            console.error("Error in getAll:", error);
            throw error;
        }
    },

    getById: async (id: number): Promise<Collaborateur> => {
        if (!id || isNaN(id)) {
            throw new Error('Invalid collaborateur ID');
        }

        try {
            const url = `${API_URL}/api/collaborateurs/${id}`;
            console.log(`API Call: GET ${url}`);

            const response = await fetchWithAuth(url);
            console.log(`Response: ${response.status} ${response.statusText}`);

            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error(`Collaborateur with ID ${id} not found`);
                }
                throw new Error(`Error retrieving collaborateur: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            console.log("Data received:", data);
            return data;
        } catch (error) {
            console.error(`Error in getById(${id}):`, error);
            throw error;
        }
    },

    create: async (collaborateur: Collaborateur): Promise<Collaborateur> => {
        // Prepare data by removing temporary fields
        const { tempDocuments, ...collaborateurData } = collaborateur as any;

        try {
            console.log(`API Call: POST ${API_URL}/api/collaborateurs`);
            console.log("Data sent:", collaborateurData);

            const response = await fetchWithAuth(`${API_URL}/api/collaborateurs`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(collaborateurData),
            });

            console.log(`Response: ${response.status} ${response.statusText}`);

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.message || `Error creating collaborateur: ${response.status} ${response.statusText}`);
            }

            const newCollaborateur = await response.json();
            console.log("Collaborateur created:", newCollaborateur);

            // If we have temporary documents and a valid collaborateur ID
            if (tempDocuments && tempDocuments.length > 0 && newCollaborateur.id &&
                typeof newCollaborateur.id === 'number' && !isNaN(newCollaborateur.id)) {
                try {
                    console.log(`Uploading ${tempDocuments.length} documents for collaborateur ${newCollaborateur.id}`);
                    // For each temporary document, call the API to upload it
                    for (const doc of tempDocuments) {
                        await pieceJustificativeService.create(
                            {
                                nom: doc.file.name,
                                type: doc.type,
                                collaborateurId: newCollaborateur.id
                            },
                            doc.file
                        );
                    }
                } catch (error) {
                    console.error("Error uploading temporary documents:", error);
                }
            }

            return newCollaborateur;
        } catch (error) {
            console.error("Error in create:", error);
            throw error;
        }
    },

    update: async (id: number, collaborateur: Collaborateur): Promise<Collaborateur> => {
        // Verify that the ID is valid
        if (!id || isNaN(id)) {
            throw new Error('Invalid collaborateur ID');
        }

        try {
            // Prepare data by removing temporary fields
            const { tempDocuments, ...collaborateurData } = collaborateur as any;

            console.log(`API Call: PUT ${API_URL}/api/collaborateurs/${id}`);
            console.log("Data sent:", collaborateurData);

            const response = await fetchWithAuth(`${API_URL}/api/collaborateurs/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(collaborateurData),
            });

            console.log(`Response: ${response.status} ${response.statusText}`);

            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error(`Collaborateur with ID ${id} not found`);
                }

                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.message || `Error updating collaborateur: ${response.status} ${response.statusText}`);
            }

            const updatedCollaborateur = await response.json();
            console.log("Collaborateur updated:", updatedCollaborateur);

            // If we have temporary documents and a valid collaborateur ID
            if (tempDocuments && tempDocuments.length > 0 && id &&
                typeof id === 'number' && !isNaN(id)) {
                try {
                    console.log(`Uploading ${tempDocuments.length} documents for collaborateur ${id}`);
                    // For each temporary document, call the API to upload it
                    for (const doc of tempDocuments) {
                        await pieceJustificativeService.create(
                            {
                                nom: doc.file.name,
                                type: doc.type,
                                collaborateurId: id
                            },
                            doc.file
                        );
                    }
                } catch (error) {
                    console.error("Error uploading temporary documents:", error);
                }
            }

            return updatedCollaborateur;
        } catch (error) {
            console.error(`Error in update(${id}):`, error);
            throw error;
        }
    },

    delete: async (id: number): Promise<boolean> => {
        // Verify that the ID is valid
        if (!id || isNaN(id)) {
            throw new Error('Invalid collaborateur ID');
        }

        try {
            console.log(`API Call: DELETE ${API_URL}/api/collaborateurs/${id}`);

            const response = await fetchWithAuth(`${API_URL}/api/collaborateurs/${id}`, {
                method: 'DELETE',
            });

            console.log(`Response: ${response.status} ${response.statusText}`);

            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error(`Collaborateur with ID ${id} not found`);
                }
                throw new Error(`Error deleting collaborateur: ${response.status} ${response.statusText}`);
            }

            console.log(`Collaborateur ${id} successfully deleted`);
            return true;
        } catch (error) {
            console.error(`Error in delete(${id}):`, error);
            throw error;
        }
    },
};

// Updated service for pieces justificatives
export const pieceJustificativeService = {
    // Get all documents with optional status filter
    getAll: async (statusFilter = null) => {
        try {
            let url = `${API_URL}/api/pieces-justificatives`;
            if (statusFilter) {
                url += `?statut=${statusFilter}`;
            }
            console.log(`API Call: GET ${url}`);

            const response = await fetchWithAuth(url);
            console.log(`Response: ${response.status} ${response.statusText}`);

            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des documents');
            }

            const data = await response.json();
            console.log(`Data received: ${data.length} documents`);
            return data;
        } catch (error) {
            console.error("Erreur dans getAll:", error);
            throw error;
        }
    },

    // Get document by ID
    getById: async (id: number) => {
        try {
            const url = `${API_URL}/api/pieces-justificatives/${id}`;
            console.log(`API Call: GET ${url}`);

            const response = await fetchWithAuth(url);
            console.log(`Response: ${response.status} ${response.statusText}`);

            if (!response.ok) {
                throw new Error(`Erreur lors de la récupération du document avec ID ${id}`);
            }

            const data = await response.json();
            console.log("Data received:", data);
            return data;
        } catch (error) {
            console.error(`Erreur dans getById(${id}):`, error);
            throw error;
        }
    },

    // Get documents by collaborateur ID with optional status filter
    getByCollaborateurId: async (collaborateurId: number, statusFilter = null) => {
        try {
            let url = `${API_URL}/api/pieces-justificatives/collaborateur/${collaborateurId}`;
            if (statusFilter) {
                url += `?statut=${statusFilter}`;
            }
            console.log(`API Call: GET ${url}`);

            const response = await fetchWithAuth(url);
            console.log(`Response: ${response.status} ${response.statusText}`);

            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des documents');
            }

            const data = await response.json();
            console.log(`Data received: ${data.length} documents for collaborateur ${collaborateurId}`);
            return data;
        } catch (error) {
            console.error(`Erreur dans getByCollaborateurId(${collaborateurId}):`, error);
            throw error;
        }
    },

    // For compatibility with existing code
    getAllByCollaborateur: async (collaborateurId: number, statusFilter = null): Promise<PieceJustificative[]> => {
        return pieceJustificativeService.getByCollaborateurId(collaborateurId, statusFilter);
    },

    // Create new document - MÉTHODE CORRIGÉE
    create: async (pieceJustificative: any, file: File) => {
        try {
            const formData = new FormData();

            // Ajouter le fichier directement
            formData.append('file', file);

            // Ajouter les autres champs directement dans le FormData (au lieu d'un JSON blob)
            formData.append('description', file.name);
            formData.append('type', pieceJustificative.type);

            // Ajouter l'ID du collaborateur directement
            if (pieceJustificative.collaborateurId) {
                formData.append('collaborateurId', pieceJustificative.collaborateurId.toString());
            }

            console.log('Uploading file:', file.name, 'for collaborateur:', pieceJustificative.collaborateurId);

            // Appeler directement l'API du backend au lieu de passer par l'API route de Next.js
            const response = await fetchWithAuth(`${API_URL}/api/pieces-justificatives`, {
                method: 'POST',
                body: formData,
                // Ne pas spécifier Content-Type car il sera automatiquement défini avec la boundary
            });

            if (!response.ok) {
                let errorMessage;
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.error || `HTTP Error ${response.status}`;
                } catch (e) {
                    errorMessage = `HTTP Error ${response.status}`;
                }
                console.error('File upload failed:', errorMessage);
                throw new Error(errorMessage);
            }

            const data = await response.json();
            console.log('Upload successful, response:', data);
            return data;
        } catch (error) {
            console.error('Error in create method:', error);
            throw error;
        }
    },

    // For compatibility with existing code
    upload: async (collaborateurId: number, type: string, file: File): Promise<PieceJustificative> => {
        return pieceJustificativeService.create({
            nom: file.name,
            type: type,
            collaborateurId: collaborateurId
        }, file);
    },

    // Update document
    update: async (id: number, pieceJustificative: any, file?: File) => {
        try {
            const formData = new FormData();

            // Ajouter les champs directement (au lieu d'un JSON blob)
            formData.append('description', pieceJustificative.nom || pieceJustificative.description);
            formData.append('type', pieceJustificative.type);

            // Ajouter l'ID du collaborateur directement
            if (pieceJustificative.collaborateurId) {
                formData.append('collaborateurId', pieceJustificative.collaborateurId.toString());
            }

            // Add the file if it exists
            if (file) {
                formData.append('file', file);
            }

            // Appeler directement l'API du backend
            const response = await fetchWithAuth(`${API_URL}/api/pieces-justificatives/${id}`, {
                method: 'PUT',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Erreur lors de la mise à jour du fichier`);
            }

            return response.json();
        } catch (error) {
            console.error(`Error in update(${id}):`, error);
            throw error;
        }
    },

    // Update document status - modified to use PATCH method
    updateStatut: async (id: number, statut: string) => {
        try {
            console.log(`API Call: PATCH ${API_URL}/api/pieces-justificatives/${id}/statut`);
            console.log("Data sent:", { statut });

            const response = await fetchWithAuth(`${API_URL}/api/pieces-justificatives/${id}/statut`, {
                method: 'PATCH', // Changed from PUT to PATCH
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ statut }),
            });

            console.log(`Response: ${response.status} ${response.statusText}`);

            if (!response.ok) {
                throw new Error('Erreur lors de la mise à jour du statut');
            }

            const data = await response.json();
            console.log("Status updated:", data);
            return data;
        } catch (error) {
            console.error(`Error in updateStatut(${id}):`, error);
            throw error;
        }
    },

    // Delete document
    delete: async (id: number) => {
        try {
            console.log(`API Call: DELETE ${API_URL}/api/pieces-justificatives/${id}`);

            const response = await fetchWithAuth(`${API_URL}/api/pieces-justificatives/${id}`, {
                method: 'DELETE',
            });

            console.log(`Response: ${response.status} ${response.statusText}`);

            if (!response.ok) {
                throw new Error('Erreur lors de la suppression du document');
            }

            console.log(`Document ${id} successfully deleted`);
            // Returning the JSON response instead of just true
            return await response.json();
        } catch (error) {
            console.error(`Error in delete(${id}):`, error);
            throw error;
        }
    },

    // Get download URL for a file - updated path
    getDownloadUrl: (fileName: string) => {
        return `${API_URL}/api/files/${fileName}`; // Changed from /api/pieces-justificatives/download/
    },

    // For compatibility with existing code - upload multiple files
    uploadMultiple: async (collaborateurId: number, files: File[], types: string[]): Promise<PieceJustificative[]> => {
        const results = [];
        console.log(`Starting upload of ${files.length} files for collaborateur ${collaborateurId}`);

        for (let i = 0; i < files.length; i++) {
            try {
                console.log(`Uploading file ${i+1}/${files.length}: ${files[i].name}`);
                const result = await pieceJustificativeService.create({
                    nom: files[i].name,
                    type: types[i],
                    collaborateurId: collaborateurId
                }, files[i]);

                results.push(result);
            } catch (error) {
                console.error(`Error uploading file ${i+1}/${files.length}:`, error);
                // Continue with other files even if one fails
            }
        }

        console.log(`Successfully uploaded ${results.length}/${files.length} files`);
        return results;
    }
};

export default api;