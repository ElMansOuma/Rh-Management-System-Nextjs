// services/auth.ts

export interface User {
    name: string;
    email: string;
    role: string;
}

export const getToken = (): string | null => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('token');
    }
    return null;
};

export const getUser = (): User | null => {
    if (typeof window !== 'undefined') {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            return JSON.parse(userStr);
        }
    }
    return null;
};

export const isAuthenticated = (): boolean => {
    return getToken() !== null;
};

export const logout = (): void => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    }
};

export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    const token = getToken();

    const headers = {
        ...options.headers,
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
    };

    const response = await fetch(url, {
        ...options,
        headers,
    });

    if (response.status === 401) {
        // Token expiré ou invalide
        logout();
        throw new Error('Session expirée. Veuillez vous reconnecter.');
    }

    return response;
};