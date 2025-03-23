import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    console.log('Received upload request');

    try {
        const formData = await req.formData();

        // Log the keys for debugging
        console.log('Form data keys:', Array.from(formData.keys()));

        // Get the pieceJustificative data and file from the form
        const pieceJustificativeData = formData.get('pieceJustificative');
        const file = formData.get('file') as File;

        if (!pieceJustificativeData || !file) {
            console.error('Missing data:', {
                hasPieceJustificative: !!pieceJustificativeData,
                hasFile: !!file
            });
            return NextResponse.json(
                { error: 'Données ou fichier manquants' },
                { status: 400 }
            );
        }

        // Parse the pieceJustificative data safely
        let pieceJustificative;
        try {
            // Handle different types of input (string or Blob)
            if (pieceJustificativeData instanceof Blob) {
                const pieceJustificativeText = await pieceJustificativeData.text();
                console.log('PieceJustificative text:', pieceJustificativeText);
                pieceJustificative = JSON.parse(pieceJustificativeText);
            } else if (typeof pieceJustificativeData === 'string') {
                console.log('PieceJustificative string:', pieceJustificativeData);
                pieceJustificative = JSON.parse(pieceJustificativeData);
            } else {
                // Assume it's already an object (FormData can serialize objects in some contexts)
                pieceJustificative = pieceJustificativeData;
            }
        } catch (parseError) {
            console.error('Error parsing pieceJustificative:', parseError);
            console.log('Raw data:', pieceJustificativeData);
            return NextResponse.json(
                { error: 'Format de données invalide pour pieceJustificative' },
                { status: 400 }
            );
        }

        // Log file details
        console.log('File details:', {
            name: file.name,
            type: file.type,
            size: file.size
        });

        console.log('Parsed pieceJustificative:', pieceJustificative);

        // Forward the request to your backend API
        const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
        console.log(`Sending request to backend: ${backendUrl}/api/pieces-justificatives`);

        // Create a new FormData to send to the backend
        const apiFormData = new FormData();
        apiFormData.append('file', file);

        // Safely append fields
        if (pieceJustificative) {
            if (pieceJustificative.collaborateurId) {
                apiFormData.append('collaborateurId', pieceJustificative.collaborateurId.toString());
            }
            if (pieceJustificative.nom) {
                apiFormData.append('nom', pieceJustificative.nom);
            }
            if (pieceJustificative.type) {
                apiFormData.append('type', pieceJustificative.type);
            }
            apiFormData.append('description', pieceJustificative.description || '');
        }

        // Send to your backend
        const backendResponse = await fetch(`${backendUrl}/api/pieces-justificatives`, {
            method: 'POST',
            body: apiFormData,
        });

        // Handle non-JSON responses
        const contentType = backendResponse.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            const textResponse = await backendResponse.text();
            console.log('Non-JSON response:', textResponse);

            if (!backendResponse.ok) {
                throw new Error(`Error ${backendResponse.status}: ${textResponse}`);
            }

            // If response is successful but not JSON, return a simple success message
            return NextResponse.json({ success: true, message: 'Upload successful' });
        }

        // Handle JSON responses
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