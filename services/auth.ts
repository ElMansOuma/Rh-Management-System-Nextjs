"use client";

import Cookies from 'js-cookie';

// Interface définissant la structure d'un utilisateur
export interface User {
    name: string;
    email: string;
    role: string;
}

/**
 * Stocke le token d'authentification à la fois dans localStorage et dans un cookie
 * @param token - Le token JWT à stocker
 */
export const setToken = (token: string): void => {
    if (typeof window !== 'undefined') { // Vérifie si le code s'exécute côté client
        localStorage.setItem('token', token);
        Cookies.set('token', token, { expires: 7 }); // Cookie expirant après 7 jours
    }
};

/**
 * Stocke les informations utilisateur dans localStorage
 * @param user - L'objet utilisateur à stocker
 */
export const setUser = (user: User): void => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(user));
    }
};

/**
 * Récupère le token d'authentification depuis localStorage
 * @returns Le token stocké ou null si absent
 */
export const getToken = (): string | null => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('token');
    }
    return null;
};

/**
 * Récupère les informations utilisateur depuis localStorage
 * @returns L'objet utilisateur ou null si absent
 */
export const getUser = (): User | null => {
    if (typeof window !== 'undefined') {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            return JSON.parse(userStr);
        }
    }
    return null;
};

/**
 * Vérifie si l'utilisateur est authentifié
 * @returns true si un token est présent, false sinon
 */
export const isAuthenticated = (): boolean => {
    return getToken() !== null;
};

/**
 * Déconnecte l'utilisateur en supprimant toutes les données d'authentification
 * et redirige vers la page de connexion
 */
export const logout = (): void => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        Cookies.remove('token');
        window.location.href = '/login';
    }
};

/**
 * Effectue une requête HTTP avec le token d'authentification
 * @param url - L'URL de la requête
 * @param options - Les options de la requête fetch
 * @returns La réponse de la requête
 * @throws Error si la session a expiré (code 401)
 */
export const fetchWithAuth = async (url: string, options: RequestInit = {}): Promise<Response> => {
    const token = getToken();

    // Création d'un nouvel objet Headers pour manipuler les en-têtes correctement
    const headers = new Headers(options.headers || {});

    // Ajout de l'en-tête d'autorisation si un token existe
    if (token) {
        headers.set('Authorization', `Bearer ${token}`);
    }

    // Ajout du Content-Type pour les requêtes qui en ont besoin (sauf FormData)
    if (!(options.body instanceof FormData)) {
        // Ne définir Content-Type que s'il n'est pas déjà défini
        if (!headers.has('Content-Type') && (options.method === 'POST' || options.method === 'PUT' || options.method === 'PATCH')) {
            headers.set('Content-Type', 'application/json');
        }
    } else {
        // Si c'est un FormData, s'assurer que Content-Type n'est pas défini
        headers.delete('Content-Type');
    }

    const response = await fetch(url, {
        ...options,
        headers
    });

    // Gestion automatique de l'expiration de session
    if (response.status === 401) {
        logout();
        throw new Error('Session expirée. Veuillez vous reconnecter.');
    }

    return response;
};