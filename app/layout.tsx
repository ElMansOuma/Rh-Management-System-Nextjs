import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { MainNav } from '@/components/main-nav';
import { UserNav } from '@/components/user-nav';
import { Sidebar } from '@/components/sidebar';
import {ToastProvider} from "@/components/ui/toast";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Gestion RH',
  description: 'Système de gestion des ressources humaines',
};

export default function RootLayout({
                                     children,
                                   }: {
  children: React.ReactNode;
}) {
  return (
      <html lang="fr">
      <body className={`${inter.className} gradient-bg min-h-screen`}>
      <div className="navbar sticky top-0 z-50">
        <div className="flex h-16 items-center px-4">
          <MainNav />
          <div className="ml-auto flex items-center space-x-4">
            <UserNav />
          </div>
        </div>
      </div>
      <div className="flex">
        <aside className="sidebar w-64 fixed h-[calc(100vh-4rem)] top-16">
          <Sidebar />
        </aside>
          <main className="flex-1 ml-64 p-8">  <ToastProvider>{children}</ToastProvider></main>
      </div>
    <footer/>
      </body>
      </html>
  );
}