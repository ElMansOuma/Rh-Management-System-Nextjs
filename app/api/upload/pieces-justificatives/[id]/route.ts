// File path: app/api/upload/pieces-justificatives/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        // Récupérer les données du formulaire
        const formData = await request.formData();
        const id = params.id;

        if (!id) {
            return NextResponse.json(
                { error: "ID manquant pour la mise à jour" },
                { status: 400 }
            );
        }

        // Vérifier si pieceJustificative est présent
        if (!formData.has('pieceJustificative')) {
            console.error('Missing pieceJustificative data');
            return NextResponse.json(
                { error: "Données de formulaire incomplètes. 'pieceJustificative' est requis." },
                { status: 400 }
            );
        }

        // Récupérer l'URL du backend
        const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
        if (!backendUrl) {
            console.error('Backend URL not configured');
            return NextResponse.json(
                { error: "L'URL du backend n'est pas configurée." },
                { status: 500 }
            );
        }

        // Récupérer le token d'authentification
        let authToken = request.headers.get('Authorization');

        // Si pas dans les headers, chercher dans les cookies
        if (!authToken) {
            const cookieString = request.headers.get('cookie') || '';
            const cookies = parseCookies(cookieString);

            authToken = cookies['userToken'] || cookies['token'] || cookies['auth'] || cookies['jwt'];
        }

        const requestHeaders: HeadersInit = new Headers();

        if (authToken) {
            requestHeaders.set('Authorization',
                authToken.startsWith('Bearer ') ? authToken : `Bearer ${authToken}`
            );
        }

        // Récupérer le token CSRF si il existe
        const cookieString = request.headers.get('cookie') || '';
        const cookies = parseCookies(cookieString);
        const csrfToken = cookies['XSRF-TOKEN'];

        if (csrfToken) {
            requestHeaders.set('X-CSRF-TOKEN', csrfToken);
        }

        // Construire l'URL complète pour la mise à jour
        const apiUrl = `${backendUrl}/api/pieces-justificatives/${id}`;

        console.log(`Sending PUT request to backend: ${apiUrl}`);
        console.log('Form data keys:', Array.from(formData.keys()));

        // Faire la requête PUT au backend
        const response = await fetch(apiUrl, {
            method: 'PUT',
            body: formData,
            headers: requestHeaders,
            credentials: 'include',
        });

        // Gérer la réponse
        if (!response.ok) {
            let errorText;
            try {
                const errorData = await response.json();
                errorText = errorData.message || JSON.stringify(errorData);
            } catch (e) {
                errorText = await response.text();
            }

            console.error('Backend error:', response.status, errorText);
            return NextResponse.json(
                { error: `Erreur ${response.status}: ${errorText}` },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error processing update request:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Erreur inconnue' },
            { status: 500 }
        );
    }
}

// Fonction utilitaire pour parser les cookies à partir d'une chaîne
function parseCookies(cookieString: string): Record<string, string> {
    const cookies: Record<string, string> = {};

    if (cookieString) {
        cookieString.split(';').forEach(cookie => {
            const parts = cookie.split('=');
            if (parts.length >= 2) {
                const name = parts[0].trim();
                const value = parts.slice(1).join('=').trim();
                cookies[name] = value;
            }
        });
    }

    return cookies;
}