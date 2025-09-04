import { useState, useEffect, useRef, useCallback } from 'react';

export function useBackgroundColor() {
  const [textColor, setTextColor] = useState('#000000');
  const [isClient, setIsClient] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  // Ensure we only run on client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  const detectBackgroundColor = useCallback(() => {
    if (!headerRef.current || !isClient) return;

    try {
      // Get header position
      const headerRect = headerRef.current.getBoundingClientRect();
      
      // Sample points behind the header
      const samplePoints = [
        { x: headerRect.left + headerRect.width * 0.25, y: headerRect.top + headerRect.height * 0.5 },
        { x: headerRect.left + headerRect.width * 0.5, y: headerRect.top + headerRect.height * 0.5 },
        { x: headerRect.left + headerRect.width * 0.75, y: headerRect.top + headerRect.height * 0.5 },
        { x: headerRect.left + headerRect.width * 0.5, y: headerRect.top - 10 },
        { x: headerRect.left + headerRect.width * 0.5, y: headerRect.bottom + 10 }
      ];

      // Use html2canvas approach to capture the background
      captureScreenAndAnalyze(samplePoints, headerRect);
      
    } catch (error) {
      console.warn('Error detecting background color:', error);
      setTextColor('#000000');
    }
  }, [isClient]);

  const captureScreenAndAnalyze = async (samplePoints: Array<{x: number, y: number}>, headerRect: DOMRect) => {
    try {
      // Use html2canvas if available, otherwise fallback to manual capture
      if (typeof window !== 'undefined' && (window as any).html2canvas) {
        await captureWithHtml2Canvas(samplePoints, headerRect);
      } else {
        // Fallback: try to get colors from DOM elements
        await captureFromDOM(samplePoints);
      }
    } catch (error) {
      console.warn('Canvas capture failed, using DOM fallback:', error);
      await captureFromDOM(samplePoints);
    }
  };

  const captureWithHtml2Canvas = async (samplePoints: Array<{x: number, y: number}>, headerRect: DOMRect) => {
    try {
      const html2canvas = (window as any).html2canvas;
      
      // Capture the entire page
      const canvas = await html2canvas(document.body, {
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        scale: 1,
        logging: false,
        width: window.innerWidth,
        height: window.innerHeight
      });

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Sample colors from the captured canvas
      const colors = samplePoints.map(point => {
        const imageData = ctx.getImageData(point.x, point.y, 1, 1);
        return {
          r: imageData.data[0],
          g: imageData.data[1],
          b: imageData.data[2],
          a: imageData.data[3]
        };
      });

      analyzeColors(colors);
      
    } catch (error) {
      console.warn('html2canvas failed:', error);
      throw error;
    }
  };

  const captureFromDOM = async (samplePoints: Array<{x: number, y: number}>) => {
    try {
      const colors: Array<{r: number, g: number, b: number, a: number}> = [];

      samplePoints.forEach(point => {
        const elementBelow = document.elementFromPoint(point.x, point.y);
        if (elementBelow) {
          const color = getComputedBackgroundColor(elementBelow);
          if (color) {
            const rgb = parseColorToRGB(color);
            if (rgb) {
              colors.push(rgb);
            }
          }
        }
      });

      if (colors.length > 0) {
        analyzeColors(colors);
      }
      
    } catch (error) {
      console.warn('DOM capture failed:', error);
    }
  };

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

  const parseColorToRGB = (color: string): {r: number, g: number, b: number, a: number} | null => {
    try {
      let r = 0, g = 0, b = 0, a = 1;

      if (color.startsWith('rgb')) {
        const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([^)]+))?\)/);
        if (match) {
          r = parseInt(match[1]);
          g = parseInt(match[2]);
          b = parseInt(match[3]);
          if (match[4]) {
            a = parseFloat(match[4]);
          }
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
      } else if (color.startsWith('hsl')) {
        const rgb = hslToRgb(color);
        if (rgb) {
          r = rgb.r;
          g = rgb.g;
          b = rgb.b;
        }
      }

      if (r > 0 || g > 0 || b > 0) {
        return { r, g, b, a };
      }

      return null;
    } catch (error) {
      return null;
    }
  };

  const hslToRgb = (hsl: string): { r: number, g: number, b: number } | null => {
    try {
      const match = hsl.match(/hsla?\((\d+),\s*(\d+)%,\s*(\d+)%/);
      if (!match) return null;

      const h = parseInt(match[1]) / 360;
      const s = parseInt(match[2]) / 100;
      const l = parseInt(match[3]) / 100;

      if (s === 0) {
        const value = Math.round(l * 255);
        return { r: value, g: value, b: value };
      }

      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };

      const c = (1 - Math.abs(2 * l - 1)) * s;
      const x = c * (1 - Math.abs((h / 60) % 2 - 1));
      const m = l - c / 2;

      let r, g, b;

      if (h < 1/6) {
        r = c; g = x; b = 0;
      } else if (h < 2/6) {
        r = x; g = c; b = 0;
      } else if (h < 3/6) {
        r = 0; g = c; b = x;
      } else if (h < 4/6) {
        r = 0; g = x; b = c;
      } else if (h < 5/6) {
        r = x; g = 0; b = c;
      } else {
        r = c; g = 0; b = x;
      }

      return {
        r: Math.round((r + m) * 255),
        g: Math.round((g + m) * 255),
        b: Math.round((b + m) * 255)
      };
    } catch (error) {
      return null;
    }
  };

  const analyzeColors = (colors: Array<{r: number, g: number, b: number, a: number}>) => {
    if (colors.length === 0) return;

    // Calculate weighted average luminance
    let totalLuminance = 0;
    let totalWeight = 0;

    colors.forEach(color => {
      // Calculate relative luminance using sRGB formula
      const rsRGB = color.r / 255;
      const gsRGB = color.g / 255;
      const bsRGB = color.b / 255;

      const rL = rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4);
      const gL = gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4);
      const bL = bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4);

      const luminance = 0.2126 * rL + 0.7152 * gL + 0.0722 * bL;
      const weight = color.a / 255; // Use alpha as weight

      totalLuminance += luminance * weight;
      totalWeight += weight;
    });

    if (totalWeight > 0) {
      const avgLuminance = totalLuminance / totalWeight;
      
      // Determine text color based on background luminance
      if (avgLuminance > 0.6) {
        setTextColor('#000000'); // Dark text on light background
      } else {
        setTextColor('#FFFFFF'); // Light text on dark background
      }
    }
  };

  useEffect(() => {
    if (!isClient) return;

    // Load html2canvas if available
    const loadHtml2Canvas = async () => {
      if (typeof window !== 'undefined' && !(window as any).html2canvas) {
        try {
          const html2canvas = await import('html2canvas');
          (window as any).html2canvas = html2canvas.default;
        } catch (error) {
          console.log('html2canvas not available, using DOM fallback');
        }
      }
    };

    loadHtml2Canvas();

    // Detect on scroll and resize
    const handleScroll = () => {
      requestAnimationFrame(detectBackgroundColor);
    };

    const handleResize = () => {
      requestAnimationFrame(detectBackgroundColor);
    };

    // Initial detection with a delay
    const initialDetection = setTimeout(detectBackgroundColor, 500);

    // Add event listeners
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });

    // Cleanup
    return () => {
      clearTimeout(initialDetection);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [detectBackgroundColor, isClient]);

  // Return default color during SSR, actual color on client
  return { textColor: isClient ? textColor : '#000000', headerRef };
}
