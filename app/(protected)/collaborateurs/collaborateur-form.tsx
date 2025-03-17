"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { Users } from "lucide-react";
import { PieceJustificative, pieceJustificativeService } from "@/services/api";
import { PieceJustificativeList } from "./piece-justificative-list";
import { PieceJustificativeForm } from "./piece-justificative-form";

// Define interface for form data
export interface CollaborateurData {
  id?: number;
  nom: string;
  prenom: string;
  cin: string;
  dateNaissance: string | null; // Changed to string for HTML date input
  lieuNaissance: string;
  adresse: string;
  adresseDomicile?: string;
  cnss: string;
  origine: string;
  niveauEtude: string;
  specialite: string;
  dateEntretien: string | null; // Changed to string for HTML date input
  dateEmbauche: string | null; // Changed to string for HTML date input
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
  dateNaissance: null,
  lieuNaissance: "",
  adresse: "",
  cnss: "",
  origine: "",
  niveauEtude: "",
  specialite: "",
  dateEntretien: null,
  dateEmbauche: null,
  description: "",
  piecesJustificatives: []
};

// Helper function to format date strings for HTML date input (YYYY-MM-DD)
const formatDateForInput = (dateString: string | null | Date): string => {
  if (!dateString) return "";

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return ""; // Invalid date

  return date.toISOString().split('T')[0];
};

export function CollaborateurForm({ onSuccess, initialData }: CollaborateurFormProps) {
  // Format dates from initialData if they exist
  const formattedInitialData = initialData ? {
    ...initialData,
    dateNaissance: formatDateForInput(initialData.dateNaissance),
    dateEntretien: formatDateForInput(initialData.dateEntretien),
    dateEmbauche: formatDateForInput(initialData.dateEmbauche)
  } : undefined;

  const [formData, setFormData] = useState<CollaborateurData>(formattedInitialData || emptyFormData);
  const [pieces, setPieces] = useState<PieceJustificative[]>([]);
  const [loading, setLoading] = useState(false);
  const [tempUploadedFiles, setTempUploadedFiles] = useState<File[]>([]);
  const [tempDocuments, setTempDocuments] = useState<{name: string, file: File, type: string}[]>([]);

  // Update form data if initialData changes (useful for edit mode)
  useEffect(() => {
    if (initialData) {
      // Format the dates for the HTML date inputs
      setFormData({
        ...initialData,
        dateNaissance: formatDateForInput(initialData.dateNaissance),
        dateEntretien: formatDateForInput(initialData.dateEntretien),
        dateEmbauche: formatDateForInput(initialData.dateEmbauche)
      });

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
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto py-8">
          <Card className="max-w-4xl mx-auto">
            <CardHeader className="sticky top-0 bg-white z-10 border-b">
              <div className="flex items-center space-x-4">
                <Users className="h-8 w-8 text-blue-600" />
                <CardTitle className="text-2xl font-bold text-gray-900">
                  {initialData?.id ? "Modifier un Collaborateur" : "Ajouter un Collaborateur"}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="max-h-[80vh] overflow-y-auto custom-scrollbar px-6 pt-6 pb-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="nom">Nom</Label>
                    <Input
                        id="nom"
                        value={formData.nom}
                        onChange={handleChange}
                        required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="prenom">Prénom</Label>
                    <Input
                        id="prenom"
                        value={formData.prenom}
                        onChange={handleChange}
                        required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cin">CIN</Label>
                    <Input
                        id="cin"
                        value={formData.cin}
                        onChange={handleChange}
                        required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dateNaissance">Date de Naissance</Label>
                    <Input
                        id="dateNaissance"
                        type="date"
                        value={formData.dateNaissance || ""}
                        onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lieuNaissance">Lieu de Naissance</Label>
                    <Input
                        id="lieuNaissance"
                        value={formData.lieuNaissance}
                        onChange={handleChange}
                        required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="adresse">Adresse</Label>
                    <Input
                        id="adresse"
                        value={formData.adresse}
                        onChange={handleChange}
                        required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cnss">CNSS</Label>
                    <Input
                        id="cnss"
                        value={formData.cnss}
                        onChange={handleChange}
                        required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="origine">Origine</Label>
                    <Input
                        id="origine"
                        value={formData.origine}
                        onChange={handleChange}
                        required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="niveauEtude">Niveau d{"'"}Étude</Label>
                    <select
                        id="niveauEtude"
                        value={formData.niveauEtude}
                        onChange={handleChange}
                        className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
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
                        className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
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
                    <Label htmlFor="dateEntretien">Date d{"'"}Entretien</Label>
                    <Input
                        id="dateEntretien"
                        type="date"
                        value={formData.dateEntretien || ""}
                        onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dateEmbauche">Date d{"'"}Embauche</Label>
                    <Input
                        id="dateEmbauche"
                        type="date"
                        value={formData.dateEmbauche || ""}
                        onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="space-y-2 mt-6">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                      id="description"
                      value={formData.description}
                      onChange={handleChange}
                      className="h-32"
                  />
                </div>

                {/* Documents section */}
                <Card className="mt-6">
                  <CardHeader className="border-b">
                    <CardTitle className="text-xl">Documents</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
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
                                <div className="max-h-60 overflow-y-auto pr-2 custom-scrollbar">
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
                                </div>
                            )}
                          </div>
                        </div>
                    ) : (
                        // New collaborateur - use temporary document storage
                        <div className="space-y-6">
                          <div className="p-4 border rounded-md bg-gray-50">
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
                                    className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
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
                                <div className="border rounded-md divide-y max-h-60 overflow-y-auto custom-scrollbar">
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
                              Ces documents seront associés au collaborateur après l{"'"}enregistrement.
                            </p>
                          </div>
                        </div>
                    )}
                  </CardContent>
                </Card>

                <div className="flex justify-end space-x-4 mt-6 sticky bottom-0 pt-4 pb-2 bg-white border-t">
                  <Button type="button" variant="outline" onClick={() => onSuccess(null)}>
                    Annuler
                  </Button>
                  <Button type="submit" className="px-6">
                    {initialData?.id ? "Mettre à jour" : "Enregistrer"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
  );
}

// Ajoutez ce style global dans votre fichier de styles CSS global (par exemple globals.css)
/*
.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}
*/