"use client";
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { useState } from 'react';

// Firebase imports and config
import { auth } from "@/services/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { SignIn1 } from "@/components/ui/modern-stunning-sign-in";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header variant="landing" />
      <SignIn1 />
    </div>
  );
} 