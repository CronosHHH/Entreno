import { motion } from "framer-motion";
import { IconBrandYoutubeFilled } from "@tabler/icons-react";
import createGlobe from "cobe";
import { cn } from "@/lib/utils";

export function FeaturesSectionDemo() {
  const features = [
    {
      // Eliminar title y description aquí, solo dejar el skeleton y className
      skeleton: <SkeletonOne />,
      className:
        "col-span-1 lg:col-span-4 border-b lg:border-r dark:border-neutral-800",
    },
    {
      skeleton: <SkeletonTwo />,
      className: "border-b col-span-1 lg:col-span-2 dark:border-neutral-800",
    },
    {
      title: "Puesta a Punto Normativa al Instante.",
      description:
        "Una vez creado tu perfil, la IA lo sincroniza con la ley. Detecta cualquier desajuste y te indica exactamente qué hacer para que tu empresa no solo esté al día, sino blindada ante cualquier cambio normativo.",
      skeleton: <SkeletonThree />,
      className:
        "col-span-1 lg:col-span-3 lg:border-r  dark:border-neutral-800",
    },
    {
      title: "Claridad Total. Cero Incógnitas.",
      description:
        "Imagina un equipo de expertos dedicados a ti; uno investiga, otro contrasta los hechos y un tercero te lo explica de forma clara y humana.",
      skeleton: <SkeletonFour />,
      className: "col-span-1 lg:col-span-3 border-b lg:border-none",
    },
  ];
  return (
    <div className="relative z-20 py-10 lg:py-40 max-w-7xl mx-auto">
      <div className="px-8">
        <h4 className="text-3xl lg:text-5xl lg:leading-tight max-w-5xl mx-auto text-center tracking-tight font-roboto font-thin text-white">
          Tu ADN Legal: Así Funciona la Magia
        </h4>
      </div>
      <div className="relative ">
        <div className="grid grid-cols-1 lg:grid-cols-6 mt-12 xl:border rounded-md dark:border-neutral-800">
          {features.map((feature, idx) => (
            <FeatureCard key={idx} className={feature.className}>
              {/* Solo mostrar título y descripción si existen */}
              {feature.title && <FeatureTitle>{feature.title}</FeatureTitle>}
              {feature.description && <FeatureDescription>{feature.description}</FeatureDescription>}
              <div className=" h-full w-full">{feature.skeleton}</div>
            </FeatureCard>
          ))}
        </div>
      </div>
    </div>
  );
}

const FeatureCard = ({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn(`p-4 sm:p-8 relative overflow-hidden w-full h-full flex flex-col justify-center items-center`, className)}>
      {children}
    </div>
  );
};

const FeatureTitle = ({ children }: { children?: React.ReactNode }) => {
  return (
    <p className="max-w-full break-words mx-auto text-left tracking-tight text-white text-xl md:text-2xl md:leading-snug font-roboto font-thin">
      {children}
    </p>
  );
};

const FeatureDescription = ({ children }: { children?: React.ReactNode }) => {
  return (
    <p
      className={cn(
        "text-sm md:text-base max-w-full break-words text-left mx-auto",
        "text-white/80 text-center font-inter font-light",
        "text-left mx-0 md:text-sm my-2"
      )}
    >
      {children}
    </p>
  );
};

export const SkeletonOne = () => {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center p-6 bg-black shadow-2xl rounded-2xl">
      <FeatureTitle>Arrastra y Despierta la Inteligencia.</FeatureTitle>
      <FeatureDescription>
        ¿El primer paso? El más fácil. Simplemente arrastra y suelta los documentos clave de tu empresa. En segundos, nuestra IA absorbe tu realidad, entiende tu estructura y se prepara para construir tu fortaleza legal.
      </FeatureDescription>
      <video
        src="/videos/Data-Request.mp4"
        autoPlay
        loop
        muted
        playsInline
        style={{ width: '100%', height: 'auto', display: 'block', marginTop: '1rem', borderRadius: '1rem' }}
      />
    </div>
  );
};

export const SkeletonTwo = () => {
  return (
    <div className="relative flex flex-col items-center justify-center py-8 px-2 gap-4 w-full h-full">
      <PinContainer title="Huella Digital 3D">
        <div className="flex flex-col items-center justify-center text-center w-full h-full">
          <FeatureTitle>Tu Ecosistema Legal a Medida.</FeatureTitle>
          <FeatureDescription>
            Esto no es una talla única. A partir de tu información, creamos un universo legal exclusivo para ti. Un mapa interactivo donde solo existen tus derechos, tus plazos y tus obligaciones. Se acabaron el ruido y la paja informativa.
          </FeatureDescription>
          <img
            src="/images/huellaDactilar.png"
            alt="Huella Dactilar 3D"
            style={{ maxWidth: '100%', height: '200px', objectFit: 'contain', display: 'block' }}
          />
        </div>
      </PinContainer>
    </div>
  );
};

// InfiniteMovingCards helper
import { useEffect, useRef, useState } from "react";

export const InfiniteMovingCards = ({
  items,
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
  className,
}: {
  items: { image: string }[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    addAnimation();
  }, []);
  const [start, setStart] = useState(false);
  function addAnimation() {
    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children);
      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true);
        if (scrollerRef.current) {
          scrollerRef.current.appendChild(duplicatedItem);
        }
      });
      getDirection();
      getSpeed();
      setStart(true);
    }
  }
  const getDirection = () => {
    if (containerRef.current) {
      if (direction === "left") {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "forwards",
        );
      } else {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "reverse",
        );
      }
    }
  };
  const getSpeed = () => {
    if (containerRef.current) {
      if (speed === "fast") {
        containerRef.current.style.setProperty("--animation-duration", "20s");
      } else if (speed === "normal") {
        containerRef.current.style.setProperty("--animation-duration", "40s");
      } else {
        containerRef.current.style.setProperty("--animation-duration", "80s");
      }
    }
  };
  return (
    <div
      ref={containerRef}
      className={cn(
        "scroller relative z-20 max-w-7xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]",
        className,
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          "flex w-max min-w-full shrink-0 flex-nowrap gap-4 py-4",
          start && "animate-scroll",
          pauseOnHover && "hover:[animation-play-state:paused]",
        )}
      >
        {items.map((item, idx) => (
          <li
            className="relative w-[350px] max-w-full shrink-0 rounded-2xl border border-b-0 border-zinc-200 bg-[linear-gradient(180deg,#fafafa,#f5f5f5)] px-0 py-0 md:w-[450px] dark:border-zinc-700 dark:bg-[linear-gradient(180deg,#27272a,#18181b)] overflow-hidden"
            key={idx}
          >
            <img
              src={item.image}
              alt={`card-img-${idx}`}
              className="w-full h-full object-cover rounded-2xl"
              style={{ minHeight: 220, maxHeight: 320 }}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export const SkeletonThree = () => {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <InfiniteMovingCards
        items={[
          { image: "/images/BOE.jpg" },
          { image: "/images/DOUE.jpg" },
          { image: "/images/Bandera-de-Espana.jpg" },
        ]}
        direction="left"
        speed="fast"
      />
    </div>
  );
};

export const SkeletonFour = () => {
  return (
    <div className="h-60 md:h-60  flex flex-col items-center relative bg-transparent dark:bg-transparent mt-10">
      <Globe className="absolute -right-10 md:-right-10 -bottom-80 md:-bottom-72" />
    </div>
  );
};

export const Globe = ({ className }: { className?: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let phi = 0;
    if (!canvasRef.current) return;
    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: 600 * 2,
      height: 600 * 2,
      phi: 0,
      theta: 0,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.3, 0.3, 0.3],
      markerColor: [0.1, 0.8, 1],
      glowColor: [1, 1, 1],
      markers: [
        { location: [37.7595, -122.4367], size: 0.03 },
        { location: [40.7128, -74.006], size: 0.1 },
      ],
      onRender: (state) => {
        state.phi = phi;
        phi += 0.01;
      },
    });
    return () => {
      globe.destroy();
    };
  }, []);
  return (
    <canvas
      ref={canvasRef}
      style={{ width: 600, height: 600, maxWidth: "100%", aspectRatio: 1 }}
      className={className}
    />
  );
};

// PinContainer y PinPerspective helpers
export const PinContainer = ({
  children,
  title,
  href,
  className,
  containerClassName,
}: {
  children: React.ReactNode;
  title?: string;
  href?: string;
  className?: string;
  containerClassName?: string;
}) => {
  const [transform, setTransform] = useState(
    "translate(-50%,-50%) rotateX(0deg)"
  );

  const onMouseEnter = () => {
    setTransform("translate(-50%,-50%) rotateX(40deg) scale(0.8)");
  };
  const onMouseLeave = () => {
    setTransform("translate(-50%,-50%) rotateX(0deg) scale(1)");
  };

  const Wrapper = href ? 'a' : 'div';

  return (
    <Wrapper
      className={cn(
        "relative group/pin z-50 cursor-pointer w-full h-full flex items-center justify-center",
        containerClassName
      )}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      {...(href ? { href } : {})}
      style={{ minHeight: '100%', minWidth: '100%' }}
    >
      <div
        style={{
          perspective: "1000px",
          transform: "rotateX(70deg) translateZ(0deg)",
        }}
        className="absolute left-1/2 top-1/2 ml-[0.09375rem] mt-4 -translate-x-1/2 -translate-y-1/2 w-full h-full"
      >
        <div
          style={{
            transform: transform,
            width: '100%',
            height: '100%',
          }}
          className="absolute left-1/2 p-4 top-1/2 flex justify-center items-center rounded-2xl shadow-[0_8px_16px_rgb(0_0_0/0.4)] bg-black border border-white/[0.1] group-hover/pin:border-white/[0.2] transition duration-700 overflow-hidden w-full h-full"
        >
          <div className={cn("relative z-50 w-full h-full flex flex-col justify-center items-center", className)}>{children}</div>
        </div>
      </div>
      <PinPerspective title={title} href={href} />
    </Wrapper>
  );
};

export const PinPerspective = ({
  title,
  href,
}: {
  title?: string;
  href?: string;
}) => {
  return (
    <motion.div className="pointer-events-none  w-96 h-80 flex items-center justify-center opacity-0 group-hover/pin:opacity-100 z-[60] transition duration-500">
      <div className=" w-full h-full -mt-7 flex-none  inset-0">
        <div className="absolute top-0 inset-x-0  flex justify-center">
          {href ? (
            <a
              href={href}
              target={"_blank"}
              className="relative flex space-x-2 items-center z-10 rounded-full bg-zinc-950 py-0.5 px-4 ring-1 ring-white/10 "
            >
              <span className="relative z-20 text-white text-xs font-bold inline-block py-0.5">
                {title}
              </span>
              <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-emerald-400/0 via-emerald-400/90 to-emerald-400/0 transition-opacity duration-500 group-hover/btn:opacity-40"></span>
            </a>
          ) : (
            <span className="relative flex space-x-2 items-center z-10 rounded-full bg-zinc-950 py-0.5 px-4 ring-1 ring-white/10 ">
              <span className="relative z-20 text-white text-xs font-bold inline-block py-0.5">
                {title}
              </span>
            </span>
          )}
        </div>

        <div
          style={{
            perspective: "1000px",
            transform: "rotateX(70deg) translateZ(0)",
          }}
          className="absolute left-1/2 top-1/2 ml-[0.09375rem] mt-4 -translate-x-1/2 -translate-y-1/2"
        >
          <>
            <motion.div
              initial={{
                opacity: 0,
                scale: 0,
                x: "-50%",
                y: "-50%",
              }}
              animate={{
                opacity: [0, 1, 0.5, 0],
                scale: 1,
                z: 0,
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                delay: 0,
              }}
              className="absolute left-1/2 top-1/2  h-[11.25rem] w-[11.25rem] rounded-[50%] bg-sky-500/[0.08] shadow-[0_8px_16px_rgb(0_0_0/0.4)]"
            ></motion.div>
            <motion.div
              initial={{
                opacity: 0,
                scale: 0,
                x: "-50%",
                y: "-50%",
              }}
              animate={{
                opacity: [0, 1, 0.5, 0],
                scale: 1,
                z: 0,
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                delay: 2,
              }}
              className="absolute left-1/2 top-1/2  h-[11.25rem] w-[11.25rem] rounded-[50%] bg-sky-500/[0.08] shadow-[0_8px_16px_rgb(0_0_0/0.4)]"
            ></motion.div>
            <motion.div
              initial={{
                opacity: 0,
                scale: 0,
                x: "-50%",
                y: "-50%",
              }}
              animate={{
                opacity: [0, 1, 0.5, 0],
                scale: 1,
                z: 0,
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                delay: 4,
              }}
              className="absolute left-1/2 top-1/2  h-[11.25rem] w-[11.25rem] rounded-[50%] bg-sky-500/[0.08] shadow-[0_8px_16px_rgb(0_0_0/0.4)]"
            ></motion.div>
          </>
        </div>

        <>
          <motion.div className="absolute right-1/2 bottom-1/2 bg-gradient-to-b from-transparent to-cyan-500 translate-y-[14px] w-px h-20 group-hover/pin:h-40 blur-[2px]" />
          <motion.div className="absolute right-1/2 bottom-1/2 bg-gradient-to-b from-transparent to-cyan-500 translate-y-[14px] w-px h-20 group-hover/pin:h-40  " />
          <motion.div className="absolute right-1/2 translate-x-[1.5px] bottom-1/2 bg-cyan-600 translate-y-[14px] w-[4px] h-[4px] rounded-full z-40 blur-[3px]" />
          <motion.div className="absolute right-1/2 translate-x-[0.5px] bottom-1/2 bg-cyan-300 translate-y-[14px] w-[2px] h-[2px] rounded-full z-40 " />
        </>
      </div>
    </motion.div>
  );
}; 