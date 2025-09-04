"use client" 

import * as React from "react"
import { useState } from "react";
import { useRouter } from 'next/navigation';
import { auth } from "@/services/firebase";
import { GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";

const SignIn1 = () => {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
 
  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };
 
  const handleSignIn = async () => {
    if (!email || !password) {
      setError("Por favor ingresa correo y contraseña.");
      return;
    }
    if (!validateEmail(email)) {
      setError("Por favor ingresa un correo válido.");
      return;
    }
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/chat/main');
    } catch (err) {
      setError("Usuario o contraseña incorrectos");
    }
  };
 
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden w-full rounded-xl">
      {/* Centered glass card */}
      <div className="relative z-10 w-full max-w-sm rounded-3xl p-8 flex flex-col items-center mt-24 border border-white/20 shadow-[0_0_6px_rgba(0,0,0,0.03),0_2px_6px_rgba(0,0,0,0.08),inset_3px_3px_0.5px_-3px_rgba(0,0,0,0.9),inset_-3px_-3px_0.5px_-3px_rgba(0,0,0,0.85),inset_1px_1px_1px_-0.5px_rgba(0,0,0,0.6),inset_-1px_-1px_1px_-0.5px_rgba(0,0,0,0.6),inset_0_0_6px_6px_rgba(0,0,0,0.12),inset_0_0_2px_2px_rgba(0,0,0,0.06),0_0_12px_rgba(255,255,255,0.15)] transition-all bg-white/10 backdrop-blur-lg backdrop-brightness-110 text-black" style={{ backdropFilter: 'url("#container-glass") blur(16px) brightness(1.1)' }}>
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
        <div className="flex flex-col w-full gap-4">
          <div className="w-full flex flex-col gap-3">
            <input
              placeholder="Email"
              type="email"
              value={email}
              className="w-full px-5 py-3 rounded-xl bg-white/30 text-black placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 border border-gray-300"
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              placeholder="Password"
              type="password"
              value={password}
              className="w-full px-5 py-3 rounded-xl bg-white/30 text-black placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 border border-gray-300"
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && (
              <div className="text-sm text-red-400 text-left">{error}</div>
            )}
          </div>
          <hr className="opacity-10" />
          <div>
            <button
              onClick={handleSignIn}
              className="w-full bg-white/40 text-black font-medium px-5 py-3 rounded-full shadow hover:bg-white/60 transition mb-3 text-sm border border-gray-300"
            >
              Sign in
            </button>
            {/* Google Sign In */}
            <button
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-b from-[#232526] to-[#2d2e30] rounded-full px-5 py-3 font-medium text-white shadow hover:brightness-110 transition mb-2 text-sm"
              type="button"
              onClick={async () => {
                setError("");
                const provider = new GoogleAuthProvider();
                try {
                  await signInWithPopup(auth, provider);
                  router.push('/chat/main');
                } catch (err) {
                  setError("Error al iniciar sesión con Google");
                }
              }}
            >
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                className="w-5 h-5"
              />
              Continue with Google
            </button>
            <div className="w-full text-center mt-2">
              <span className="text-xs text-gray-400">
                Don&apos;t have an account?{" "}
                <a
                  href="/signup"
                  className="underline text-white/80 hover:text-white"
                >
                  Sign up, it&apos;s free!
                </a>
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* User count and avatars */}
      <div className="relative z-10 mt-12 flex flex-col items-center text-center">
        <p className="text-gray-400 text-sm mb-2">
          Join <span className="font-medium text-white">thousands</span> of
          developers who are already using HextaUI.
        </p>
        <div className="flex">
          <img
            src="https://randomuser.me/api/portraits/men/32.jpg"
            alt="user"
            className="w-8 h-8 rounded-full border-2 border-[#181824] object-cover"
          />
          <img
            src="https://randomuser.me/api/portraits/women/44.jpg"
            alt="user"
            className="w-8 h-8 rounded-full border-2 border-[#181824] object-cover"
          />
          <img
            src="https://randomuser.me/api/portraits/men/54.jpg"
            alt="user"
            className="w-8 h-8 rounded-full border-2 border-[#181824] object-cover"
          />
          <img
            src="https://randomuser.me/api/portraits/women/68.jpg"
            alt="user"
            className="w-8 h-8 rounded-full border-2 border-[#181824] object-cover"
          />
        </div>
      </div>
    </div>
  );
};
 
export { SignIn1 };