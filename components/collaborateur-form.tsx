"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PieceJustificative, pieceJustificativeService } from "@/services/api";
import { PieceJustificativeList } from "./piece-justificative-list";
import { toast } from "@/components/ui/use-toast";
import { FileCheck } from "lucide-react";

// Define interface for form data
export interface CollaborateurData {
  id?: number;
  nom: string;
  prenom: string;
  cin: string;
  dateNaissance: string;
  lieuNaissance: string;
  adresse: string;
  adresseDomicile?: string; // Add this to match API expectations
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
  const [activeTab, setActiveTab] = useState("info");
  const [loading, setLoading] = useState(false);
  const [documentType, setDocumentType] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update form data if initialData changes (useful for edit mode)
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);

      // If we have a collaborateur ID, fetch their pieces just
      if (initialData.id) {
        loadPiecesJustificatives(initialData.id);
      }
    }
  }, [initialData]);

  // Correction: effet supplémentaire pour mettre à jour l'état du tab quand initialData change
  useEffect(() => {
    // Si nous sommes en mode édition avec un ID valide, nous permettons
    // l'activation de l'onglet documents, sinon nous revenons à l'onglet info
    if (!initialData?.id && activeTab === "documents") {
      setActiveTab("info");
    }
  }, [initialData, activeTab]);

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
    setFormData({
      ...formData,
      [id]: value
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSuccess(formData);
  };

  const handleDocumentTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDocumentType(e.target.value);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(!!e.target.files && e.target.files.length > 0);
  };

  // Correction: fonction pour changer manuellement d'onglet
  const handleTabChange = (value: string) => {
    // Vérifier si on peut changer vers l'onglet "documents"
    if (value === "documents" && !initialData?.id) {
      toast({
        title: "Information",
        description: "Veuillez d'abord enregistrer les informations du collaborateur.",
        variant: "default",
      });
      return; // Ne pas changer d'onglet
    }

    // Si on peut changer d'onglet, mettre à jour l'état
    setActiveTab(value);
  };

  const handlePieceUpload = async () => {
    console.log("Upload attempt:", {
      collaborateurId: initialData?.id,
      documentType,
      fileSelected: !!fileInputRef.current?.files?.[0]
    });

    if (!initialData?.id) {
      toast({
        title: "Information",
        description: "Veuillez d'abord enregistrer les informations du collaborateur.",
        variant: "default",
      });
      setActiveTab("info");
      return;
    }

    const file = fileInputRef.current?.files?.[0];

    if (!documentType || !file) {
      toast({
        title: "Information",
        description: "Veuillez sélectionner un type de document et un fichier.",
        variant: "default",
      });
      return;
    }

    try {
      setLoading(true);
      await pieceJustificativeService.upload(initialData.id, documentType, file);
      toast({
        title: "Succès",
        description: "Document ajouté avec succès",
      });

      // Reset form fields after successful upload
      setDocumentType("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
        setSelectedFile(false);
      }

      // Reload pieces after upload
      loadPiecesJustificatives(initialData.id);
    } catch (error) {
      console.error("Error uploading document:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'upload du document.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePiece = async (pieceId: number) => {
    if (!initialData?.id) return;

    try {
      setLoading(true);
      await pieceJustificativeService.delete(pieceId);
      toast({
        title: "Succès",
        description: "Document supprimé avec succès",
      });
      // Reload pieces after deletion
      loadPiecesJustificatives(initialData.id);
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

  return (
      <div className="max-h-screen overflow-y-auto p-6 bg-white shadow-lg rounded-lg">
        {/* Correction: Utilisation de notre fonction personnalisée pour gérer les changements d'onglets */}
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="mb-6">
            <TabsTrigger value="info">Informations</TabsTrigger>
            {/* Correction: on n'utilise plus le 'disabled' pour gérer le comportement */}
            <TabsTrigger value="documents" className={!initialData?.id ? "opacity-50 cursor-not-allowed" : ""}>
              Documents {!initialData?.id && "(Enregistrer d'abord)"}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="info">
            <form onSubmit={handleSubmit} className="space-y-6">
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

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" value={formData.description} onChange={handleChange} className="h-32" />
              </div>

              <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline" onClick={() => onSuccess(null)}>
                  Annuler
                </Button>
                <Button type="submit">
                  {initialData?.id ? "Mettre à jour" : "Enregistrer"}
                </Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="documents">
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-4">Ajouter un document</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="documentType">Type de document</Label>
                    <select
                        id="documentType"
                        className="w-full border border-gray-300 rounded-md p-2 mt-1"
                        value={documentType}
                        onChange={handleDocumentTypeChange}
                    >
                      <option value="" disabled>Sélectionner un type</option>
                      <option value="CIN">CIN</option>
                      <option value="DIPLOME">Diplôme</option>
                      <option value="AUTRE">Autre</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="documentFile">Fichier</Label>
                    <Input
                        id="documentFile"
                        type="file"
                        className="mt-1"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                    />
                  </div>
                </div>

                <Button
                    className="mt-4"
                    onClick={handlePieceUpload}
                    disabled={loading || !documentType || !selectedFile || !initialData?.id}
                >
                  <FileCheck className="mr-2 h-4 w-4" />
                  {loading ? "En cours d'upload..." : "Ajouter le document"}
                </Button>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">Documents du collaborateur</h3>
                {loading && pieces.length === 0 ? (
                    <p>Chargement des documents...</p>
                ) : pieces.length === 0 ? (
                    <p className="text-gray-500 italic">Aucun document disponible</p>
                ) : (
                    <PieceJustificativeList
                        collaborateurId={initialData?.id || 0}
                        pieces={pieces}
                        onUpdate={() => initialData?.id && loadPiecesJustificatives(initialData.id)}
                        onDelete={handleDeletePiece}
                    />
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
  );
}