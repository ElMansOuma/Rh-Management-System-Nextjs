// app/layout.tsx
import './globals.css'

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

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
        <body className={inter.className}>
        {children}
        </body>
        </html>
    );
}