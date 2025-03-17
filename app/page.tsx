'use client';
import './home.css'
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Users, Calendar, ClipboardCheck, FileText, ArrowRight, Building2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
      <div className="min-h-screen">
        {/* Navigation */}
        <nav className="fixed w-full bg-gray-800/80 backdrop-blur-sm border-gray-700 border-b z-50">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="h-6 w-6 text-blue-200" />
              <span className="font-bold text-xl text-white">RH Pro</span>
            </div>
            <div className="flex gap-4">
              <Link href="/login">
                <Button variant="ghost" className="text-white hover:text-blue-200">Se connecter</Button>
              </Link>
              <Link href="/register">
                <Button className="bg-blue-200 text-gray-800 hover:bg-blue-300">S'inscrire</Button>
              </Link>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="container mx-auto px-4 pt-32 pb-20">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-5xl lg:text-7xl font-bold tracking-tight mb-6 text-transparent bg-gradient-to-r from-white to-blue-200 bg-clip-text">
                Gestion RH Simplifiée
              </h1>
              <p className="text-xl text-white/80 max-w-2xl mb-8">
                Transformez votre gestion des ressources humaines avec notre solution complète et intuitive.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/login">
                  <Button size="lg" className="w-full sm:w-auto bg-blue-200 text-gray-800 hover:bg-blue-300">
                    Commencer maintenant
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto border-white/20 text-white hover:bg-white/10">
                    Créer un compte
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex-1 relative w-full max-w-xl aspect-square">
              <Image
                  src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=800"
                  alt="Espace de travail moderne"
                  fill
                  className="object-cover rounded-2xl shadow-2xl opacity-90"
                  priority
              />
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="container mx-auto px-4 py-20 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-700/50 to-transparent" />
          <h2 className="text-3xl font-bold text-center mb-12 text-white">Fonctionnalités principales</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            <Card className="p-8 hover:shadow-xl transition-all hover:-translate-y-1 bg-gray-800/50 backdrop-blur-sm border-gray-700">
              <Users className="h-12 w-12 text-blue-200 mb-6" />
              <h3 className="text-xl font-semibold mb-3 text-white">Gestion du Personnel</h3>
              <p className="text-white/70">
                Centralisez et gérez efficacement toutes les informations de vos employés.
              </p>
            </Card>

            <Card className="p-8 hover:shadow-xl transition-all hover:-translate-y-1 bg-gray-800/50 backdrop-blur-sm border-gray-700">
              <Calendar className="h-12 w-12 text-blue-200 mb-6" />
              <h3 className="text-xl font-semibold mb-3 text-white">Gestion des Congés</h3>
              <p className="text-white/70">
                Optimisez la gestion des congés avec un système automatisé et transparent.
              </p>
            </Card>

            <Card className="p-8 hover:shadow-xl transition-all hover:-translate-y-1 bg-gray-800/50 backdrop-blur-sm border-gray-700">
              <ClipboardCheck className="h-12 w-12 text-blue-200 mb-6" />
              <h3 className="text-xl font-semibold mb-3 text-white">Pointage</h3>
              <p className="text-white/70">
                Suivez le temps de travail en temps réel avec des outils modernes.
              </p>
            </Card>

            <Card className="p-8 hover:shadow-xl transition-all hover:-translate-y-1 bg-gray-800/50 backdrop-blur-sm border-gray-700">
              <FileText className="h-12 w-12 text-blue-200 mb-6" />
              <h3 className="text-xl font-semibold mb-3 text-white">Gestion des Contrats</h3>
              <p className="text-white/70">
                Gérez et suivez tous vos contrats de travail en un seul endroit.
              </p>
            </Card>
          </div>
        </div>
      </div>
  );
}