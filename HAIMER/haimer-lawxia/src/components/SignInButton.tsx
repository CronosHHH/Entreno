"use client";
import { useRouter } from "next/navigation";
import { LiquidButton } from '@/components/liquid-glass-button';
import { useAuth } from '@/hooks/useAuth';

export default function SignInButton({ onClick, title }: { onClick?: (e: React.MouseEvent) => void, title?: string }) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const handleSignIn = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onClick) {
      onClick(e);
    } else {
      if (isAuthenticated) {
        // Si ya está autenticado, redirigir al chat principal
        router.push('/chat/main');
      } else {
        // Si no está autenticado, ir a la página de signin
        router.push("/signin");
      }
    }
  };

  return (
    <LiquidButton
      onClick={handleSignIn}
      title={title ?? (isAuthenticated ? "Ir al Chat" : "Sign in")}
      className="px-8 py-3 text-lg font-poppins font-thin"
    >
      {title ?? (isAuthenticated ? 'Ir al Chat' : 'Sign in')}
    </LiquidButton>
  );
} 