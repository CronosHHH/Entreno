"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Header from '@/components/Header';
import SignInButton from '@/components/SignInButton';
import { useAuth } from '@/hooks/useAuth';

export default function AnimatedLandingContent({ children }: { children: React.ReactNode }) {
  const [fade, setFade] = useState(false);
  const router = useRouter();
  const sectionRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated } = useAuth();

  const handleSignIn = (e: React.MouseEvent) => {
    setFade(true);
    setTimeout(() => {
      if (isAuthenticated) {
        // Si ya está autenticado, redirigir al chat principal
        router.push('/chat/main');
      } else {
        // Si no está autenticado, ir a la página de signin
        router.push("/signin");
      }
    }, 500);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <Header variant="landing" />
      <main className="flex-1 flex items-center justify-center w-full">
        <section
          ref={sectionRef}
          className={`bg-contentBackground rounded-large shadow-none p-10 flex flex-col items-center max-w-md w-full mt-8 transition-opacity duration-500 ${fade ? 'opacity-0' : 'opacity-100'}`}
        >
          {children}
          <SignInButton onClick={handleSignIn} />
        </section>
      </main>
    </div>
  );
} 