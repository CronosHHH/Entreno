"use client";
import Header from '@/components/Header';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

// Firebase imports and config
import { auth } from "@/services/firebase";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

export default function SignUpPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  const isFormValid =
    username.trim() !== "" &&
    password.trim() !== "" &&
    confirmPassword.trim() !== "" &&
    email.trim() !== "" &&
    phone.trim() !== "" &&
    password === confirmPassword;

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }
    // Firebase register
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push('/signin');
    } catch (err) {
      let msg = '';
      if (err instanceof Error) {
        msg = err.message;
      } else if (typeof err === 'object' && err && 'message' in err) {
        msg = (err as any).message;
      }
      setError("Error al registrar usuario: " + (msg || ''));
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header variant="landing" />
      <main className="flex-1 flex items-center justify-center">
        <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden w-full rounded-xl">
          {/* Centered glass card */}
          <div className="relative z-10 w-full max-w-sm rounded-3xl p-8 flex flex-col items-center mt-32 border border-white/20 shadow-[0_0_6px_rgba(0,0,0,0.03),0_2px_6px_rgba(0,0,0,0.08),inset_3px_3px_0.5px_-3px_rgba(0,0,0,0.9),inset_-3px_-3px_0.5px_-3px_rgba(0,0,0,0.85),inset_1px_1px_1px_-0.5px_rgba(0,0,0,0.6),inset_-1px_-1px_1px_-0.5px_rgba(0,0,0,0.6),inset_0_0_6px_6px_rgba(0,0,0,0.12),inset_0_0_2px_2px_rgba(0,0,0,0.06),0_0_12px_rgba(255,255,255,0.15)] transition-all bg-white/10 backdrop-blur-lg backdrop-brightness-110 text-black" style={{ backdropFilter: 'url("#container-glass") blur(16px) brightness(1.1)' }}>
            {/* SVG filter for glass effect */}
            <svg className="hidden">
              <defs>
                <filter
                  id="container-glass"
                  x="0%"
                  y="0%"
                  width="100%"
                  height="100%"
                  colorInterpolationFilters="sRGB"
                >
                  <feTurbulence type="fractalNoise" baseFrequency="0.05 0.05" numOctaves="1" seed="1" result="turbulence" />
                  <feGaussianBlur in="turbulence" stdDeviation="1.2" result="blurredNoise" />
                  <feDisplacementMap in="SourceGraphic" in2="blurredNoise" scale="30" xChannelSelector="R" yChannelSelector="B" result="displaced" />
                  <feGaussianBlur in="displaced" stdDeviation="2" result="finalBlur" />
                  <feComposite in="finalBlur" in2="finalBlur" operator="over" />
                </filter>
              </defs>
            </svg>
            {/* Logo */}
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white/20 mb-6 shadow-lg">
              <img src="/images/haimer-white-logo.png" alt="HAIMER Logo" className="w-12 h-12 object-contain" />
            </div>
            {/* Title */}
            <h2 className="text-2xl font-semibold text-black mb-6 text-center">
              HAIMER
            </h2>
            {/* Form */}
            <form onSubmit={handleSignUp} className="flex flex-col w-full gap-4">
              <input
                placeholder="Usuario"
                type="text"
                value={username}
                className="w-full px-5 py-3 rounded-xl bg-white/30 text-black placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 border border-gray-300"
                onChange={e => setUsername(e.target.value)}
                required
              />
              <input
                placeholder="Correo"
                type="email"
                value={email}
                className="w-full px-5 py-3 rounded-xl bg-white/30 text-black placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 border border-gray-300"
                onChange={e => setEmail(e.target.value)}
                required
              />
              <input
                placeholder="Contraseña"
                type="password"
                value={password}
                className="w-full px-5 py-3 rounded-xl bg-white/30 text-black placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 border border-gray-300"
                onChange={e => setPassword(e.target.value)}
                required
              />
              <input
                placeholder="Confirmar contraseña"
                type="password"
                value={confirmPassword}
                className="w-full px-5 py-3 rounded-xl bg-white/30 text-black placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 border border-gray-300"
                onChange={e => setConfirmPassword(e.target.value)}
                required
              />
              {error && <div className="text-sm text-red-400 text-left">{error}</div>}
            <button
              type="submit"
                className="w-full bg-white/40 text-black font-medium px-5 py-3 rounded-full shadow hover:bg-white/60 transition mb-3 text-sm border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!isFormValid}
            >
              Registrarse
            </button>
          </form>
            {/* Google Sign Up */}
            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-b from-[#232526] to-[#2d2e30] rounded-full px-5 py-3 font-medium text-white shadow hover:brightness-110 transition mb-2 text-sm"
              onClick={async () => {
                setError("");
                const provider = new GoogleAuthProvider();
                try {
                  await signInWithPopup(auth, provider);
                  router.push('/chat/main');
                } catch (err) {
                  setError("Error al registrarse con Google");
                }
              }}
            >
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                className="w-5 h-5"
              />
              Registrarse con Google
            </button>
            <div className="w-full text-center mt-2">
              <span className="text-xs text-gray-400">
                ¿Ya tienes cuenta?{' '}
                <a
                  href="/signin"
                  className="underline text-white/80 hover:text-white"
                >
                  Inicia sesión
                </a>
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 