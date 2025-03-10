"use client";

import { useState } from "react";
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
import { Pencil, Trash2, MoreHorizontal } from "lucide-react";
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

interface CollaborateursTableProps {
  collaborateurs: CollaborateurData[];
  onEdit: (index: number, updatedCollaborateur: CollaborateurData) => void;
  onDelete: (index: number) => void;
}

export function CollaborateursTable({
                                      collaborateurs = [],
                                      onEdit,
                                      onDelete
                                    }: CollaborateursTableProps) {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentEditIndex, setCurrentEditIndex] = useState<number | null>(null);

  function formatDate(dateString: string): string {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  }

  const handleEditClick = (index: number) => {
    setCurrentEditIndex(index);
    setEditDialogOpen(true);
  };

  const handleEditSuccess = (updatedData: CollaborateurData | null) => {
    if (updatedData && currentEditIndex !== null) {
      onEdit(currentEditIndex, updatedData);
    }
    setEditDialogOpen(false);
    setCurrentEditIndex(null);
  };

  return (
      <>
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
              {collaborateurs.length === 0 ? (
                  <TableRow>
                    <TableCell className="font-medium">Aucun collaborateur</TableCell>
                    <TableCell colSpan={6}></TableCell>
                  </TableRow>
              ) : (
                  collaborateurs.map((collaborateur, index) => (
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
                              <DropdownMenuItem onClick={() => handleEditClick(index)}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Modifier
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                  onClick={() => onDelete(index)}
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
      </>
  );
}