export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        // Get the CIN parameter from the URL
        const searchParams = request.nextUrl.searchParams;
        const cin = searchParams.get('cin');

        if (!cin) {
            return NextResponse.json({ error: 'CIN parameter is required' }, { status: 400 });
        }

        // Get the authorization token from the request headers
        const authHeader = request.headers.get('authorization');

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Authentication token is required' }, { status: 401 });
        }

        const token = authHeader.substring(7); // Remove 'Bearer ' prefix

        console.log(`Fetching profile for CIN: ${cin}, with token: ${token.substring(0, 10)}...`);

        // Make a request to your Spring backend
        // NOTE: Using the endpoint path that matches your Spring controller
        const response = await fetch(`http://localhost:8080/api/auth/user/profile?cin=${cin}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        console.log(`Backend response status: ${response.status}`);

        if (!response.ok) {
            // Handle non-successful responses
            let errorMessage;
            try {
                const errorData = await response.json();
                errorMessage = errorData.message || `Failed to fetch data: ${response.statusText}`;
            } catch (e) {
                errorMessage = `Failed to fetch data: ${response.statusText}`;
            }

            console.error(`Error response from backend: ${errorMessage}`);

            return NextResponse.json(
                { error: errorMessage },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error: any) {
        console.error('Error in API route:', error);
        return NextResponse.json(
            { error: 'Internal server error', details: error?.message || 'Unknown error' },
            { status: 500 }
        );
    }
}