// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('userToken')?.value;
    const path = request.nextUrl.pathname;

    // Journalisation pour le débogage
    console.log('Middleware vérifie:', {
        path,
        tokenPresent: !!token
    });

    // Définition des routes protégées
    const isProtectedRoute = path.startsWith('/salarie/');
    const isAuthRoute = path === '/loginUser';

    // Redirection si la route est protégée et que l'utilisateur n'est pas authentifié
    if (isProtectedRoute && !token) {
        const loginUrl = new URL('/loginUser', request.url);
        loginUrl.searchParams.set('callbackUrl', path);
        return NextResponse.redirect(loginUrl);
    }

    // Redirection si l'utilisateur est connecté et essaie d'accéder à la page de connexion
    if (isAuthRoute && token) {
        return NextResponse.redirect(new URL('/salarie/dashboard', request.url));
    }

    return NextResponse.next();
}

// Configuration du middleware
export const config = {
    matcher: [
        '/salarie/:path*',
        '/loginUser'
    ],
};