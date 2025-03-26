// services/authUserService.ts
import Cookies from 'js-cookie';

export interface LoginUserRequest {
    cin: string;
    password: string;
}

export interface AuthUserResponse {
    token: string;
    id: number;
    cin: string;
    nom: string;
    prenom: string;
    resetPassword?: boolean;
}

export interface PointageRequest {
    type: 'ARRIVEE' | 'DEPART';
}

export interface PointageDTO {
    id?: number;
    type: 'ARRIVEE' | 'DEPART';
    timestamp: string;
}

export const authUserService = {
    async login(credentials: LoginUserRequest): Promise<AuthUserResponse> {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/user/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),
            });

            if (!response.ok) {
                const error = await response.text();
                throw new Error(error || 'Erreur de connexion');
            }

            const data: AuthUserResponse = await response.json();

            // Stockage sécurisé du token
            localStorage.setItem('userToken', data.token);
            Cookies.set('userToken', data.token, {
                path: '/',
                expires: 1 // Expiration en 1 jour
            });

            // Stockage des informations utilisateur
            localStorage.setItem('userInfo', JSON.stringify({
                id: data.id,
                nom: data.nom,
                prenom: data.prenom,
                cin: data.cin,
                resetPassword: data.resetPassword
            }));

            return data;
        } catch (error) {
            console.error('Erreur d\'authentification:', error);
            throw error;
        }
    },

    logout() {
        // Suppression des tokens et informations
        localStorage.removeItem('userToken');
        localStorage.removeItem('userInfo');
        Cookies.remove('userToken');

        // Redirection vers la page de connexion
        window.location.href = '/loginUser';
    },

    isAuthenticated(): boolean {
        return !!localStorage.getItem('userToken');
    }
};

// services/pointageService.ts
export const pointageService = {
    async createPointage(cin: string, type: 'ARRIVEE' | 'DEPART'): Promise<PointageDTO> {
        const token = localStorage.getItem('userToken');

        if (!token) {
            throw new Error('Non authentifié');
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pointage/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    cin,
                    type
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Détails de l\'erreur:', errorText);

                if (response.status === 403) {
                    authUserService.logout();
                    throw new Error('Accès non autorisé');
                }

                throw new Error(`Erreur HTTP: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erreur de pointage:', error);
            throw error;
        }
    },

    async getTodayPointage(cin: string): Promise<PointageDTO | null> {
        const token = localStorage.getItem('userToken');

        if (!token) {
            throw new Error('Non authentifié');
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pointage/today?cin=${cin}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Détails de l\'erreur:', errorText);

                if (response.status === 403) {
                    authUserService.logout();
                    throw new Error('Accès non autorisé');
                }

                if (response.status === 404) {
                    return null; // Aucun pointage trouvé aujourd'hui
                }

                throw new Error(`Erreur HTTP: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erreur de récupération du pointage:', error);
            throw error;
        }
    },

    async getMonthlyPointage(cin: string, month: number, year: number): Promise<PointageDTO[]> {
        const token = localStorage.getItem('userToken');

        if (!token) {
            throw new Error('Non authentifié');
        }

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/pointage/user?cin=${cin}&month=${month}&year=${year}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Détails de l\'erreur:', errorText);

                if (response.status === 403) {
                    authUserService.logout();
                    throw new Error('Accès non autorisé');
                }

                throw new Error(`Erreur HTTP: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erreur de récupération des pointages mensuels:', error);
            throw error;
        }
    }
};