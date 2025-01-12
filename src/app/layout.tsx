'use client'

import '../app/globals.css';
import { AuthProvider } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-cream font-noto min-h-screen flex flex-col">
        <AuthProvider>
          <Navbar />
          <main className="p-6 flex-grow">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}