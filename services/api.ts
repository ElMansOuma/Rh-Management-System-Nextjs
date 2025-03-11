// utils/api.ts
export async function fetchCollaborateurs() {
    const res = await fetch("http://localhost:8080/api/collaborateurs");
    if (!res.ok) throw new Error("Erreur lors du chargement des collaborateurs");
    return res.json();
}

export async function addCollaborateur(collaborateur: any) {
    const res = await fetch("http://localhost:8080/api/collaborateurs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(collaborateur)
    });
    if (!res.ok) throw new Error("Erreur lors de l'ajout du collaborateur");
    return res.json();
}

export async function updateCollaborateur(id: number, collaborateur: any) {
    const res = await fetch(`http://localhost:8080/api/collaborateurs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(collaborateur)
    });
    if (!res.ok) throw new Error("Erreur lors de la mise à jour");
    return res.json();
}

export async function deleteCollaborateur(id: number) {
    const res = await fetch(`http://localhost:8080/api/collaborateurs/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Erreur lors de la suppression");
}
