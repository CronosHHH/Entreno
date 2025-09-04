"use client";

import React from 'react';

interface ModernHeroBackgroundProps {
  children: React.ReactNode;
}

export function ModernHeroBackground({ children }: ModernHeroBackgroundProps) {

    return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Capas de fondo con efectos modernos */}
       <div className="absolute inset-0 z-0">
         {/* Fondo negro transparente casi opaco */}
         <div className="absolute inset-0 bg-black/85" />
         
         {/* Orbes de luz blancos grandes */}
         <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/40 rounded-full blur-3xl animate-pulse" />
         <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-white/35 rounded-full blur-3xl animate-pulse delay-1000" />
         <div className="absolute top-1/2 left-0 w-64 h-64 bg-white/45 rounded-full blur-2xl animate-pulse delay-500" />
       </div>

      {/* Contenido principal */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
}
