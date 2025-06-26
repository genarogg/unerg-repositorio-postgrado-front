import type { Metadata } from "next";
import "../sass/style.scss"
import './globals.css'

import { ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';

import AuthProvider from "../context/AuthContext";


export const metadata: Metadata = {
  title: "Postgrado | UNERG",
  description: "Sistema de solicitud de documentos de la UNERG",

};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        {/* <script src="https://unpkg.com/react-scan/dist/auto.global.js"></script> */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;800"
          rel="stylesheet"
        />

        <link rel="shortcut icon" href="/logo.webp" type="image/x-icon" />
      </head>

      <AuthProvider>

        <body className="repository-postgrado">
     
            <>
              <ToastContainer />
              {children}
            </>
        
        </body>

      </AuthProvider>

    </html>
  );
}
