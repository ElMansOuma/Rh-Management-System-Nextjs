// app/api/auth/register/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

        // Envoyer la requête à votre backend Spring Boot
        const response = await fetch('http://localhost:8080/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            return NextResponse.json(
                { message: errorData.message || 'Échec de l\'inscription' },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Register API error:', error);
        return NextResponse.json(
            { message: 'Erreur interne du serveur' },
            { status: 500 }
        );
    }
}