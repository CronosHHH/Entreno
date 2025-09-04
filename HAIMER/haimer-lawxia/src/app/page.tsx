"use client";
import { useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import Link from 'next/link';
import Header from '@/components/Header';
import { Space_Mono } from 'next/font/google';
import SignInButton from '@/components/SignInButton';
import { useAuth } from '@/hooks/useAuth';

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400'],
  style: ['italic', 'normal'],
  variable: '--font-space-mono',
});

// Texto principal
const headline = 'Desbloquea la Ley. Domina tus Decisiones.';

// Variantes para animación de aparición letra por letra
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.035,
    },
  },
};
const charVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25 } },
};

export default function LandingPage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-primaryBackground relative overflow-hidden">
      {/* Header flotante, siempre visible */}
      <Header variant="landing" />
      <main className="flex-1 flex items-center justify-center relative z-30">
        <section className="flex flex-col items-center max-w-md w-full mt-8">
          <h1 className="text-6xl font-bold mb-6 text-white drop-shadow-2xl font-roboto">HAIMER</h1>
          <p className={`text-xl text-white/90 mb-8 text-center italic font-space-mono`}>
            "La ley es razón libre de pasión."— Aristóteles
          </p>
          <SignInButton title={isAuthenticated ? "Ir al Chat" : "Iniciar sesión"} />
        </section>
      </main>
    </div>
  );
}
// NOTA: Asegúrate de tener el video /videos/oracle-background.mp4 en la carpeta public/videos
