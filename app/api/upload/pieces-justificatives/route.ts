// This should go in your app/api/upload/pieces-justificatives/route.ts file

import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    console.log('Received upload request');

    try {
        const formData = await req.formData();

        // Log the keys for debugging
        console.log('Form data keys:', Array.from(formData.keys()));

        // Get the pieceJustificative data and file from the form
        const pieceJustificativeBlob = formData.get('pieceJustificative') as Blob;
        const file = formData.get('file') as File;

        if (!pieceJustificativeBlob || !file) {
            return NextResponse.json(
                { error: 'Données ou fichier manquants' },
                { status: 400 }
            );
        }

        // Convert the pieceJustificative blob to JSON
        const pieceJustificativeText = await pieceJustificativeBlob.text();
        const pieceJustificative = JSON.parse(pieceJustificativeText);

        // Log file details
        console.log('File details:', {
            name: file.name,
            type: file.type,
            size: file.size
        });

        // Forward the request to your backend API
        const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
        console.log(`Sending request to backend: ${backendUrl}/api/pieces-justificatives`);

        // Create a new FormData to send to the backend
        const apiFormData = new FormData();
        apiFormData.append('file', file);
        apiFormData.append('collaborateurId', pieceJustificative.collaborateurId.toString());
        apiFormData.append('nom', pieceJustificative.nom);
        apiFormData.append('type', pieceJustificative.type);
        apiFormData.append('description', pieceJustificative.description || '');

        // Send to your backend
        const backendResponse = await fetch(`${backendUrl}/api/pieces-justificatives`, {
            method: 'POST',
            body: apiFormData,
        });

        if (!backendResponse.ok) {
            const errorData = await backendResponse.json();
            throw new Error(errorData.message || `Error ${backendResponse.status}`);
        }

        const responseData = await backendResponse.json();
        console.log('Upload successful, returning data to client');

        return NextResponse.json(responseData);
    } catch (error) {
        console.error('Error processing upload:', error);

        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Une erreur est survenue' },
            { status: 500 }
        );
    }
}