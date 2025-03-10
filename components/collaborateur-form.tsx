"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// Define interface for form data
export interface CollaborateurData {
  nom: string;
  prenom: string;
  cin: string;
  dateNaissance: string;
  lieuNaissance: string;
  adresse: string;
  cnss: string;
  origine: string;
  niveauEtude: string;
  specialite: string;
  dateEntretien: string;
  dateEmbauche: string;
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
  dateNaissance: "",
  lieuNaissance: "",
  adresse: "",
  cnss: "",
  origine: "",
  niveauEtude: "",
  specialite: "",
  dateEntretien: "",
  dateEmbauche: "",
  description: ""
};

export function CollaborateurForm({ onSuccess, initialData }: CollaborateurFormProps) {
  const [formData, setFormData] = useState<CollaborateurData>(initialData || emptyFormData);

  // Update form data if initialData changes (useful for edit mode)
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

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

  return (
      <div className="max-h-screen overflow-y-auto p-6 bg-white shadow-lg rounded-lg">
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
              {initialData ? "Mettre à jour" : "Enregistrer"}
            </Button>
          </div>
        </form>
      </div>
  );
}