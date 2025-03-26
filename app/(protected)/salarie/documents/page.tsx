// app/(protected)/salarie/documents/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { FileText, Download, Eye, Clock, Search, AlertCircle } from 'lucide-react';
import { pieceJustificativeService } from '../../../../services/api';
import { useAuth } from '../../../../hooks/useAuth';

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
    fichierUrl?: string; // Pour le téléchargement
};

// Map pour convertir les types de documents de l'API vers les catégories de l'interface
const typeToCategory: Record<string, Exclude<DocumentCategory, 'all'>> = {
    "CONTRAT": "contracts",
    "CV": "other",
    "DIPLOME": "certificates",
    "PIECE_IDENTITE": "other",
    "CERTIFICAT": "certificates",
    "AUTRE": "other",
    "BULLETIN_PAIE": "payslips"
};

export default function DocumentsPage() {
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [activeCategory, setActiveCategory] = useState<DocumentCategory>('all');
    const [documents, setDocuments] = useState<Document[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const { user } = useAuth(); // Récupérer l'utilisateur connecté

    // Catégories de documents
    const categories: CategoryItem[] = [
        { id: 'all', name: 'Tous' },
        { id: 'payslips', name: 'Bulletins de paie' },
        { id: 'contracts', name: 'Contrats' },
        { id: 'certificates', name: 'Attestations' },
        { id: 'other', name: 'Autres' }
    ];

    useEffect(() => {
        async function fetchDocuments() {
            try {
                setLoading(true);
                // Vérifier si l'utilisateur est connecté et a un ID
                if (!user || !user.id) {
                    setError("Vous devez être connecté pour voir vos documents.");
                    setLoading(false);
                    return;
                }

                console.log("Récupération des documents pour l'utilisateur ID:", user.id);

                // Récupérer les pièces justificatives du collaborateur
                const pieces = await pieceJustificativeService.getAllByCollaborateur(user.id);

                if (!pieces || pieces.length === 0) {
                    console.log("Aucun document trouvé pour cet utilisateur");
                }

                // Convertir les pièces justificatives en format document pour l'UI
                const formattedDocs = pieces.map(piece => {
                    // Extraction de la date à partir de l'URL du fichier ou utilisation de la date actuelle
                    const dateStr = piece.fichierUrl?.split('_')[0];
                    const documentDate = dateStr ? new Date(dateStr) : new Date();

                    return {
                        id: piece.id as number,
                        title: piece.nom || "Document sans titre",
                        date: documentDate.toLocaleDateString('fr-FR'),
                        category: typeToCategory[piece.type] || 'other',
                        icon: <FileText className={`w-5 h-5 ${getCategoryColor(typeToCategory[piece.type] || 'other')}`} />,
                        fichierUrl: piece.fichierUrl
                    };
                });

                setDocuments(formattedDocs);
            } catch (err) {
                console.error('Erreur lors de la récupération des documents:', err);
                setError('Impossible de charger les documents. Veuillez réessayer plus tard.');
            } finally {
                setLoading(false);
            }
        }

        fetchDocuments();
    }, [user]);

    // Obtenir la couleur en fonction de la catégorie
    const getCategoryColor = (category: Exclude<DocumentCategory, 'all'>): string => {
        switch (category) {
            case 'payslips':
                return 'text-blue-500';
            case 'contracts':
                return 'text-green-500';
            case 'certificates':
                return 'text-purple-500';
            case 'other':
                return 'text-orange-500';
            default:
                return 'text-gray-500';
        }
    };

    // Filtrer les documents par catégorie et recherche
    const filteredDocuments = documents.filter(doc => {
        const matchesCategory = activeCategory === 'all' || doc.category === activeCategory;
        const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    // Fonction pour télécharger un document
    const downloadDocument = (doc: Document): void => {
        if (doc.fichierUrl) {
            const downloadUrl = pieceJustificativeService.getDownloadUrl(doc.fichierUrl);
            window.open(downloadUrl, '_blank');
        }
    };

    // Fonction pour prévisualiser un document
    const previewDocument = (doc: Document): void => {
        if (doc.fichierUrl) {
            const previewUrl = pieceJustificativeService.getDownloadUrl(doc.fichierUrl);
            window.open(previewUrl, '_blank');
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Mes Documents</h1>

            {!user && (
                <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-md">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <AlertCircle className="h-5 w-5 text-yellow-400" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-yellow-700">
                                Vous devez être connecté pour voir vos documents. Veuillez vous connecter avec votre CIN.
                            </p>
                        </div>
                    </div>
                </div>
            )}

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
                {loading ? (
                    <div className="p-6 text-center">
                        <div className="animate-spin inline-block w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full mb-2"></div>
                        <p>Chargement des documents...</p>
                    </div>
                ) : error ? (
                    <div className="p-6 text-center text-red-500">
                        <AlertCircle className="h-6 w-6 mx-auto mb-2" />
                        <p>{error}</p>
                    </div>
                ) : (
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
                                                onClick={() => previewDocument(document)}
                                                className="text-indigo-600 hover:text-indigo-900 mr-4"
                                                disabled={!document.fichierUrl}
                                                title="Prévisualiser"
                                            >
                                                <Eye className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => downloadDocument(document)}
                                                className="text-green-600 hover:text-green-900"
                                                disabled={!document.fichierUrl}
                                                title="Télécharger"
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
                )}
            </div>
        </div>
    );
}