"use client";

import '../app/globals.css';
import { Inter } from 'next/font/google';
import Navbar from '../components/Navbar';
import { AuthProvider } from '../src/context/AuthContext';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* No more nprogress.css link */}
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <Navbar />
          <main className="flex-grow">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}