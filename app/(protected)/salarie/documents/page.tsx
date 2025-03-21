// app/(protected)/salarie/documents/page.tsx
"use client";

import { useState } from 'react';
import { FileText, Download, Eye, Clock, Search } from 'lucide-react';

// Définition des types
type DocumentCategory = 'all' | 'payslips' | 'contracts' | 'certificates' | 'other';

type CategoryItem = {
    id: DocumentCategory;
    name: string;
};

type Document = {
    id: number;
    title: string;
    date: string;
    category: Exclude<DocumentCategory, 'all'>;
    icon: JSX.Element;
};

export default function DocumentsPage() {
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [activeCategory, setActiveCategory] = useState<DocumentCategory>('all');

    // Catégories de documents
    const categories: CategoryItem[] = [
        { id: 'all', name: 'Tous' },
        { id: 'payslips', name: 'Bulletins de paie' },
        { id: 'contracts', name: 'Contrats' },
        { id: 'certificates', name: 'Attestations' },
        { id: 'other', name: 'Autres' }
    ];

    // Documents simulés
    const allDocuments: Document[] = [
        {
            id: 1,
            title: 'Bulletin de paie - Février 2025',
            date: '01/03/2025',
            category: 'payslips',
            icon: <FileText className="w-5 h-5 text-blue-500" />
        },
        {
            id: 2,
            title: 'Bulletin de paie - Janvier 2025',
            date: '01/02/2025',
            category: 'payslips',
            icon: <FileText className="w-5 h-5 text-blue-500" />
        },
        {
            id: 3,
            title: 'Contrat de travail',
            date: '15/01/2024',
            category: 'contracts',
            icon: <FileText className="w-5 h-5 text-green-500" />
        },
        {
            id: 4,
            title: 'Attestation de formation',
            date: '10/12/2024',
            category: 'certificates',
            icon: <FileText className="w-5 h-5 text-purple-500" />
        },
        {
            id: 5,
            title: 'Avenant au contrat',
            date: '05/01/2025',
            category: 'contracts',
            icon: <FileText className="w-5 h-5 text-green-500" />
        },
        {
            id: 6,
            title: 'Attestation employeur',
            date: '20/02/2025',
            category: 'certificates',
            icon: <FileText className="w-5 h-5 text-purple-500" />
        },
        {
            id: 7,
            title: 'Note de frais - Janvier 2025',
            date: '15/02/2025',
            category: 'other',
            icon: <FileText className="w-5 h-5 text-orange-500" />
        }
    ];

    // Filtrer les documents par catégorie et recherche
    const filteredDocuments = allDocuments.filter(doc => {
        const matchesCategory = activeCategory === 'all' || doc.category === activeCategory;
        const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    // Fonction pour télécharger un documents (simulée)
    const downloadDocument = (docId: number): void => {
        console.log(`Téléchargement du document ${docId}`);
        // Ici, vous implémenteriez la logique de téléchargement réelle
    };

    // Fonction pour prévisualiser un documents (simulée)
    const previewDocument = (docId: number): void => {
        console.log(`Prévisualisation du document ${docId}`);
        // Ici, vous implémenteriez la logique de prévisualisation réelle
    };

    return (
        <div className="container mx-auto">
            <h1 className="text-2xl font-bold mb-6">Mes Documents</h1>

            {/* Barre de recherche et filtres */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-grow">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Rechercher un document..."
                        className="pl-10 block w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="flex overflow-x-auto pb-2 space-x-2">
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            className={`px-4 py-2 rounded-md whitespace-nowrap ${
                                activeCategory === category.id
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                            onClick={() => setActiveCategory(category.id)}
                        >
                            {category.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Liste des documents */}
            <div className="bg-white rounded-lg shadow-md">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Document
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Date
                            </th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {filteredDocuments.length > 0 ? (
                            filteredDocuments.map((document) => (
                                <tr key={document.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            {document.icon}
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{document.title}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center text-sm text-gray-500">
                                            <Clock className="w-4 h-4 mr-1" />
                                            {document.date}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => previewDocument(document.id)}
                                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                                        >
                                            <Eye className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => downloadDocument(document.id)}
                                            className="text-green-600 hover:text-green-900"
                                        >
                                            <Download className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">
                                    Aucun document trouvé
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Section pour télécharger des documents */}
            <div className="mt-8 bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold mb-4">Demander un document</h2>
                <p className="text-gray-600 mb-4">
                    Vous ne trouvez pas le document que vous cherchez ? Faites une demande auprès du service RH.
                </p>
                <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                    Faire une demande
                </button>
            </div>
        </div>
    );
}