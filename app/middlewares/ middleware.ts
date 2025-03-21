// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // Only check cookies in middleware - localStorage isn't available server-side
    const token = request.cookies.get('userToken')?.value;
    const path = request.nextUrl.pathname;

    // Define protected paths
    const isProtectedRoute = path.startsWith('/salarie/');
    const isAuthRoute = path.startsWith('/loginUser') || path.startsWith('/registerUser');

    // If user is trying to access protected routes without token, redirect to login
    if (isProtectedRoute && !token) {
        const loginUrl = new URL('/loginUser', request.url);
        loginUrl.searchParams.set('callbackUrl', path);
        return NextResponse.redirect(loginUrl);
    }

    // If user is already logged in and trying to access login/register pages
    if (isAuthRoute && token) {
        return NextResponse.redirect(new URL('/salarie/dashboard', request.url));
    }

    // Allow the request to proceed otherwise
    return NextResponse.next();
}

// Configure middleware to run only on specific paths
export const config = {
    matcher: [
        '/salarie/:path*',
        '/loginUser',
        '/registerUser',
    ],
};