"use client";
import Header from '@/components/Header';
import { HeroSection } from '@/components/blocks/hero-section-1';
import { FeaturesSectionDemo } from '@/components/FeaturesSectionDemo';
import { Features } from '@/components/features-7';
import { DemoOne } from '@/components/ui/demo';
import { ModernFeatureBackground } from '@/components/ui/modern-feature-background';

export default function AboutLawxiaPage() {
  return (
    <div className="min-h-screen flex flex-col bg-primaryBackground">
      <Header variant="landing" />
      <main className="flex-1 flex flex-col items-center justify-start w-full">
        <section className="w-full">
          <HeroSection />
          <ModernFeatureBackground>
            <FeaturesSectionDemo />
          </ModernFeatureBackground>
        </section>
      </main>
      <section className="w-full relative overflow-hidden">
        {/* Background como hero-section-1 */}
        <div
          aria-hidden
          className="z-[2] absolute inset-0 pointer-events-none isolate opacity-50 contain-strict hidden lg:block">
          <div className="w-[35rem] h-[80rem] -translate-y-[350px] absolute left-0 top-0 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(0,0%,85%,.08)_0,hsla(0,0%,55%,.02)_50%,hsla(0,0%,45%,0)_80%)]" />
          <div className="h-[80rem] absolute left-0 top-0 w-56 -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.06)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)] [translate:5%_-50%]" />
          <div className="h-[80rem] -translate-y-[350px] absolute left-0 top-0 w-56 -rotate-45 bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.04)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)]" />
        </div>
        
        {/* Gradiente de fondo */}
        <div aria-hidden className="absolute inset-0 -z-10 size-full [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,var(--background)_75%)]" />
        
        {/* Contenido de Features */}
        <div className="relative z-10">
          <Features />
        </div>
      </section>
      
      <section className="w-full relative overflow-hidden bg-black">
        {/* Background oscuro con gradientes sutiles */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
        
        {/* Elementos decorativos sutiles */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.05),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.03),transparent_50%)]"></div>
        
        {/* Orbes de luz muy sutiles */}
        <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-24 h-24 bg-white/3 rounded-full blur-2xl animate-pulse delay-1000"></div>
        
        {/* Contenido de DemoOne */}
        <div className="relative z-10">
          <DemoOne />
        </div>
      </section>
    </div>
  );
} 