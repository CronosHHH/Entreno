"use client";
import Header from '@/components/Header';
import ScrollExpandMedia from '@/components/scroll-expansion-hero';
import { FeatureStepsDemo } from '@/components/ui/demo-feature';
import { ModernHeroBackground } from '@/components/ui/modern-hero-background';

const sampleMediaContent = {
  video: {
    src: '/videos/Congreso.mp4',
    poster: undefined,
    background: undefined,
    title: 'La próxima era empieza aquí.',
    date: 'HAIMER',
    scrollToExpand: 'Transformamos retos en futuro.',
    about: {
      overview:
        'Te presentamos la primera IA que habla un solo idioma: el del Boletín Oficial del Estado. No interpreta, no opina, no se equivoca.',
      conclusion:
        'Es tu acceso directo y sin filtros a la normativa que rige tu vida y tu negocio.',
    },
  },
};

export default function CompanyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-primaryBackground">
      <Header variant="landing" />
      <main className="flex-1 flex flex-col items-center justify-start w-full">
        <section className="w-full relative">
          <ModernHeroBackground>
            <ScrollExpandMedia
              mediaType="video"
              mediaSrc={sampleMediaContent.video.src}
              posterSrc={sampleMediaContent.video.poster || undefined}
              bgImageSrc={sampleMediaContent.video.background || undefined}
              title={sampleMediaContent.video.title}
              date={sampleMediaContent.video.date}
              scrollToExpand={sampleMediaContent.video.scrollToExpand}
              textBlend
            >
              {/* Contenido eliminado: About This Component y los dos párrafos */}
            </ScrollExpandMedia>
          </ModernHeroBackground>
        </section>
        
        <section className="w-full relative">
          <FeatureStepsDemo />
          
          {/* Degradado blanco de transición - más transparente al final */}
          <div 
            aria-hidden 
            className="absolute inset-0 -z-10 size-full [background:radial-gradient(150%_150%_at_50%_100%,transparent_0%,var(--background)_40%,transparent_80%)]"
          />
        </section>
        
        {/* Sección de Contacto Seria y Profesional */}
        <section className="w-full py-24 px-4 relative overflow-hidden bg-black/20 backdrop-blur-sm">
          {/* Fondo con tonos oscuros y sutiles */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-gray-900/30 to-black/50"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,0,0,0.3),transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(20,20,20,0.4),transparent_50%)]"></div>
          
          {/* Elementos decorativos sutiles */}
          <div className="absolute top-20 left-10 w-32 h-32 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-white/3 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-white/4 rounded-full blur-2xl"></div>
          
          <div className="relative z-10 max-w-6xl mx-auto text-center">
            {/* Badge superior */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-sm font-thin text-white/80 mb-8 font-roboto">
              <span className="w-2 h-2 bg-white/60 rounded-full mr-2"></span>
              Contacto
            </div>
            
            {/* Título principal */}
            <h2 className="text-5xl md:text-6xl font-thin text-white mb-6 font-roboto tracking-wide">
              Let's talk
            </h2>
            
            {/* Descripción */}
            <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto mb-12 leading-relaxed font-roboto font-light">
              ¿Tienes preguntas o necesitas más información?
            </p>
            
                         {/* Subtítulo motivacional */}
             <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-16 leading-relaxed font-space-mono">
               Contacta con nuestro equipo y demos forma al futuro de algo grande juntos.
             </p>
            
            {/* Botón de contacto con estilo de cristal */}
            <div className="group relative inline-block">
              <button className="relative px-8 py-4 bg-transparent text-white font-thin rounded-md shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden font-roboto">
                {/* Fondo de cristal como el header */}
                <div className="absolute inset-0 rounded-md 
                  shadow-[0_0_6px_rgba(0,0,0,0.03),0_2px_6px_rgba(0,0,0,0.08),inset_3px_3px_0.5px_-3px_rgba(0,0,0,0.9),inset_-3px_-3px_0.5px_-3px_rgba(0,0,0,0.85),inset_1px_1px_1px_-0.5px_rgba(0,0,0,0.6),inset_-1px_-1px_1px_-0.5px_rgba(0,0,0,0.6),inset_0_0_6px_6px_rgba(0,0,0,0.12),inset_0_0_2px_2px_rgba(0,0,0,0.06),0_0_12px_rgba(255,255,255,0.15)] 
                  transition-all backdrop-blur-lg backdrop-brightness-110 border border-white/20"
                  style={{ backdropFilter: 'url("#container-glass") blur(16px) brightness(1.1)' }}>
                </div>
                
                {/* SVG filter para efecto de cristal */}
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
                
                {/* Contenido del botón */}
                <div className="relative flex items-center space-x-3 z-10">
                  <span className="text-lg font-thin">Contáctanos</span>
                  <div className="w-5 h-5 relative">
                    {/* Flecha animada */}
                    <svg 
                      className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={1.5} 
                        d="M17 8l4 4m0 0l-4 4m4-4H3" 
                      />
                    </svg>
                  </div>
                </div>
              </button>
            </div>
            
            {/* Información adicional */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center group">
                <div className="w-16 h-16 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="font-thin text-white/90 mb-2 font-roboto">Email</h3>
                <p className="text-white/60 font-space-mono">info@haimer.com</p>
              </div>
              
              <div className="text-center group">
                <div className="w-16 h-16 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <h3 className="font-thin text-white/90 mb-2 font-roboto">Teléfono</h3>
                <p className="text-white/60 font-space-mono">+34 900 123 456</p>
              </div>
              
              <div className="text-center group">
                <div className="w-16 h-16 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="font-thin text-white/90 mb-2 font-roboto">Ubicación</h3>
                <p className="text-white/60 font-space-mono">Madrid, España</p>
              </div>
            </div>
          </div>
        </section>
      </main>

    </div>
  );
} 