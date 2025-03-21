// services/authUser.ts
import { AuthUserResponse, LoginUserRequest } from '../types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export const authUserService = {
    async login(credentials: LoginUserRequest): Promise<AuthUserResponse> {
        try {
            const response = await fetch(`${API_URL}/api/auth/user/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Erreur de connexion');
            }

            const data: AuthUserResponse = await response.json();

            // Stocker les informations dans localStorage
            localStorage.setItem('userToken', data.token);
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

    async getUserProfile(cin: string): Promise<any> {
        try {
            const token = localStorage.getItem('userToken');

            if (!token) {
                throw new Error('Non authentifié');
            }

            const response = await fetch(`${API_URL}/api/auth/user/profile?cin=${cin}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Erreur lors de la récupération du profil');
            }

            return await response.json();
        } catch (error) {
            console.error('Erreur lors de la récupération du profil:', error);
            throw error;
        }
    },

    logout() {
        localStorage.removeItem('userToken');
        localStorage.removeItem('userInfo');
        // Rediriger vers la page de connexion
        window.location.href = '/loginUser';
    },

    isAuthenticated(): boolean {
        if (typeof window === 'undefined') return false;
        return !!localStorage.getItem('userToken');
    },

    isPasswordResetRequired(): boolean {
        if (typeof window === 'undefined') return false;
        const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
        return userInfo.resetPassword === true;
    },

    async changePassword(id: number, newPassword: string): Promise<void> {
        try {
            const token = localStorage.getItem('userToken');

            if (!token) {
                throw new Error('Non authentifié');
            }

            const response = await fetch(`${API_URL}/api/auth/user/change-password`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id, newPassword }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Erreur lors du changement de mot de passe');
            }

            // Mettre à jour l'information resetPassword en localStorage
            const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
            userInfo.resetPassword = false;
            localStorage.setItem('userInfo', JSON.stringify(userInfo));
        } catch (error) {
            console.error('Erreur lors du changement de mot de passe:', error);
            throw error;
        }
    }
};

export default authUserService;