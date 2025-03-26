// Middleware pour vérifier l’authentification.
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // Récupérer le token depuis localStorage n'est pas possible dans le middleware
    // car il s'exécute sur le serveur. Utilisez plutôt les cookies.
    const token = request.cookies.get('token')?.value;

    // Vérifier si l'utilisateur tente d'accéder à une route protégée
    const isProtectedRoute = request.nextUrl.pathname.startsWith('/(protected)/Admin') ||
        request.nextUrl.pathname.includes('/dashboard') ||
        request.nextUrl.pathname.includes('/profil') ||
        request.nextUrl.pathname.includes('/collaborateurs') ||
        request.nextUrl.pathname.includes('/conges') ||
        request.nextUrl.pathname.includes('/contrats') ||
        request.nextUrl.pathname.includes('/pointage');

    // Si c'est une route protégée et que l'utilisateur n'est pas connecté
    if (isProtectedRoute && !token) {
        // Rediriger vers la page de connexion
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // Si l'utilisateur est connecté et essaie d'accéder à la page de connexion ou d'inscription
    const isAuthPage = request.nextUrl.pathname.includes('/login') ||
        request.nextUrl.pathname.includes('/register');

    if (isAuthPage && token) {
        // Rediriger vers le tableau de bord
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
}

// Spécifiez les chemins sur lesquels le middleware doit s'exécuter
export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
    ],
};