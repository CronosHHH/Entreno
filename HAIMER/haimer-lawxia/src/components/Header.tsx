import Link from 'next/link';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LiquidButton } from '@/components/liquid-glass-button';
import { Menu, X } from 'lucide-react';
import { ClientOnly } from './ClientOnly';
import { useAuth } from '@/hooks/useAuth';

interface HeaderProps {
  variant: 'main' | 'landing';
  userName?: string;
  modelName?: string;
}

// Componente que maneja la detección de color del fondo
function HeaderWithColorDetection({ variant, userName, modelName }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [textColor, setTextColor] = useState('#000000');
  const headerRef = React.useRef<HTMLElement>(null);
  const router = useRouter();
  const { isAuthenticated, user: authUser } = useAuth();

  // Función para manejar el clic en Sign in
  const handleSignInClick = () => {
    if (isAuthenticated) {
      // Si ya está autenticado, redirigir al chat principal
      router.push('/chat/main');
    } else {
      // Si no está autenticado, ir a la página de signin
      router.push('/signin');
    }
  };

  React.useEffect(() => {
    if (!headerRef.current || typeof window === 'undefined') return;

    const detectBackgroundColor = () => {
      try {
        const headerRect = headerRef.current?.getBoundingClientRect();
        if (!headerRect) return;

        // Sample points behind the header
        const samplePoints = [
          { x: headerRect.left + headerRect.width * 0.25, y: headerRect.top + headerRect.height * 0.5 },
          { x: headerRect.left + headerRect.width * 0.5, y: headerRect.top + headerRect.height * 0.5 },
          { x: headerRect.left + headerRect.width * 0.75, y: headerRect.top + headerRect.height * 0.5 },
          { x: headerRect.left + headerRect.width * 0.5, y: headerRect.top - 10 },
          { x: headerRect.left + headerRect.width * 0.5, y: headerRect.bottom + 10 }
        ];

        let totalLuminance = 0;
        let validSamples = 0;

        samplePoints.forEach(point => {
          const elementBelow = document.elementFromPoint(point.x, point.y);
          if (elementBelow) {
            const color = getComputedBackgroundColor(elementBelow);
            if (color) {
              const luminance = calculateLuminance(color);
              if (luminance !== null) {
                totalLuminance += luminance;
                validSamples++;
              }
            }
          }
        });

        if (validSamples > 0) {
          const avgLuminance = totalLuminance / validSamples;
          setTextColor(avgLuminance > 0.6 ? '#000000' : '#FFFFFF');
        }
      } catch (error) {
        console.warn('Error detecting background color:', error);
      }
    };

    // Initial detection
    const initialDetection = setTimeout(detectBackgroundColor, 500);

    // Detect on scroll and resize
    const handleScroll = () => requestAnimationFrame(detectBackgroundColor);
    const handleResize = () => requestAnimationFrame(detectBackgroundColor);

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      clearTimeout(initialDetection);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const getComputedBackgroundColor = (element: Element): string | null => {
    let currentElement: Element | null = element;
    let depth = 0;
    const maxDepth = 5;

    while (currentElement && depth < maxDepth) {
      const computedStyle = window.getComputedStyle(currentElement);
      
      // Check background color
      let backgroundColor = computedStyle.backgroundColor;
      
      if (backgroundColor && 
          backgroundColor !== 'rgba(0, 0, 0, 0)' && 
          backgroundColor !== 'transparent' &&
          backgroundColor !== 'initial' &&
          backgroundColor !== 'inherit') {
        
        // Check alpha for rgba
        if (backgroundColor.startsWith('rgba')) {
          const alphaMatch = backgroundColor.match(/rgba?\([^)]*,\s*([^)]+)\)/);
          if (alphaMatch) {
            const alpha = parseFloat(alphaMatch[1]);
            if (alpha > 0.1) {
              return backgroundColor;
            }
          }
        } else {
          return backgroundColor;
        }
      }

      // Check for background images
      const backgroundImage = computedStyle.backgroundImage;
      if (backgroundImage && backgroundImage !== 'none') {
        // For images, assume medium brightness
        return 'rgba(128, 128, 128, 1)';
      }

      // Check for gradients
      const background = computedStyle.background;
      if (background && background.includes('gradient')) {
        return 'rgba(128, 128, 128, 1)';
      }

      currentElement = currentElement.parentElement;
      depth++;
    }

    return null;
  };

  const calculateLuminance = (color: string): number | null => {
    try {
      let r = 0, g = 0, b = 0;

      if (color.startsWith('rgb')) {
        const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
        if (match) {
          r = parseInt(match[1]);
          g = parseInt(match[2]);
          b = parseInt(match[3]);
        }
      } else if (color.startsWith('#')) {
        const hex = color.slice(1);
        if (hex.length === 3) {
          r = parseInt(hex[0] + hex[0], 16);
          g = parseInt(hex[1] + hex[1], 16);
          b = parseInt(hex[2] + hex[2], 16);
        } else if (hex.length === 6) {
          r = parseInt(hex.slice(0, 2), 16);
          g = parseInt(hex.slice(2, 4), 16);
          b = parseInt(hex.slice(4, 6), 16);
        }
      }

      if (r > 0 || g > 0 || b > 0) {
        const rsRGB = r / 255;
        const gsRGB = g / 255;
        const bsRGB = b / 255;

        const rL = rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4);
        const gL = gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4);
        const bL = bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4);

        return 0.2126 * rL + 0.7152 * gL + 0.0722 * bL;
      }

      return null;
    } catch (error) {
      return null;
    }
  };
  
  if (variant === 'landing') {
    return (
      <header
        ref={headerRef}
        className="fixed left-1/2 top-4 sm:top-8 z-50 -translate-x-1/2 flex items-center justify-between px-4 sm:px-6 md:px-10 py-2 sm:py-3 rounded-md w-[min(95vw,900px)] font-thin bg-transparent border border-white/20"
      >
        <div className="absolute inset-0 z-0 h-full w-full rounded-md shadow-[0_0_6px_rgba(0,0,0,0.03),0_2px_6px_rgba(0,0,0,0.08),inset_3px_3px_0.5px_-3px_rgba(0,0,0,0.9),inset_-3px_-3px_0.5px_-3px_rgba(0,0,0,0.85),inset_1px_1px_1px_-0.5px_rgba(0,0,0,0.6),inset_-1px_-1px_1px_-0.5px_rgba(0,0,0,0.6),inset_0_0_6px_6px_rgba(0,0,0,0.12),inset_0_0_2px_2px_rgba(0,0,0,0.06),0_0_12px_rgba(255,255,255,0.15)] transition-all backdrop-blur-lg backdrop-brightness-110"
          style={{ backdropFilter: 'url("#container-glass") blur(16px) brightness(1.1)' }}></div>
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
        <div className="relative z-10 flex items-center justify-between w-full">
        <div className="flex items-center gap-x-2 sm:gap-x-4 md:gap-x-6">
          <Link href="/" className="flex items-center">
            <img 
              src="/images/lawxia-white-logo.png" 
              alt="Lawxia Logo" 
              className="h-6 sm:h-8 w-auto" 
              style={{ filter: textColor === '#FFFFFF' ? 'brightness(0) invert(1)' : 'brightness(0)' }}
            />
          </Link>
          <Link href="/company" className="hidden sm:block hover:bg-white/10 rounded-medium px-2 sm:px-4 py-2 transition font-poppins text-base sm:text-lg font-thin drop-shadow-md" style={{ color: textColor }}>Company</Link>
          <Link href="/about-lawxia" className="hidden sm:block hover:bg-white/10 rounded-medium px-2 sm:px-4 py-2 transition font-poppins text-base sm:text-lg font-thin drop-shadow-md" style={{ color: textColor }}>About Lawxia</Link>
        </div>
        {/* Botón de menú móvil */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="sm:hidden p-2 hover:bg-white/10 rounded-medium transition font-poppins font-thin drop-shadow-md"
          aria-label="Abrir menú"
          style={{ color: textColor }}
        >
          <Menu size={20} />
        </button>
        
        <button
          onClick={handleSignInClick}
          className="hidden sm:block"
        >
            <LiquidButton className="px-4 sm:px-6 md:px-8 py-2 text-base sm:text-lg font-poppins font-thin" style={{ color: textColor }}>
              {isAuthenticated ? 'Ir al Chat' : 'Sign in'}
            </LiquidButton>
        </button>
        </div>
        
        {/* Menú móvil */}
        {isMobileMenuOpen && (
          <div className="sm:hidden absolute top-full left-0 right-0 mt-2 bg-white/10 backdrop-blur-lg rounded-lg border border-white/20 p-4">
            <div className="flex flex-col gap-3">
              <Link 
                href="/company" 
                className="hover:bg-white/10 rounded-medium px-3 py-2 transition font-poppins text-base font-thin drop-shadow-md"
                onClick={() => setIsMobileMenuOpen(false)}
                style={{ color: textColor }}
              >
                Company
              </Link>
              <Link 
                href="/about-lawxia" 
                className="hover:bg-white/10 rounded-medium px-3 py-2 transition font-poppins text-base font-thin drop-shadow-md"
                onClick={() => setIsMobileMenuOpen(false)}
                style={{ color: textColor }}
              >
                About Lawxia
              </Link>
              <button 
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleSignInClick();
                }}
                className="hover:bg-white/10 rounded-medium px-3 py-2 transition font-poppins text-base font-thin drop-shadow-md text-left w-full"
                style={{ color: textColor }}
              >
                {isAuthenticated ? 'Ir al Chat' : 'Sign in'}
              </button>
            </div>
          </div>
        )}
      </header>
    );
  }
  return (
    <header ref={headerRef} className="w-full flex items-center justify-between px-4 sm:px-6 md:px-8 py-2 sm:py-3 bg-contentBackground rounded-b-large shadow-none bg-black/30 backdrop-blur-sm relative font-thin">
      <div className="flex items-center gap-x-2 sm:gap-x-4 md:gap-x-6">
        <Link href="/" className="flex items-center">
          <img 
            src="/images/lawxia-white-logo.png" 
            alt="Lawxia Logo" 
            className="h-6 sm:h-8 w-auto" 
            style={{ filter: textColor === '#FFFFFF' ? 'brightness(0) invert(1)' : 'brightness(0)' }}
          />
        </Link>
        <Link href="/company" className="hidden sm:block hover:bg-white/10 rounded-medium px-2 sm:px-4 py-2 transition font-poppins text-base sm:text-lg font-thin drop-shadow-md" style={{ color: textColor }}>Company</Link>
        <Link href="/about-lawxia" className="hidden sm:block hover:bg-white/10 rounded-medium px-2 sm:px-4 py-2 transition font-poppins text-base sm:text-lg font-thin drop-shadow-md" style={{ color: textColor }}>About Lawxia</Link>
      </div>
      <div className="flex items-center gap-2 sm:gap-4">
        <span className="hidden sm:block bg-pro-badge bg-clip-text text-transparent font-poppins font-thin text-base sm:text-lg px-2 sm:px-3 py-1 rounded drop-shadow-md" style={{ color: textColor }}>{modelName || 'Gemini 2.5 Pro'}</span>
      </div>
      {/* Botón de menú móvil */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="sm:hidden p-2 hover:bg-white/10 rounded-medium transition font-poppins font-thin drop-shadow-md"
        aria-label="Abrir menú"
        style={{ color: textColor }}
      >
        <Menu size={20} />
      </button>
      
      <div className="flex items-center gap-2">
        <span className="hidden sm:block bg-greeting-text bg-clip-text text-transparent font-poppins font-thin text-base sm:text-lg drop-shadow-md" style={{ color: textColor }}>Hola, {userName || 'Renato'}</span>
        <button className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-componentSubtle flex items-center justify-center font-poppins font-thin text-lg sm:text-xl drop-shadow-md" style={{ color: textColor }}>{userName ? userName[0] : 'R'}</button>
      </div>
      
      {/* Menú móvil */}
      {isMobileMenuOpen && (
        <div className="sm:hidden absolute top-full left-0 right-0 mt-2 bg-black/40 backdrop-blur-lg rounded-lg border border-white/20 p-4">
          <div className="flex flex-col gap-3">
            <Link 
              href="/company" 
              className="hover:bg-white/10 rounded-medium px-2 sm:px-4 py-2 transition font-poppins text-base font-thin drop-shadow-md"
              onClick={() => setIsMobileMenuOpen(false)}
              style={{ color: textColor }}
            >
              Company
            </Link>
            <Link 
              href="/about-lawxia" 
              className="hover:bg-white/10 rounded-medium px-2 sm:px-4 py-2 transition font-poppins text-base font-thin drop-shadow-md"
              onClick={() => setIsMobileMenuOpen(false)}
              style={{ color: textColor }}
            >
              About Lawxia
            </Link>
            <div className="px-3 py-2 text-base font-poppins font-thin drop-shadow-md" style={{ color: textColor }}>
              <span className="bg-pro-badge bg-clip-text text-transparent">{modelName || 'Gemini 2.5 Pro'}</span>
            </div>
            <div className="px-3 py-2 text-base font-poppins font-thin drop-shadow-md" style={{ color: textColor }}>
              <span className="bg-greeting-text bg-clip-text text-transparent">Hola, {userName || 'Renato'}</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

// Componente principal que envuelve la funcionalidad en ClientOnly
export default function Header(props: HeaderProps) {
  return (
    <ClientOnly fallback={<HeaderFallback {...props} />}>
      <HeaderWithColorDetection {...props} />
    </ClientOnly>
  );
}

// Fallback que se renderiza durante SSR
function HeaderFallback({ variant, userName, modelName }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  if (variant === 'landing') {
    return (
      <header className="fixed left-1/2 top-4 sm:top-8 z-50 -translate-x-1/2 flex items-center justify-between px-4 sm:px-6 md:px-10 py-2 sm:py-3 rounded-md w-[min(95vw,900px)] font-thin bg-transparent border border-white/20">
        <div className="absolute inset-0 z-0 h-full w-full rounded-md shadow-[0_0_6px_rgba(0,0,0,0.03),0_2px_6px_rgba(0,0,0,0.08),inset_3px_3px_0.5px_-3px_rgba(0,0,0,0.9),inset_-3px_-3px_0.5px_-3px_rgba(0,0,0,0.85),inset_1px_1px_1px_-0.5px_rgba(0,0,0,0.6),inset_-1px_-1px_1px_-0.5px_rgba(0,0,0,0.6),inset_0_0_6px_6px_rgba(0,0,0,0.12),inset_0_0_2px_2px_rgba(0,0,0,0.06),0_0_12px_rgba(255,255,255,0.15)] transition-all backdrop-blur-lg backdrop-brightness-110"
          style={{ backdropFilter: 'url("#container-glass") blur(16px) brightness(1.1)' }}></div>
        <div className="relative z-10 flex items-center justify-between w-full">
        <div className="flex items-center gap-x-2 sm:gap-x-4 md:gap-x-6">
          <Link href="/" className="flex items-center">
            <img src="/images/lawxia-white-logo.png" alt="Lawxia Logo" className="h-6 sm:h-8 w-auto" />
          </Link>
          <Link href="/company" className="hidden sm:block hover:bg-white/10 rounded-medium px-2 sm:px-4 py-2 transition font-poppins text-base sm:text-lg font-thin drop-shadow-md text-white">Company</Link>
          <Link href="/about-lawxia" className="hidden sm:block hover:bg-white/10 rounded-medium px-2 sm:px-4 py-2 transition font-poppins text-base sm:text-lg font-thin drop-shadow-md text-white">About Lawxia</Link>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="sm:hidden p-2 hover:bg-white/10 rounded-medium transition font-poppins font-thin drop-shadow-md text-white"
          aria-label="Abrir menú"
        >
          <Menu size={20} />
        </button>
        
        <Link href="/signin" className="hidden sm:block">
            <LiquidButton className="px-4 sm:px-6 md:px-8 py-2 text-base sm:text-lg font-poppins font-thin">Sign in</LiquidButton>
        </Link>
        </div>
        
        {isMobileMenuOpen && (
          <div className="sm:hidden absolute top-full left-0 right-0 mt-2 bg-white/10 backdrop-blur-lg rounded-lg border border-white/20 p-4">
            <div className="flex flex-col gap-3">
              <Link href="/company" className="hover:bg-white/10 rounded-medium px-3 py-2 transition font-poppins text-base font-thin drop-shadow-md text-white" onClick={() => setIsMobileMenuOpen(false)}>Company</Link>
              <Link href="/about-lawxia" className="hover:bg-white/10 rounded-medium px-3 py-2 transition font-mono font-thin drop-shadow-md text-white" onClick={() => setIsMobileMenuOpen(false)}>About Lawxia</Link>
              <Link href="/signin" className="hover:bg-white/10 rounded-medium px-3 py-2 transition font-poppins font-thin drop-shadow-md text-white" onClick={() => setIsMobileMenuOpen(false)}>Sign in</Link>
            </div>
          </div>
        )}
      </header>
    );
  }
  return (
    <header className="w-full flex items-center justify-between px-4 sm:px-6 md:px-8 py-2 sm:py-3 bg-contentBackground rounded-b-large shadow-none bg-black/30 backdrop-blur-sm relative font-thin">
      <div className="flex items-center gap-x-2 sm:gap-x-4 md:gap-x-6">
        <Link href="/" className="flex items-center">
          <img src="/images/lawxia-white-logo.png" alt="Lawxia Logo" className="h-6 sm:h-8 w-auto" />
        </Link>
        <Link href="/company" className="hidden sm:block hover:bg-white/10 rounded-medium px-2 sm:px-4 py-2 transition font-poppins text-base sm:text-lg font-thin drop-shadow-md text-white">Company</Link>
        <Link href="/about-lawxia" className="hidden sm:block hover:bg-white/10 rounded-medium px-2 sm:px-4 py-2 transition font-poppins text-base sm:text-lg font-thin drop-shadow-md text-white">About Lawxia</Link>
      </div>
      <div className="flex items-center gap-2 sm:gap-4">
        <span className="hidden sm:block bg-pro-badge bg-clip-text text-transparent font-poppins font-thin text-base sm:text-lg px-2 sm:px-3 py-1 rounded drop-shadow-md text-white">{modelName || 'Gemini 2.5 Pro'}</span>
      </div>
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="sm:hidden p-2 hover:bg-white/10 rounded-medium transition font-poppins font-thin drop-shadow-md text-white"
        aria-label="Abrir menú"
      >
        <Menu size={20} />
      </button>
      
      <div className="flex items-center gap-2">
        <span className="hidden sm:block bg-greeting-text bg-clip-text text-transparent font-poppins font-thin text-base sm:text-lg drop-shadow-md text-white">Hola, {userName || 'Renato'}</span>
        <button className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-componentSubtle flex items-center justify-center font-poppins font-thin text-lg sm:text-xl drop-shadow-md text-white">{userName ? userName[0] : 'R'}</button>
      </div>
      
      {isMobileMenuOpen && (
        <div className="sm:hidden absolute top-full left-0 right-0 mt-2 bg-black/40 backdrop-blur-lg rounded-lg border border-white/20 p-4">
          <div className="flex flex-col gap-3">
            <Link href="/company" className="hover:bg-white/10 rounded-medium px-2 sm:px-4 py-2 transition font-poppins text-base font-thin drop-shadow-md text-white" onClick={() => setIsMobileMenuOpen(false)}>Company</Link>
            <Link href="/about-lawxia" className="hover:bg-white/10 rounded-medium px-2 sm:px-4 py-2 transition font-poppins text-base font-thin drop-shadow-md text-white" onClick={() => setIsMobileMenuOpen(false)}>About Lawxia</Link>
            <div className="px-3 py-2 text-base font-poppins font-thin drop-shadow-md text-white">
              <span className="bg-pro-badge bg-clip-text text-transparent">{modelName || 'Gemini 2.5 Pro'}</span>
            </div>
            <div className="px-3 py-2 text-base font-poppins font-thin drop-shadow-md text-white">
              <span className="bg-greeting-text bg-clip-text text-transparent">Hola, {userName || 'Renato'}</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
} 