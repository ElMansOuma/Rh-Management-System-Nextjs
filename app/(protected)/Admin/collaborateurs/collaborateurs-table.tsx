"use client";

import { useState, useEffect } from "react";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table";
import { CollaborateurData } from "@/app/(protected)/Admin/collaborateurs/collaborateur-form";
import { Button } from "@/components/ui/button";
import {Pencil, Trash2, MoreHorizontal, Search, ChevronLeft, ChevronRight, Eye, Filter, X, User, UserRound, History, BookOpen, Paperclip} from "lucide-react";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator,} from "@/components/ui/dropdown-menu";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,} from "@/components/ui/dialog";
import { CollaborateurForm } from "@/app/(protected)/Admin/collaborateurs/collaborateur-form";
import { Input } from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select";
import {Popover, PopoverContent, PopoverTrigger,} from "@/components/ui/popover";
import {Card, CardContent, CardHeader, CardTitle,} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";

interface CollaborateursTableProps {
  collaborateurs: CollaborateurData[];
  onEdit: (index: number, updatedCollaborateur: CollaborateurData) => void;
  onDelete: (index: number) => void;
  onViewDetails?: (collaborateur: CollaborateurData) => void;
}

// Type d'interface pour les filtres
interface FilterOptions {
  field: string;
  value: string;
}

export function CollaborateursTable({
                                      collaborateurs = [],
                                      onEdit,
                                      onDelete,
                                      onViewDetails
                                    }: CollaborateursTableProps) {
  const router = useRouter();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentEditIndex, setCurrentEditIndex] = useState<number | null>(null);
  const [currentCollaborateur, setCurrentCollaborateur] = useState<CollaborateurData | null>(null);
  const [currentDeleteIndex, setCurrentDeleteIndex] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCollaborateurs, setFilteredCollaborateurs] = useState<CollaborateurData[]>(collaborateurs);

  // État pour les filtres
  const [filters, setFilters] = useState<FilterOptions[]>([]);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [selectedField, setSelectedField] = useState("tous");
  const [specialites, setSpecialites] = useState<string[]>([]);

  // États pour la pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [paginatedCollaborateurs, setPaginatedCollaborateurs] = useState<CollaborateurData[]>([]);

  // Add this handler function
  const handleAddDocumentClick = (collaborateurId: number) => {
    // Navigate to the documents page for this collaborateur
    router.push(`/Admin/collaborateurs/${collaborateurId}/documents`);
  };

  // Extraire les spécialités uniques pour les filtres
  useEffect(() => {
    const uniqueSpecialites = Array.from(new Set(collaborateurs.map(c => c.specialite || "")));
    setSpecialites(uniqueSpecialites);
  }, [collaborateurs]);

  // Filtrer les collaborateurs base sur le terme de recherche et les filtres
  useEffect(() => {
    let filtered = [...collaborateurs];

    // Appliquer les filtres spécifiques
    if (filters.length > 0) {
      filtered = filtered.filter(collaborateur => {
        return filters.every(filter => {
          const value = collaborateur[filter.field as keyof CollaborateurData];
          if (typeof value === 'string') {
            return value.toLowerCase().includes(filter.value.toLowerCase());
          }
          return false;
        });
      });
    }

    // Appliquer le terme de recherche global si présent
    if (searchTerm) {
      filtered = filtered.filter(collaborateur =>
          (collaborateur.nom || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
          (collaborateur.prenom || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
          (collaborateur.cin || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
          (collaborateur.cnss || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
          (collaborateur.specialite || "").toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredCollaborateurs(filtered);
    setCurrentPage(1); // Réinitialiser à la première page lors d'une nouvelle recherche
  }, [searchTerm, collaborateurs, filters]);

  // Calculer la pagination
  useEffect(() => {
    const total = Math.ceil(filteredCollaborateurs.length / itemsPerPage);
    setTotalPages(total || 1);

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    setPaginatedCollaborateurs(filteredCollaborateurs.slice(start, end));
  }, [filteredCollaborateurs, currentPage, itemsPerPage]);

  function formatDate(dateString: string | null | undefined): string {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  }

  const handleEditClick = (index: number) => {
    // Calculer l'index dans le tableau filtré complet
    const startIndex = (currentPage - 1) * itemsPerPage;
    const filteredIndex = startIndex + index;

    // Trouver l'index original dans le tableau complet
    const originalCollaborateur = filteredCollaborateurs[filteredIndex];
    const originalIndex = collaborateurs.findIndex(c =>
        c.cin === originalCollaborateur.cin &&
        c.nom === originalCollaborateur.nom &&
        c.prenom === originalCollaborateur.prenom
    );

    setCurrentEditIndex(originalIndex);
    setEditDialogOpen(true);
  };

  const handleViewDetailsClick = (index: number) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const filteredIndex = startIndex + index;
    const collaborateur = filteredCollaborateurs[filteredIndex];

    setCurrentCollaborateur(collaborateur);

    if (onViewDetails) {
      onViewDetails(collaborateur);
    } else {
      setDetailsDialogOpen(true);
    }
  };

  const handleDeleteClick = (index: number) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const filteredIndex = startIndex + index;

    // Trouver l'index original dans le tableau complet
    const originalCollaborateur = filteredCollaborateurs[filteredIndex];
    const originalIndex = collaborateurs.findIndex(c =>
        c.cin === originalCollaborateur.cin &&
        c.nom === originalCollaborateur.nom &&
        c.prenom === originalCollaborateur.prenom
    );

    setCurrentDeleteIndex(originalIndex);
    setCurrentCollaborateur(originalCollaborateur);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (currentDeleteIndex !== null) {
      onDelete(currentDeleteIndex);
      setDeleteDialogOpen(false);
      setCurrentDeleteIndex(null);
    }
  };

  const handleEditSuccess = (updatedData: CollaborateurData | null) => {
    if (updatedData && currentEditIndex !== null) {
      onEdit(currentEditIndex, updatedData);
    }
    setEditDialogOpen(false);
    setCurrentEditIndex(null);
  };

  const addFilter = (field: string, value: string) => {
    if (!value.trim()) return;

    // Si le champ est "tous", ne pas ajouter de filtre spécifique
    if (field === "tous") return;

    // Vérifier si un filtre avec ce champ existe déjà
    const existingFilterIndex = filters.findIndex(f => f.field === field);

    if (existingFilterIndex >= 0) {
      // Mettre à jour le filtre existant
      const updatedFilters = [...filters];
      updatedFilters[existingFilterIndex] = { field, value };
      setFilters(updatedFilters);
    } else {
      // Ajouter un nouveau filtre
      setFilters([...filters, { field, value }]);
    }

    setFilterDialogOpen(false);
  };

  const removeFilter = (index: number) => {
    const newFilters = [...filters];
    newFilters.splice(index, 1);
    setFilters(newFilters);
  };

  const clearAllFilters = () => {
    setFilters([]);
    setSearchTerm("");
  };

  const nextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const prevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  // Fonction pour obtenir le libellé du champ de filtre
  const getFieldLabel = (field: string) => {
    const fieldMap: Record<string, string> = {
      "nom": "Nom",
      "prenom": "Prénom",
      "cin": "CIN",
      "cnss": "CNSS",
      "specialite": "Spécialité",
      "dateEmbauche": "Date d'embauche"
    };
    return fieldMap[field] || field;
  };

  return (
      <div className="space-y-6 bg-white p-6 rounded-lg shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="text-2xl font-semibold text-gray-800"></h2>
          <div className="flex items-center gap-2">
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="relative flex items-center w-full max-w-md">
            <div className="absolute left-3 h-5 w-5 text-gray-400">
              <Search className="h-4 w-4" />
            </div>
            <Input
                placeholder="Recherche globale..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white border-gray-200 focus-visible:ring-blue-500"
            />
          </div>

          <Popover open={filterDialogOpen} onOpenChange={setFilterDialogOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2 border-gray-200 text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                <Filter className="h-4 w-4" />
                Filtres
                {filters.length > 0 && (
                    <Badge variant="secondary" className="ml-1 bg-blue-100 text-blue-800">{filters.length}</Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <h3 className="font-medium text-sm">Ajouter un filtre</h3>

                <div className="space-y-2">
                  <Select
                      value={selectedField}
                      onValueChange={setSelectedField}
                  >
                    <SelectTrigger className="bg-white border-gray-200">
                      <SelectValue placeholder="Choisir un champ" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nom">Nom</SelectItem>
                      <SelectItem value="prenom">Prénom</SelectItem>
                      <SelectItem value="cin">CIN</SelectItem>
                      <SelectItem value="cnss">CNSS</SelectItem>
                      <SelectItem value="specialite">Spécialité</SelectItem>
                    </SelectContent>
                  </Select>

                  {selectedField === "specialite" ? (
                      <Select
                          onValueChange={(value) => addFilter("specialite", value)}
                      >
                        <SelectTrigger className="bg-white border-gray-200">
                          <SelectValue placeholder="Choisir une spécialité" />
                        </SelectTrigger>
                        <SelectContent>
                          {specialites.map((specialite, index) => (
                              <SelectItem key={index} value={specialite}>
                                {specialite}
                              </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                  ) : (
                      <div className="flex items-center gap-2">
                        <Input
                            placeholder={`Valeur pour ${getFieldLabel(selectedField)}`}
                            className="bg-white border-gray-200"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                addFilter(selectedField, e.currentTarget.value);
                                e.currentTarget.value = '';
                              }
                            }}
                        />
                        <Button
                            size="sm"
                            onClick={(e) => {
                              const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                              addFilter(selectedField, input.value);
                              input.value = '';
                            }}
                        >
                          Ajouter
                        </Button>
                      </div>
                  )}
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {(searchTerm || filters.length > 0) && (
              <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  className="gap-1 text-gray-500 hover:text-gray-700"
              >
                <X className="h-4 w-4" />
                Tout effacer
              </Button>
          )}
        </div>

        {/* Affichage des filtres actifs */}
        {filters.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {filters.map((filter, index) => (
                  <Badge key={index} variant="outline" className="flex items-center gap-1 pl-2 bg-gray-50 border-gray-200 text-gray-700">
                    {getFieldLabel(filter.field)}: {filter.value}
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 ml-1 hover:bg-transparent text-gray-500 hover:text-gray-700"
                        onClick={() => removeFilter(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
              ))}
            </div>
        )}

        <div className="rounded-lg border border-gray-200 overflow-hidden">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="text-gray-700">Nom & Prénom</TableHead>
                <TableHead className="text-gray-700">CIN</TableHead>
                <TableHead className="text-gray-700">CNSS</TableHead>
                <TableHead className="text-gray-700">Spécialité</TableHead>
                <TableHead className="text-gray-700">Date d&apos;embauche</TableHead>
                <TableHead className="w-16 text-gray-700">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedCollaborateurs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-16 text-gray-500">
                      {searchTerm || filters.length > 0
                          ? "Aucun collaborateur ne correspond à votre recherche"
                          : "Aucun collaborateur"}
                    </TableCell>
                  </TableRow>
              ) : (
                  paginatedCollaborateurs.map((collaborateur, index) => (
                      <TableRow key={index} className="hover:bg-gray-50 cursor-pointer" onClick={() => handleViewDetailsClick(index)}>
                        <TableCell className="font-medium">
                          <div className="flex items-center space-x-2">
                            <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-blue-600">
                              <UserRound className="h-4 w-4" />
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{collaborateur.nom}</div>
                              <div className="text-sm text-gray-500">{collaborateur.prenom}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-600">{collaborateur.cin || "-"}</TableCell>
                        <TableCell className="text-gray-600">{collaborateur.cnss || "-"}</TableCell>
                        <TableCell>
                          {collaborateur.specialite ? (
                              <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200 font-normal">
                                {collaborateur.specialite}
                              </Badge>
                          ) : "-"}
                        </TableCell>
                        <TableCell className="text-gray-600">{formatDate(collaborateur.dateEmbauche)}</TableCell>
                        <TableCell>
                          <div className="flex justify-end" onClick={(e) => e.stopPropagation()}>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-gray-700">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuItem onClick={() => handleViewDetailsClick(index)} className="cursor-pointer">
                                  <Eye className="mr-2 h-4 w-4" />
                                  Voir détails
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleEditClick(index)} className="cursor-pointer">
                                  <Pencil className="mr-2 h-4 w-4" />
                                  Modifier
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      const startIndex = (currentPage - 1) * itemsPerPage;
                                      const filteredIndex = startIndex + index;
                                      const collaborateur = filteredCollaborateurs[filteredIndex];
                                      handleAddDocumentClick(collaborateur.id as number);
                                    }}
                                    className="cursor-pointer flex items-center p-2 rounded-lg hover:bg-blue-100 transition-colors"
                                >
                                  <Paperclip className="mr-2 h-4 w-4 text-gray-600" />
                                  Pièce justificative
                                </DropdownMenuItem>

                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={() => handleDeleteClick(index)}
                                    className="text-red-600 cursor-pointer focus:text-red-600"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Supprimer
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Contrôles de pagination */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2">
          <div className="flex items-center space-x-2">
            <Select
                value={itemsPerPage.toString()}
                onValueChange={(value) => setItemsPerPage(Number(value))}
            >
              <SelectTrigger className="w-[120px] bg-white border-gray-200">
                <SelectValue placeholder="Lignes par page" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 par page</SelectItem>
                <SelectItem value="10">10 par page</SelectItem>
                <SelectItem value="20">20 par page</SelectItem>
                <SelectItem value="50">50 par page</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
            <div className="flex items-center gap-1">
              <Button
                  variant="outline"
                  size="icon"
                  onClick={prevPage}
                  disabled={currentPage === 1}
                  className="h-8 w-8 p-0 border-gray-200"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <div className="hidden sm:flex items-center gap-1">
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let pageNum: number;

                  // Logique pour afficher les bonnes pages dans une fenêtre glissante
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                      <Button
                          key={i}
                          variant={pageNum === currentPage ? "default" : "outline"}
                          size="sm"
                          className={`w-8 h-8 p-0 ${pageNum === currentPage ? 'bg-blue-600 hover:bg-blue-700' : 'border-gray-200'}`}
                          onClick={() => goToPage(pageNum)}
                      >
                        {pageNum}
                      </Button>
                  );
                })}
              </div>

              <Button
                  variant="outline"
                  size="icon"
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                  className="h-8 w-8 p-0 border-gray-200"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="text-sm text-gray-500">
              Page {currentPage} sur {totalPages}
            </div>
          </div>
        </div>

        {/* Dialogue de confirmation de suppression */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-red-600">Confirmer la suppression</DialogTitle>
              <DialogDescription>
                Êtes-vous sûr de vouloir supprimer le collaborateur suivant ?
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              {currentCollaborateur && (
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-md">
                    <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                      <UserRound className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-medium">{currentCollaborateur.nom} {currentCollaborateur.prenom}</div>
                      <div className="text-sm text-gray-500">{currentCollaborateur.specialite || "Aucune spécialité"}</div>
                    </div>
                  </div>
              )}
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Annuler</Button>
              <Button variant="destructive" onClick={confirmDelete}>Supprimer</Button>
            </div>
          </DialogContent>
        </Dialog>

        {currentEditIndex !== null && (
            <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>Modifier Collaborateur</DialogTitle>
                </DialogHeader>
                <CollaborateurForm
                    onSuccess={handleEditSuccess}
                    initialData={collaborateurs[currentEditIndex]}
                />
              </DialogContent>
            </Dialog>
        )}

        {currentCollaborateur && (
            <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle className="text-xl font-semibold">
                    {currentCollaborateur.nom} {currentCollaborateur.prenom}
                  </DialogTitle>
                  <DialogDescription>
                    <Badge className="mt-2">{currentCollaborateur.specialite || "Aucune spécialité"}</Badge>
                  </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="informations" className="mt-4">
                  <TabsList className="grid grid-cols-3 mb-4">
                    <TabsTrigger value="informations" className="flex items-center gap-2">
                      <UserRound className="h-4 w-4" />
                      Informations
                    </TabsTrigger>
                    <TabsTrigger value="professionnel" className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      Professionnel
                    </TabsTrigger>
                    <TabsTrigger value="historique" className="flex items-center gap-2">
                      <History className="h-4 w-4" />
                      Historique
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="informations">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Informations personnelles</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-3">
                            <div>
                              <div className="text-sm font-medium text-gray-500">Nom complet</div>
                              <div className="mt-1">{currentCollaborateur.nom} {currentCollaborateur.prenom}</div>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-500">CIN</div>
                              <div className="mt-1">{currentCollaborateur.cin || "-"}</div>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-500">Date de naissance</div>
                              <div className="mt-1">{formatDate(currentCollaborateur.dateNaissance)}</div>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <div>
                              <div className="text-sm font-medium text-gray-500">Lieu de naissance</div>
                              <div className="mt-1">{currentCollaborateur.lieuNaissance || "-"}</div>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-500">Adresse</div>
                              <div className="mt-1">{currentCollaborateur.adresseDomicile || "-"}</div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="professionnel">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Informations professionnelles</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-3">
                            <div>
                              <div className="text-sm font-medium text-gray-500">CNSS</div>
                              <div className="mt-1">{currentCollaborateur.cnss || "-"}</div>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-500">Origine</div>
                              <div className="mt-1">{currentCollaborateur.origine || "-"}</div>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-500">Niveau d&apos;étude</div>
                              <div className="mt-1">{currentCollaborateur.niveauEtude || "-"}</div>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <div>
                              <div className="text-sm font-medium text-gray-500">Spécialité</div>
                              <div className="mt-1">{currentCollaborateur.specialite || "-"}</div>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-500">Date d&apos;entretien</div>
                              <div className="mt-1">{formatDate(currentCollaborateur.dateEntretien)}</div>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-500">Date d&apos;embauche</div>
                              <div className="mt-1">{formatDate(currentCollaborateur.dateEmbauche)}</div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="historique">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Historique des modifications</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-sm text-gray-500 py-8 text-center">
                          Aucun historique disponible pour ce collaborateur
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>

                <div className="flex justify-end gap-3 mt-4">
                  <Button
                      variant="outline"
                      onClick={() => setDetailsDialogOpen(false)}
                  >
                    Fermer
                  </Button>
                  <Button
                      variant="outline"
                      className="gap-2"
                      onClick={() => {
                        setDetailsDialogOpen(false);
                        if (currentCollaborateur) {
                          const index = collaborateurs.findIndex(c =>
                              c.cin === currentCollaborateur.cin &&
                              c.nom === currentCollaborateur.nom &&
                              c.prenom === currentCollaborateur.prenom
                          );
                          if (index !== -1) {
                            handleEditClick(index);
                          }
                        }
                      }}
                  >
                    <Pencil className="h-4 w-4" />
                    Modifier
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
        )}
      </div>
  );
}