"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { Users } from "lucide-react";

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
  description: ""
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
  const [loading, setLoading] = useState(false);

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
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [id]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Submit the data
      onSuccess(formData);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="container mx-auto py-10 px-4">
          <Card className="max-w-4xl mx-auto shadow-lg border-t-4 border-t-blue-600">
            <CardHeader className="sticky top-0 bg-white z-10 border-b pb-6">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <Users className="h-7 w-7 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold text-gray-900">
                    {initialData?.id ? "Modifier un Collaborateur" : "Ajouter un Collaborateur"}
                  </CardTitle>
                  <p className="text-gray-500 text-sm mt-1">Remplissez les informations du collaborateur</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="max-h-[80vh] overflow-y-auto custom-scrollbar px-6 pt-6 pb-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Personal Information Section */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                    <span className="bg-blue-100 text-blue-600 w-6 h-6 rounded-full inline-flex items-center justify-center mr-2 text-sm">1</span>
                    Informations Personnelles
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="space-y-2">
                      <Label htmlFor="nom" className="text-gray-700">Nom</Label>
                      <Input
                          id="nom"
                          value={formData.nom}
                          onChange={handleChange}
                          required
                          className="border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                          placeholder="Entrez le nom"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="prenom" className="text-gray-700">Prénom</Label>
                      <Input
                          id="prenom"
                          value={formData.prenom}
                          onChange={handleChange}
                          required
                          className="border-gray-300 focus:border-blue-500"
                          placeholder="Entrez le prénom"
                      />
                    </div>


                    <div className="space-y-2">
                      <Label htmlFor="cin" className="text-gray-700">CIN</Label>
                      <Input
                          id="cin"
                          value={formData.cin}
                          onChange={handleChange}
                          required
                          className="border-gray-300 focus:border-blue-500"
                          placeholder="Ex: AB123456"
                      />
                    </div>


                    <div className="space-y-2">
                      <Label htmlFor="cnss" className="text-gray-700">CNSS</Label>
                      <Input
                          id="cnss"
                          value={formData.cnss}
                          onChange={handleChange}
                          required
                          className="border-gray-300 focus:border-blue-500"
                          placeholder="Numéro CNSS"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dateNaissance" className="text-gray-700">Date de Naissance</Label>
                      <Input
                          id="dateNaissance"
                          type="date"
                          value={formData.dateNaissance || ""}
                          onChange={handleChange}
                          className="border-gray-300 focus:border-blue-500"
                      />
                    </div>


                    <div className="space-y-2">
                      <Label htmlFor="lieuNaissance" className="text-gray-700">Lieu de Naissance</Label>
                      <Input
                          id="lieuNaissance"
                          value={formData.lieuNaissance}
                          onChange={handleChange}
                          required
                          className="border-gray-300 focus:border-blue-500"
                          placeholder="Ville de naissance"
                      />
                    </div>


                    <div className="space-y-2">
                      <Label htmlFor="adresse" className="text-gray-700">Adresse</Label>
                      <Input
                          id="adresse"
                          value={formData.adresse}
                          onChange={handleChange}
                          required
                          className="border-gray-300 focus:border-blue-500"
                          placeholder="Adresse complète"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="origine" className="text-gray-700">Origine</Label>
                      <Input
                          id="origine"
                          value={formData.origine}
                          onChange={handleChange}
                          required
                          className="border-gray-300 focus:border-blue-500"
                          placeholder="Pays/Ville d'origine"
                      />
                    </div>
                  </div>
                </div>

                {/* Professional Information Section */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                    <span className="bg-blue-100 text-blue-600 w-6 h-6 rounded-full inline-flex items-center justify-center mr-2 text-sm">2</span>
                    Informations Professionnelles
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="space-y-2">
                      <Label htmlFor="niveauEtude" className="text-gray-700">Niveau d{"'"}Étude</Label>
                      <select
                          id="niveauEtude"
                          value={formData.niveauEtude}
                          onChange={handleChange}
                          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                      <Label htmlFor="specialite" className="text-gray-700">Spécialité</Label>
                      <select
                          id="specialite"
                          value={formData.specialite}
                          onChange={handleChange}
                          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                      <Label htmlFor="dateEntretien" className="text-gray-700">Date d{"'"}Entretien</Label>
                      <Input
                          id="dateEntretien"
                          type="date"
                          value={formData.dateEntretien || ""}
                          onChange={handleChange}
                          className="border-gray-300 focus:border-blue-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dateEmbauche" className="text-gray-700">Date d{"'"}Embauche</Label>
                      <Input
                          id="dateEmbauche"
                          type="date"
                          value={formData.dateEmbauche || ""}
                          onChange={handleChange}
                          className="border-gray-300 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Description Section */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                    <span className="bg-blue-100 text-blue-600 w-6 h-6 rounded-full inline-flex items-center justify-center mr-2 text-sm">3</span>
                    Informations Additionnelles
                  </h3>
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="space-y-2">
                      <Label htmlFor="description" className="text-gray-700">Description / Notes</Label>
                      <Textarea
                          id="description"
                          value={formData.description}
                          onChange={handleChange}
                          className="h-32 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                          placeholder="Notes supplémentaires sur le collaborateur..."
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-4 mt-8 sticky bottom-0 pt-4 pb-2 bg-gradient-to-t from-white via-white to-transparent border-t">
                  <Button
                      type="button"
                      variant="outline"
                      onClick={() => onSuccess(null)}
                      className="border-gray-300 hover:bg-gray-100 transition-colors"
                  >
                    Annuler
                  </Button>
                  <Button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 transition-colors px-6"
                      disabled={loading}
                  >
                    {loading ? "Traitement..." : initialData?.id ? "Mettre à jour" : "Enregistrer"}
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