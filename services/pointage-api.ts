import { PointageRequest, PointageEntry } from '@/types/pointage';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

const pointageService = {
    async createPointage(data: PointageRequest): Promise<PointageEntry> {
        try {
            const token = localStorage.getItem('userToken');
            const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
            if (!token) {
                throw new Error('Non authentifié');
            }
            const response = await fetch(`${API_URL}/api/pointage?cin=${userInfo.cin}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ type: data.type })
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Erreur lors de l\'enregistrement du pointage');
            }
            return await response.json();
        } catch (error) {
            console.error('Erreur de pointage:', error);
            throw error;
        }
    },

    async getTodayPointage(): Promise<PointageEntry | null> {
        try {
            const token = localStorage.getItem('userToken');
            const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
            if (!token) {
                throw new Error('Non authentifié');
            }
            const response = await fetch(`${API_URL}/api/pointage/today?cin=${userInfo.cin}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (response.status === 204) {
                return null;
            }
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Erreur lors de la récupération du pointage');
            }
            return await response.json();
        } catch (error) {
            console.error('Erreur de récupération du pointage:', error);
            throw error;
        }
    },

    async getUserPointages(month?: string, year?: number): Promise<PointageEntry[]> {
        try {
            const token = localStorage.getItem('userToken');
            const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
            if (!token) {
                throw new Error('Non authentifié');
            }
            const url = new URL(`${API_URL}/api/pointage/user`);
            url.searchParams.append('cin', userInfo.cin);
            if (month) url.searchParams.append('month', month);
            if (year) url.searchParams.append('year', year.toString());
            const response = await fetch(url.toString(), {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Erreur lors de la récupération des pointages');
            }
            return await response.json();
        } catch (error) {
            console.error('Erreur de récupération des pointages:', error);
            throw error;
        }
    },
    async getAllPointages(month?: string, year?: number): Promise<PointageEntry[]> {
        try {
            const token = localStorage.getItem('userToken');
            if (!token) {
                throw new Error('Non authentifié');
            }

            const url = new URL(`${API_URL}/api/pointage/admin/all`);

            // Ajouter les paramètres de filtrage
            if (month) url.searchParams.append('month', month);
            if (year) url.searchParams.append('year', year.toString());

            const response = await fetch(url.toString(), {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Erreur lors de la récupération des pointages');
            }

            return await response.json();
        } catch (error) {
            console.error('Erreur de récupération des pointages:', error);
            throw error;
        }
    },

};


export default pointageService;