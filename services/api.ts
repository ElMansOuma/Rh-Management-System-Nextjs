// C:\Users\DELL\Downloads\managerhr\project\services\api.ts

// Type pour les collaborateurs conforme à votre backend
export interface Collaborateur {
    id?: number;
    nom: string;
    prenom: string;
    cin: string;
    dateNaissance: string;
    lieuNaissance: string;
    adresseDomicile: string; // Notez que le backend utilise adresseDomicile au lieu de adresse
    adresse?: string; // Optional property to handle legacy data
    cnss: string;
    origine: string;
    niveauEtude: string;
    specialite: string;
    dateEntretien: string;
    dateEmbauche: string;
    description: string;
    piecesJustificatives?: any[];
}

// URL de base de l'API
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// Service pour les collaborateurs
export const collaborateurService = {
    // Récupérer tous les collaborateurs
    getAll: async (): Promise<Collaborateur[]> => {
        const response = await fetch(`${API_URL}/api/collaborateurs`);
        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des collaborateurs');
        }
        return await response.json();
    },

    // Récupérer un collaborateur par ID
    getById: async (id: number): Promise<Collaborateur> => {
        const response = await fetch(`${API_URL}/api/collaborateurs/${id}`);
        if (!response.ok) {
            throw new Error('Collaborateur non trouvé');
        }
        return await response.json();
    },

    // Créer un nouveau collaborateur
    create: async (collaborateur: Collaborateur): Promise<Collaborateur> => {
        // Adapter les noms de champs si nécessaire
        const adaptedCollaborateur = {
            ...collaborateur,
            adresseDomicile: collaborateur.adresseDomicile || collaborateur.adresse,
        };

        delete (adaptedCollaborateur as any).adresse;

        const response = await fetch(`${API_URL}/api/collaborateurs`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(adaptedCollaborateur),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(errorData?.message || 'Erreur lors de la création du collaborateur');
        }

        return await response.json();
    },

    // Mettre à jour un collaborateur
    update: async (id: number, collaborateur: Collaborateur): Promise<Collaborateur> => {
        // Adapter les noms de champs si nécessaire
        const adaptedCollaborateur = {
            ...collaborateur,
            adresseDomicile: collaborateur.adresseDomicile || collaborateur.adresse,
        };

        delete (adaptedCollaborateur as any).adresse;

        const response = await fetch(`${API_URL}/api/collaborateurs/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(adaptedCollaborateur),
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la mise à jour du collaborateur');
        }

        return await response.json();
    },

    // Supprimer un collaborateur
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