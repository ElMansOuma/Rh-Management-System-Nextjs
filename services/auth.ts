import Cookies from 'js-cookie';
//pour stocker et récupérer le token d'authentification dans les cookies du navigateur

export interface User {
    name: string;
    email: string;
    role: string;
}

// définir le token dans localStorage et dans un cookie
export const setToken = (token: string): void => {
    if (typeof window !== 'undefined') { // Vérifie si le code s'exécute côté client (navigateur)
        localStorage.setItem('token', token); // Sauvegarde le token dans localStorage
        Cookies.set('token', token, { expires: 7 }); // Sauvegarde le token dans un cookie, expire après 7 jours
    }
};

//  définir l'utilisateur dans localStorage
export const setUser = (user: User): void => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(user)); // Sauvegarde l'objet utilisateur sous forme de chaîne JSON dans localStorage
    }
};

// récupérer le token depuis localStorage
export const getToken = (): string | null => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('token'); // Retourne le token stocké dans localStorage, ou null si absent
    }
    return null;
};

// récupérer l'utilisateur depuis localStorage
export const getUser = (): User | null => {
    if (typeof window !== 'undefined') {
        const userStr = localStorage.getItem('user'); // Récupère la chaîne JSON de l'utilisateur dans localStorage
        if (userStr) {
            return JSON.parse(userStr); // Parse la chaîne JSON en un objet JavaScript
        }
    }
    return null;
};

//vérifier si l'utilisateur est authentifié (token présent dans localStorage)
export const isAuthenticated = (): boolean => {
    return getToken() !== null;
};

//déconnecter l'utilisateur
export const logout = (): void => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        Cookies.remove('token');
        window.location.href = '/login';
    }
};

// effectuer une requête avec un en-tête d'authentification (Bearer token)
export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    const token = getToken(); // Récupère le token de localStorage

    const headers = {
        ...options.headers, // Conserve les autres en-têtes éventuellement passés dans options
        'Authorization': token ? `Bearer ${token}` : '', // Ajoute un en-tête d'authentification si le token existe
        'Content-Type': 'application/json', // Définit le type de contenu de la requête en JSON
    };

    const response = await fetch(url, { // Envoie la requête avec les en-têtes spécifiés
        ...options,
        headers,
    });

    if (response.status === 401) { // Si la réponse indique que la session a expiré (code 401)
        logout(); // Déconnecte l'utilisateur
        throw new Error('Session expirée. Veuillez vous reconnecter.'); // Lève une erreur
    }

    return response; // Retourne la réponse de la requête
};