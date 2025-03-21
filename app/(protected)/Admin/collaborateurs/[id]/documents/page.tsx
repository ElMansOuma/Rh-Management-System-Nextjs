// File: app/(protected)/collaborateurs/[id]/documents/page.tsx

import PieceJustificativePage from "@/app/(protected)/Admin/PieceJustificative/page";

export default function DocumentsPage({ params }: { params: { id: string } }) {
    return <PieceJustificativePage params={params} />;
}
export async function generateStaticParams() {
    // Return an array of objects with the id parameter
    return [
        { id: '135' },
        { id: '118' },
        { id: '136' },
        { id: '152' },
        { id: '151' },
    ];
}