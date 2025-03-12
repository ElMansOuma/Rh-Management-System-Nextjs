"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PieceJustificative, pieceJustificativeService } from "@/services/api";
import { PieceJustificativeList } from "./piece-justificative-list";
import { PieceJustificativeForm } from "./piece-justificative-form";
import { toast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Define interface for form data
export interface CollaborateurData {
  id?: number;
  nom: string;
  prenom: string;
  cin: string;
  dateNaissance: string;
  lieuNaissance: string;
  adresse: string;
  adresseDomicile?: string;
  cnss: string;
  origine: string;
  niveauEtude: string;
  specialite: string;
  dateEntretien: string;
  dateEmbauche: string;
  description: string;
  piecesJustificatives?: PieceJustificative[];
}

// Define props interface
interface CollaborateurFormProps {
  onSuccess: (data: CollaborateurData | null) => void;
  initialData?: CollaborateurData;
}

const emptyFormData: CollaborateurData = {
  nom: "",
  prenom: "",
  cin: "",
  dateNaissance: "",
  lieuNaissance: "",
  adresse: "",
  cnss: "",
  origine: "",
  niveauEtude: "",
  specialite: "",
  dateEntretien: "",
  dateEmbauche: "",
  description: "",
  piecesJustificatives: []
};

export function CollaborateurForm({ onSuccess, initialData }: CollaborateurFormProps) {
  const [formData, setFormData] = useState<CollaborateurData>(initialData || emptyFormData);
  const [pieces, setPieces] = useState<PieceJustificative[]>([]);
  const [loading, setLoading] = useState(false);
  const [tempUploadedFiles, setTempUploadedFiles] = useState<File[]>([]);
  const [tempDocuments, setTempDocuments] = useState<{name: string, file: File, type: string}[]>([]);

  // Update form data if initialData changes (useful for edit mode)
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);

      // If we have a collaborateur ID, fetch their pieces justificatives
      if (initialData.id) {
        loadPiecesJustificatives(initialData.id);
      }
    }
  }, [initialData]);

  const loadPiecesJustificatives = async (collaborateurId: number) => {
    try {
      setLoading(true);
      const piecesData = await pieceJustificativeService.getAllByCollaborateur(collaborateurId);
      setPieces(piecesData);
    } catch (error) {
      console.error("Error loading pieces justificatives:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les documents du collaborateur.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [id]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // If we have temporary documents, we'll need to include them with the submission
    const dataToSubmit = {
      ...formData,
      tempDocuments: tempDocuments
    };

    onSuccess(dataToSubmit);
  };

  const handleDeletePiece = async (pieceId: number) => {
    if (!initialData?.id) {
      // For temporary documents before save
      setTempDocuments(prev => prev.filter((_, index) => index !== pieceId));
      return;
    }

    try {
      setLoading(true);
      await pieceJustificativeService.delete(pieceId);
      toast({
        title: "Succès",
        description: "Document supprimé avec succès",
      });
      // Reload pieces after deletion
      if (initialData.id) {
        await loadPiecesJustificatives(initialData.id);
      }
    } catch (error) {
      console.error("Error deleting document:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression du document.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setTempUploadedFiles(prev => [...prev, file]);
    }
  };

  const handleAddTempDocument = (documentName: string, documentType: string) => {
    if (tempUploadedFiles.length === 0) {
      toast({
        title: "Erreur",
        description: "Veuillez d'abord sélectionner un fichier",
        variant: "destructive",
      });
      return;
    }

    if (!documentName) {
      toast({
        title: "Erreur",
        description: "Veuillez donner un nom au document",
        variant: "destructive",
      });
      return;
    }

    if (!documentType) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un type de document",
        variant: "destructive",
      });
      return;
    }

    // Add to temporary documents
    const lastFile = tempUploadedFiles[tempUploadedFiles.length - 1];
    setTempDocuments(prev => [...prev, { name: documentName, file: lastFile, type: documentType }]);

    // Clear the file input
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }

    toast({
      title: "Succès",
      description: "Document ajouté temporairement",
    });
  };

  return (
      <div className="max-h-screen overflow-y-auto p-6 bg-white shadow-lg rounded-lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations du collaborateur</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="nom">Nom</Label>
                  <Input id="nom" value={formData.nom} onChange={handleChange} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="prenom">Prénom</Label>
                  <Input id="prenom" value={formData.prenom} onChange={handleChange} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cin">CIN</Label>
                  <Input id="cin" value={formData.cin} onChange={handleChange} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateNaissance">Date de Naissance</Label>
                  <Input
                      id="dateNaissance"
                      type="date"
                      value={formData.dateNaissance}
                      onChange={handleChange}
                      required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lieuNaissance">Lieu de Naissance</Label>
                  <Input id="lieuNaissance" value={formData.lieuNaissance} onChange={handleChange} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="adresse">Adresse</Label>
                  <Input id="adresse" value={formData.adresse} onChange={handleChange} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cnss">CNSS</Label>
                  <Input id="cnss" value={formData.cnss} onChange={handleChange} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="origine">Origine</Label>
                  <Input id="origine" value={formData.origine} onChange={handleChange} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="niveauEtude">Niveau d&apos;Étude</Label>
                  <select
                      id="niveauEtude"
                      value={formData.niveauEtude}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md p-2"
                      required
                  >
                    <option value="">Sélectionner un niveau</option>
                    <option value="Bac">Bac</option>
                    <option value="Bac+2">Bac+2</option>
                    <option value="Bac+3">Bac+3</option>
                    <option value="Bac+5">Bac+5</option>
                    <option value="Doctorat">Doctorat</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specialite">Spécialité</Label>
                  <select
                      id="specialite"
                      value={formData.specialite}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md p-2"
                      required
                  >
                    <option value="">Sélectionner une spécialité</option>
                    <option value="Informatique">Informatique</option>
                    <option value="Réseaux et Télécoms">Réseaux et Télécoms</option>
                    <option value="Génie Civil">Génie Civil</option>
                    <option value="Finance">Finance</option>
                    <option value="Marketing">Marketing</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateEntretien">Date d&apos;Entretien</Label>
                  <Input
                      id="dateEntretien"
                      type="date"
                      value={formData.dateEntretien}
                      onChange={handleChange}
                      required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateEmbauche">Date d&apos;Embauche</Label>
                  <Input
                      id="dateEmbauche"
                      type="date"
                      value={formData.dateEmbauche}
                      onChange={handleChange}
                      required
                  />
                </div>
              </div>

              <div className="space-y-2 mt-6">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" value={formData.description} onChange={handleChange} className="h-32" />
              </div>
            </CardContent>
          </Card>

          {/* Documents section - directly in the same form, now accessible immediately */}
          <Card>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
            </CardHeader>
            <CardContent>
              {initialData?.id ? (
                  // Existing collaborateur - use the regular document form and list
                  <div className="space-y-6">
                    <PieceJustificativeForm
                        collaborateurId={initialData.id}
                        onSuccess={() => {
                          if (initialData.id) {
                            loadPiecesJustificatives(initialData.id);
                          }
                        }}
                    />

                    <div className="mt-6">
                      <h3 className="text-lg font-medium mb-4">Documents du collaborateur</h3>
                      {loading && pieces.length === 0 ? (
                          <p>Chargement des documents...</p>
                      ) : (
                          <PieceJustificativeList
                              collaborateurId={initialData.id}
                              pieces={pieces}
                              onUpdate={() => {
                                if (initialData.id) {
                                  loadPiecesJustificatives(initialData.id);
                                }
                              }}
                              onDelete={handleDeletePiece}
                          />
                      )}
                    </div>
                  </div>
              ) : (
                  // New collaborateur - use temporary document storage
                  <div className="space-y-6">
                    <div className="p-4 border rounded-md">
                      <h3 className="text-md font-medium mb-4">Ajouter un document temporaire</h3>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="document-name">Nom du document</Label>
                          <Input
                              id="document-name"
                              placeholder="Ex: Carte d'identité, Diplôme, etc."
                          />
                        </div>

                        <div>
                          <Label htmlFor="document-type">Type de document</Label>
                          <select
                              id="document-type"
                              className="w-full border border-gray-300 rounded-md p-2"
                          >
                            <option value="">Sélectionner un type</option>
                            <option value="ID">Carte d'identité</option>
                            <option value="DIPLOMA">Diplôme</option>
                            <option value="CV">CV</option>
                            <option value="CONTRACT">Contrat</option>
                            <option value="OTHER">Autre</option>
                          </select>
                        </div>

                        <div>
                          <Label htmlFor="file-upload">Fichier</Label>
                          <Input
                              id="file-upload"
                              type="file"
                              onChange={handleFileUpload}
                          />
                        </div>

                        <Button
                            type="button"
                            onClick={() => {
                              const nameInput = document.getElementById('document-name') as HTMLInputElement;
                              const typeInput = document.getElementById('document-type') as HTMLSelectElement;
                              handleAddTempDocument(nameInput.value, typeInput.value);
                              if (nameInput) nameInput.value = '';
                              if (typeInput) typeInput.value = '';
                            }}
                        >
                          Ajouter le document
                        </Button>
                      </div>
                    </div>

                    <div className="mt-6">
                      <h3 className="text-lg font-medium mb-4">Documents temporaires</h3>
                      {tempDocuments.length === 0 ? (
                          <p className="text-gray-500">Aucun document ajouté</p>
                      ) : (
                          <div className="border rounded-md divide-y">
                            {tempDocuments.map((doc, index) => (
                                <div key={index} className="p-3 flex justify-between items-center">
                                  <div>
                                    <p className="font-medium">{doc.name}</p>
                                    <p className="text-sm text-gray-500">{doc.file.name} ({doc.type})</p>
                                  </div>
                                  <Button
                                      variant="destructive"
                                      size="sm"
                                      onClick={() => handleDeletePiece(index)}
                                  >
                                    Supprimer
                                  </Button>
                                </div>
                            ))}
                          </div>
                      )}
                      <p className="text-sm text-gray-500 mt-2">
                        Ces documents seront associés au collaborateur après l&apos;enregistrement.
                      </p>
                    </div>
                  </div>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => onSuccess(null)}>
              Annuler
            </Button>
            <Button type="submit">
              {initialData?.id ? "Mettre à jour" : "Enregistrer"}
            </Button>
          </div>
        </form>
      </div>
  );
}