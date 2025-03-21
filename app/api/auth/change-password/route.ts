import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        // Extraire les données du corps de la requête
        const body = await request.json();
        const { id, newPassword } = body;

        if (!id || !newPassword) {
            return NextResponse.json(
                { message: "ID et nouveau mot de passe requis" },
                { status: 400 }
            );
        }

        // Récupérer le token du header Authorization
        const token = request.headers.get("Authorization")?.split(" ")[1];

        if (!token) {
            return NextResponse.json(
                { message: "Non autorisé" },
                { status: 401 }
            );
        }

        // Faire une requête vers le backend Spring Boot
        const response = await fetch(`${process.env.BACKEND_API_URL}/api/auth/user/change-password?id=${id}&newPassword=${newPassword}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json(
                { message: errorData.message || "Erreur lors du changement de mot de passe" },
                { status: response.status }
            );
        }

        return NextResponse.json(
            { message: "Mot de passe modifié avec succès" },
            { status: 200 }
        );

    } catch (error) {
        console.error("Erreur lors du changement de mot de passe:", error);
        return NextResponse.json(
            { message: "Une erreur est survenue" },
            { status: 500 }
        );
    }
}