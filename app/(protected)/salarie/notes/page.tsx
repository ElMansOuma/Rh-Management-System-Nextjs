// app/(protected)/salarie/notes/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { PlusCircle, Search, Trash2, Edit, Save, X, Calendar, Tag, Clock } from 'lucide-react';

// Types pour les notes
type Note = {
    id: number;
    title: string;
    content: string;
    date: string;
    tags: string[];
    lastModified: string;
};

export default function Notes() {
    const [notes, setNotes] = useState<Note[]>([]);
    const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTagFilter, setSelectedTagFilter] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);
    const [selectedNote, setSelectedNote] = useState<Note | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [allTags, setAllTags] = useState<string[]>([]);

    // États pour le formulaire d'édition
    const [editTitle, setEditTitle] = useState('');
    const [editContent, setEditContent] = useState('');
    const [editTags, setEditTags] = useState<string[]>([]);
    const [newTagInput, setNewTagInput] = useState('');

    // Effet pour charger les notes simulées
    useEffect(() => {
        setIsLoading(true);

        // Simuler un appel API avec un délai
        setTimeout(() => {
            const mockNotes: Note[] = [
                {
                    id: 1,
                    title: "Réunion d'équipe",
                    content: "Points à discuter lors de la prochaine réunion d'équipe:\n- Avancement du projet X\n- Planification des congés d'été\n- Nouvelles procédures de sécurité",
                    date: "2025-03-15",
                    tags: ["réunion", "équipe", "important"],
                    lastModified: "2025-03-15T10:30:00"
                },
                {
                    id: 2,
                    title: "Formation React",
                    content: "Ressources pour la formation React:\n- Documentation officielle: https://reactjs.org\n- Tutoriel recommandé: React pour les débutants\n- Exercices pratiques à faire avant le 25/03",
                    date: "2025-03-10",
                    tags: ["formation", "développement", "react"],
                    lastModified: "2025-03-12T14:45:00"
                },
                {
                    id: 3,
                    title: "Procédure de demande de congés",
                    content: "1. Soumettre la demande au moins 2 semaines à l'avance\n2. Obtenir l'approbation du responsable\n3. Vérifier la confirmation par email\n4. S'assurer que les tâches sont réassignées",
                    date: "2025-02-28",
                    tags: ["procédure", "congés", "rh"],
                    lastModified: "2025-03-05T09:15:00"
                },
                {
                    id: 4,
                    title: "Idées d'amélioration",
                    content: "Suggestions pour améliorer les processus internes:\n- Automatiser les rapports hebdomadaires\n- Mettre en place un système de partage de connaissances\n- Organiser des sessions de brainstorming mensuelles",
                    date: "2025-03-18",
                    tags: ["idées", "amélioration", "productivité"],
                    lastModified: "2025-03-18T16:20:00"
                }
            ];

            setNotes(mockNotes);
            setFilteredNotes(mockNotes);

            // Extraire tous les tags uniques
            const tags = mockNotes.flatMap(note => note.tags);
            setAllTags([...new Set(tags)]);

            setIsLoading(false);
        }, 1000);
    }, []);

    // Filtrer les notes en fonction de la recherche et du tag sélectionné
    useEffect(() => {
        let filtered = [...notes];

        // Filtrer par tag
        if (selectedTagFilter) {
            filtered = filtered.filter(note =>
                note.tags.includes(selectedTagFilter)
            );
        }

        // Filtrer par recherche
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(note =>
                note.title.toLowerCase().includes(query) ||
                note.content.toLowerCase().includes(query) ||
                note.tags.some(tag => tag.toLowerCase().includes(query))
            );
        }

        setFilteredNotes(filtered);
    }, [notes, searchQuery, selectedTagFilter]);

    // Formater la date
    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        };
        return new Date(dateString).toLocaleDateString('fr-FR', options);
    };

    // Formater l'heure
    const formatTime = (dateTimeString: string) => {
        const options: Intl.DateTimeFormatOptions = {
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(dateTimeString).toLocaleTimeString('fr-FR', options);
    };

    // Sélectionner une note
    const handleSelectNote = (note: Note) => {
        setSelectedNote(note);
        setIsEditing(false);
    };

    // Activer le mode édition
    const handleEditNote = () => {
        if (selectedNote) {
            setEditTitle(selectedNote.title);
            setEditContent(selectedNote.content);
            setEditTags([...selectedNote.tags]);
            setIsEditing(true);
        }
    };

    // Annuler l'édition

    const handleCancelEdit = () => {
        setIsEditing(false);
    };

    // Sauvegarder les modifications
    const handleSaveNote = () => {
        if (selectedNote) {
            const updatedNote: Note = {
                ...selectedNote,
                title: editTitle,
                content: editContent,
                tags: editTags,
                lastModified: new Date().toISOString()
            };

            setNotes(prevNotes =>
                prevNotes.map(note =>
                    note.id === selectedNote.id ? updatedNote : note
                )
            );

            setSelectedNote(updatedNote);
            setIsEditing(false);

            // Mettre à jour la liste de tous les tags
            const allTagsSet = new Set([...allTags, ...editTags]);
            setAllTags([...allTagsSet]);
        }
    };

    // Créer une nouvelle note
    const handleCreateNote = () => {
        const newNote: Note = {
            id: notes.length > 0 ? Math.max(...notes.map(note => note.id)) + 1 : 1,
            title: "Nouvelle note",
            content: "",
            date: new Date().toISOString().split('T')[0],
            tags: [],
            lastModified: new Date().toISOString()
        };

        setNotes(prevNotes => [newNote, ...prevNotes]);
        setSelectedNote(newNote);
        setEditTitle(newNote.title);
        setEditContent(newNote.content);
        setEditTags([]);
        setIsEditing(true);
    };

    // Supprimer une note
    const handleDeleteNote = (id: number) => {
        setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
        if (selectedNote && selectedNote.id === id) {
            setSelectedNote(null);
            setIsEditing(false);
        }
    };

    // Gérer les tags
    const handleAddTag = () => {
        if (newTagInput.trim() && !editTags.includes(newTagInput.trim())) {
            setEditTags(prevTags => [...prevTags, newTagInput.trim()]);
            setNewTagInput('');
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setEditTags(prevTags => prevTags.filter(tag => tag !== tagToRemove));
    };

    return (
        <div className="bg-white shadow-md rounded-lg p-0 flex h-[calc(100vh-180px)] overflow-hidden">
            {/* Sidebar des notes */}
            <div className="w-1/3 border-r">
                <div className="p-4 border-b">
                    <h2 className="text-xl font-bold mb-4">Mes Notes</h2>

                    {/* Barre de recherche */}
                    <div className="relative mb-4">
                        <input
                            type="text"
                            placeholder="Rechercher..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>

                    {/* Filtres par tags */}
                    <div className="mb-4">
                        <div className="flex items-center mb-2">
                            <Tag className="w-4 h-4 mr-2 text-gray-600" />
                            <span className="text-sm font-medium">Filtrer par tag</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => setSelectedTagFilter('')}
                                className={`px-2 py-1 rounded-full text-xs ${
                                    selectedTagFilter === ''
                                        ? 'bg-blue-100 text-blue-800'
                                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                }`}
                            >
                                Tous
                            </button>
                            {allTags.map(tag => (
                                <button
                                    key={tag}
                                    onClick={() => setSelectedTagFilter(tag)}
                                    className={`px-2 py-1 rounded-full text-xs ${
                                        selectedTagFilter === tag
                                            ? 'bg-blue-100 text-blue-800'
                                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                    }`}
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Bouton Nouvelle note */}
                    <button
                        onClick={handleCreateNote}
                        className="flex items-center justify-center w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mb-4"
                    >
                        <PlusCircle className="w-5 h-5 mr-2" />
                        <span>Nouvelle note</span>
                    </button>
                </div>

                {/* Liste des notes */}
                <div className="overflow-y-auto h-[calc(100%-210px)]">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-32">
                            <div className="loader"></div>
                            <p className="ml-4">Chargement des notes...</p>
                        </div>
                    ) : (
                        filteredNotes.length > 0 ? (
                            filteredNotes.map(note => (
                                <div
                                    key={note.id}
                                    onClick={() => handleSelectNote(note)}
                                    className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                                        selectedNote && selectedNote.id === note.id ? 'bg-blue-50' : ''
                                    }`}
                                >
                                    <div className="flex justify-between">
                                        <h3 className="font-medium text-gray-900 mb-1 truncate">{note.title}</h3>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteNote(note.id);
                                            }}
                                            className="text-gray-400 hover:text-red-500"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{note.content}</p>
                                    <div className="flex items-center text-xs text-gray-500">
                                        <Calendar className="w-3 h-3 mr-1" />
                                        <span>{formatDate(note.date)}</span>
                                    </div>
                                    {note.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mt-2">
                                            {note.tags.slice(0, 3).map(tag => (
                                                <span key={tag} className="px-2 py-0.5 bg-gray-100 rounded-full text-xs text-gray-600">
                          {tag}
                        </span>
                                            ))}
                                            {note.tags.length > 3 && (
                                                <span className="px-2 py-0.5 bg-gray-100 rounded-full text-xs text-gray-600">
                          +{note.tags.length - 3}
                        </span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center text-gray-500">
                                <p>Aucune note trouvée</p>
                            </div>
                        )
                    )}
                </div>
            </div>

            {/* Contenu de la note */}
            <div className="w-2/3 p-6 overflow-y-auto">
                {selectedNote ? (
                    isEditing ? (
                        <div className="h-full flex flex-col">
                            <div className="mb-4">
                                <input
                                    type="text"
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                    className="w-full px-4 py-2 text-xl font-bold border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Titre de la note"
                                />
                            </div>

                            <div className="mb-4 flex-grow">
                <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full h-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    placeholder="Contenu de la note"
                ></textarea>
                            </div>

                            <div className="mb-4">
                                <div className="flex items-center mb-2">
                                    <Tag className="w-4 h-4 mr-2 text-gray-600" />
                                    <span className="text-sm font-medium">Tags</span>
                                </div>
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {editTags.map(tag => (
                                        <div key={tag} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs flex items-center">
                                            <span>{tag}</span>
                                            <button
                                                onClick={() => handleRemoveTag(tag)}
                                                className="ml-1 text-blue-800 hover:text-blue-900"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex">
                                    <input
                                        type="text"
                                        value={newTagInput}
                                        onChange={(e) => setNewTagInput(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                                        className="flex-grow px-4 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Ajouter un tag"
                                    />
                                    <button
                                        onClick={handleAddTag}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700"
                                    >
                                        Ajouter
                                    </button>
                                </div>
                            </div>

                            <div className="flex justify-end space-x-4">
                                <button
                                    onClick={handleCancelEdit}
                                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
                                >
                                    Annuler
                                </button>
                                <button
                                    onClick={handleSaveNote}
                                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    <Save className="w-5 h-5 mr-2" />
                                    Enregistrer
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <div className="flex justify-between items-start mb-6">
                                <h2 className="text-2xl font-bold">{selectedNote.title}</h2>
                                <button
                                    onClick={handleEditNote}
                                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    <Edit className="w-5 h-5 mr-2" />
                                    Modifier
                                </button>
                            </div>

                            <div className="flex items-center mb-4 text-sm text-gray-500">
                                <Calendar className="w-4 h-4 mr-1" />
                                <span className="mr-4">{formatDate(selectedNote.date)}</span>
                                <Clock className="w-4 h-4 mr-1" />
                                <span>Dernière modification: {formatTime(selectedNote.lastModified)}</span>
                            </div>

                            {selectedNote.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {selectedNote.tags.map(tag => (
                                        <span
                                            key={tag}
                                            className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600"
                                        >
                      {tag}
                    </span>
                                    ))}
                                </div>
                            )}

                            <div className="prose prose-blue max-w-none">
                                {selectedNote.content.split('\n').map((paragraph, index) => (
                                    <p key={index}>{paragraph}</p>
                                ))}
                            </div>
                        </div>
                    )
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                        <p className="mb-4">Sélectionnez une note ou créez-en une nouvelle</p>
                        <button
                            onClick={handleCreateNote}
                            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            <PlusCircle className="w-5 h-5 mr-2" />
                            Nouvelle note
                        </button>
                    </div>
                )}
            </div>

            {/* Styles supplémentaires */}
            <style jsx>{`
        .loader {
          border: 4px solid #f3f3f3;
          border-top: 4px solid #3498db;
          border-radius: 50%;
          width: 30px;
          height: 30px;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
        </div>
    );
}