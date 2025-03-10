"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Users } from "lucide-react";
import { DatePicker } from "@/components/ui/date-picker";

export default function Home() {
  // État pour stocker les données du formulaire
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    cin: "",
    dateNaissance: null as Date | null, // Utilisation de `Date | null`
    lieuNaissance: "",
    adresse: "",
    cnss: "",
    origine: "",
    niveauEtude: "",
    specialite: "",
    dateEntretien: null as Date | null, // Utilisation de `Date | null`
    dateEmbauche: null as Date | null, // Utilisation de `Date | null`
    description: "",
  });

  // Gestion de la soumission du formulaire
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Données du formulaire :", formData); // Afficher les données dans la console
    // Ici vous pouvez ajouter la logique pour sauvegarder les données
  };

  return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto py-8">
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <div className="flex items-center space-x-4">
                <Users className="h-8 w-8 text-blue-600" />
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Gestion des Collaborateurs
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Champ Nom */}
                  <div className="space-y-2">
                    <Label htmlFor="nom">Nom</Label>
                    <Input
                        id="nom"
                        value={formData.nom}
                        onChange={(e) =>
                            setFormData({ ...formData, nom: e.target.value })
                        }
                        required
                    />
                  </div>

                  {/* Champ Prénom */}
                  <div className="space-y-2">
                    <Label htmlFor="prenom">Prénom</Label>
                    <Input
                        id="prenom"
                        value={formData.prenom}
                        onChange={(e) =>
                            setFormData({ ...formData, prenom: e.target.value })
                        }
                        required
                    />
                  </div>

                  {/* Champ CIN */}
                  <div className="space-y-2">
                    <Label htmlFor="cin">CIN</Label>
                    <Input
                        id="cin"
                        value={formData.cin}
                        onChange={(e) =>
                            setFormData({ ...formData, cin: e.target.value })
                        }
                        required
                    />
                  </div>

                  {/* Champ Date de Naissance */}
                  <div className="space-y-2">
                    <Label>Date de Naissance</Label>
                    <DatePicker
                        date={formData.dateNaissance}
                        setDate={(date) =>
                            setFormData({ ...formData, dateNaissance: date })
                        }
                    />
                  </div>

                  {/* Champ Lieu de Naissance */}
                  <div className="space-y-2">
                    <Label htmlFor="lieuNaissance">Lieu de Naissance</Label>
                    <Input
                        id="lieuNaissance"
                        value={formData.lieuNaissance}
                        onChange={(e) =>
                            setFormData({ ...formData, lieuNaissance: e.target.value })
                        }
                        required
                    />
                  </div>

                  {/* Champ Adresse */}
                  <div className="space-y-2">
                    <Label htmlFor="adresse">Adresse</Label>
                    <Input
                        id="adresse"
                        value={formData.adresse}
                        onChange={(e) =>
                            setFormData({ ...formData, adresse: e.target.value })
                        }
                        required
                    />
                  </div>

                  {/* Champ CNSS */}
                  <div className="space-y-2">
                    <Label htmlFor="cnss">CNSS</Label>
                    <Input
                        id="cnss"
                        value={formData.cnss}
                        onChange={(e) =>
                            setFormData({ ...formData, cnss: e.target.value })
                        }
                        required
                    />
                  </div>

                  {/* Champ Origine */}
                  <div className="space-y-2">
                    <Label htmlFor="origine">Origine</Label>
                    <Input
                        id="origine"
                        value={formData.origine}
                        onChange={(e) =>
                            setFormData({ ...formData, origine: e.target.value })
                        }
                        required
                    />
                  </div>

                  {/* Champ Niveau d'Étude */}
                  <div className="space-y-2">
                    <Label htmlFor="niveauEtude">Niveau d{"'"}Étude</Label>
                    <Input
                        id="niveauEtude"
                        value={formData.niveauEtude}
                        onChange={(e) =>
                            setFormData({ ...formData, niveauEtude: e.target.value })
                        }
                        required
                    />
                  </div>

                  {/* Champ Spécialité */}
                  <div className="space-y-2">
                    <Label htmlFor="specialite">Spécialité</Label>
                    <Input
                        id="specialite"
                        value={formData.specialite}
                        onChange={(e) =>
                            setFormData({ ...formData, specialite: e.target.value })
                        }
                        required
                    />
                  </div>

                  {/* Champ Date d'Entretien */}
                  <div className="space-y-2">
                    <Label>Date d{"'"}Entretien</Label>
                    <DatePicker
                        date={formData.dateEntretien}
                        setDate={(date) =>
                            setFormData({ ...formData, dateEntretien: date })
                        }
                    />
                  </div>

                  {/* Champ Date d'Embauche */}
                  <div className="space-y-2">
                    <Label>Date d{"'"}Embauche</Label>
                    <DatePicker
                        date={formData.dateEmbauche}
                        setDate={(date) =>
                            setFormData({ ...formData, dateEmbauche: date })
                        }
                    />
                  </div>
                </div>

                {/* Champ Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) =>
                          setFormData({ ...formData, description: e.target.value })
                      }
                      className="h-32"
                  />
                </div>

                {/* Bouton de soumission */}
                <Button type="submit" className="w-full">
                  Enregistrer le Collaborateur
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
  );
}