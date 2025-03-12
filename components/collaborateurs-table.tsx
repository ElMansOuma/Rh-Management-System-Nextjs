"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CollaborateurData } from "./collaborateur-form";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, MoreHorizontal, Search, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CollaborateurForm } from "./collaborateur-form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CollaborateursTableProps {
  collaborateurs: CollaborateurData[];
  onEdit: (index: number, updatedCollaborateur: CollaborateurData) => void;
  onDelete: (index: number) => void;
  onViewDetails?: (collaborateur: CollaborateurData) => void;
}

export function CollaborateursTable({
                                      collaborateurs = [],
                                      onEdit,
                                      onDelete,
                                      onViewDetails
                                    }: CollaborateursTableProps) {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [currentEditIndex, setCurrentEditIndex] = useState<number | null>(null);
  const [currentCollaborateur, setCurrentCollaborateur] = useState<CollaborateurData | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCollaborateurs, setFilteredCollaborateurs] = useState<CollaborateurData[]>(collaborateurs);

  // États pour la pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [paginatedCollaborateurs, setPaginatedCollaborateurs] = useState<CollaborateurData[]>([]);

  // Filtrer les collaborateurs basé sur le terme de recherche
  useEffect(() => {
    const filtered = collaborateurs.filter(collaborateur =>
        collaborateur.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        collaborateur.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        collaborateur.cin.toLowerCase().includes(searchTerm.toLowerCase()) ||
        collaborateur.cnss.toLowerCase().includes(searchTerm.toLowerCase()) ||
        collaborateur.specialite.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCollaborateurs(filtered);
    setCurrentPage(1); // Réinitialiser à la première page lors d'une nouvelle recherche
  }, [searchTerm, collaborateurs]);

  // Calculer la pagination
  useEffect(() => {
    const total = Math.ceil(filteredCollaborateurs.length / itemsPerPage);
    setTotalPages(total || 1);

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    setPaginatedCollaborateurs(filteredCollaborateurs.slice(start, end));
  }, [filteredCollaborateurs, currentPage, itemsPerPage]);

  function formatDate(dateString: string): string {
    if (!dateString) return "";
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

  const handleEditSuccess = (updatedData: CollaborateurData | null) => {
    if (updatedData && currentEditIndex !== null) {
      onEdit(currentEditIndex, updatedData);
    }
    setEditDialogOpen(false);
    setCurrentEditIndex(null);
  };

  const handleDeleteClick = (index: number) => {
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

    onDelete(originalIndex);
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

  return (
      <>
        <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <div className="relative flex items-center w-full max-w-md">
            <Search className="absolute left-2 h-4 w-4 text-gray-400" />
            <Input
                placeholder="Rechercher un collaborateur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
            />
          </div>
          {searchTerm && (
              <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSearchTerm("")}
              >
                Effacer
              </Button>
          )}
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Prénom</TableHead>
                <TableHead>CIN</TableHead>
                <TableHead>CNSS</TableHead>
                <TableHead>Spécialité</TableHead>
                <TableHead>Date d&apos;embauche</TableHead>
                <TableHead className="w-16">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedCollaborateurs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6">
                      {searchTerm
                          ? "Aucun collaborateur ne correspond à votre recherche"
                          : "Aucun collaborateur"}
                    </TableCell>
                  </TableRow>
              ) : (
                  paginatedCollaborateurs.map((collaborateur, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{collaborateur.nom}</TableCell>
                        <TableCell>{collaborateur.prenom}</TableCell>
                        <TableCell>{collaborateur.cin}</TableCell>
                        <TableCell>{collaborateur.cnss}</TableCell>
                        <TableCell>{collaborateur.specialite}</TableCell>
                        <TableCell>{formatDate(collaborateur.dateEmbauche)}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewDetailsClick(index)}>
                                <Eye className="mr-2 h-4 w-4" />
                                Détails
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEditClick(index)}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Modifier
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                  onClick={() => handleDeleteClick(index)}
                                  className="text-red-600 focus:text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Supprimer
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Contrôles de pagination */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center space-x-2">
            <Select
                value={itemsPerPage.toString()}
                onValueChange={(value) => setItemsPerPage(Number(value))}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Lignes par page" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 par page</SelectItem>
                <SelectItem value="10">10 par page</SelectItem>
                <SelectItem value="20">20 par page</SelectItem>
                <SelectItem value="50">50 par page</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-gray-500">
            {filteredCollaborateurs.length} collaborateurs
          </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
                variant="outline"
                size="icon"
                onClick={prevPage}
                disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex items-center gap-1">
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
                        className="w-8 h-8 p-0"
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
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="text-sm text-gray-500">
            Page {currentPage} sur {totalPages}
          </div>
        </div>

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
                  <DialogTitle>Détails du Collaborateur</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                  <div>
                    <h3 className="font-medium text-gray-500">Informations personnelles</h3>
                    <div className="mt-2 space-y-2">
                      <p><span className="font-medium">Nom:</span> {currentCollaborateur.nom}</p>
                      <p><span className="font-medium">Prénom:</span> {currentCollaborateur.prenom}</p>
                      <p><span className="font-medium">CIN:</span> {currentCollaborateur.cin}</p>
                      <p><span className="font-medium">Date de naissance:</span> {formatDate(currentCollaborateur.dateNaissance)}</p>
                      <p><span className="font-medium">Lieu de naissance:</span> {currentCollaborateur.lieuNaissance}</p>
                      <p><span className="font-medium">Adresse:</span> {currentCollaborateur.adresseDomicile}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-500">Informations professionnelles</h3>
                    <div className="mt-2 space-y-2">
                      <p><span className="font-medium">CNSS:</span> {currentCollaborateur.cnss}</p>
                      <p><span className="font-medium">Origine:</span> {currentCollaborateur.origine}</p>
                      <p><span className="font-medium">Niveau d'étude:</span> {currentCollaborateur.niveauEtude}</p>
                      <p><span className="font-medium">Spécialité:</span> {currentCollaborateur.specialite}</p>
                      <p><span className="font-medium">Date d'entretien:</span> {formatDate(currentCollaborateur.dateEntretien)}</p>
                      <p><span className="font-medium">Date d'embauche:</span> {formatDate(currentCollaborateur.dateEmbauche)}</p>
                    </div>
                  </div>
                  <div className="col-span-1 md:col-span-2">
                    <h3 className="font-medium text-gray-500">Description</h3>
                    <p className="mt-2">{currentCollaborateur.description || "Aucune description disponible."}</p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
        )}
      </>
  );
}