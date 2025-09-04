"use client";
import { useState, useEffect, useRef } from "react";
import { ArrowRight, Link, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Plan from "@/components/ui/agent-plan";
import { AnimatedAIChat } from "@/components/ui/animated-ai-chat";
import { useChat } from '@/hooks/useChat';
import Sidebar from "@/components/Sidebar";
import { auth } from "@/services/firebase";

interface TimelineItem {
  id: number;
  title: string;
  date: string;
  content: string;
  category: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  relatedIds: number[];
  status: "completed" | "in-progress" | "pending";
  energy: number;
}

interface RadialOrbitalTimelineProps {
  timelineData: TimelineItem[];
}

export default function RadialOrbitalTimeline({
  timelineData,
}: RadialOrbitalTimelineProps) {
  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>(
    {}
  );
  const [viewMode, setViewMode] = useState<"orbital">("orbital");
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [pulseEffect, setPulseEffect] = useState<Record<number, boolean>>({});
  const [centerOffset, setCenterOffset] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [activeNodeId, setActiveNodeId] = useState<number | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [userName, setUserName] = useState("Usuario");
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [perfilSectionsOpen, setPerfilSectionsOpen] = useState<{ general: boolean; legal: boolean }>({ general: true, legal: false });
  const containerRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Record<number, HTMLDivElement | null>>({});

  // Hook para el chat
  const { 
    conversations, 
    activeConversation, 
    activeId,
    sendMessage, 
    createConversation,
    switchConversation,
    deleteConversation,
    renameConversation
  } = useChat();

  // Obtener información del usuario autenticado
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const unsubscribe = auth.onAuthStateChanged(user => {
        if (user) {
          setUserName(user.displayName || user.email?.split('@')[0] || "Usuario");
          setUserPhoto(user.photoURL);
        } else {
          setUserName("Usuario");
          setUserPhoto(null);
        }
      });
      return () => unsubscribe();
    }
  }, []);

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Solo salir si se hace clic en el contenedor principal o en la órbita
    // NO salir si se hace clic dentro de una card expandida
    if (e.target === containerRef.current || e.target === orbitRef.current) {
      setExpandedItems({});
      setActiveNodeId(null);
      setPulseEffect({});
      setAutoRotate(true);
    }
  };

  const toggleItem = (id: number) => {
    setExpandedItems((prev) => {
      const newState = { ...prev };
      Object.keys(newState).forEach((key) => {
        if (parseInt(key) !== id) {
          newState[parseInt(key)] = false;
        }
      });

      newState[id] = !prev[id];

      if (!prev[id]) {
        setActiveNodeId(id);
        setAutoRotate(false);

        const relatedItems = getRelatedItems(id);
        const newPulseEffect: Record<number, boolean> = {};
        relatedItems.forEach((relId) => {
          newPulseEffect[relId] = true;
        });
        setPulseEffect(newPulseEffect);

        centerViewOnNode(id);
      } else {
        setActiveNodeId(null);
        setAutoRotate(true);
        setPulseEffect({});
      }

      return newState;
    });
  };

  useEffect(() => {
    let rotationTimer: NodeJS.Timeout;

    if (autoRotate && viewMode === "orbital") {
      rotationTimer = setInterval(() => {
        setRotationAngle((prev) => {
          const newAngle = (prev + 0.3) % 360;
          return Number(newAngle.toFixed(3));
        });
      }, 50);
    }

    return () => {
      if (rotationTimer) {
        clearInterval(rotationTimer);
      }
    };
  }, [autoRotate, viewMode]);

  const centerViewOnNode = (nodeId: number) => {
    if (viewMode !== "orbital" || !nodeRefs.current[nodeId]) return;

    const nodeIndex = timelineData.findIndex((item) => item.id === nodeId);
    const totalNodes = timelineData.length;
    const targetAngle = (nodeIndex / totalNodes) * 360;

    setRotationAngle(270 - targetAngle);
  };

  const calculateNodePosition = (index: number, total: number) => {
    const angle = ((index / total) * 360 + rotationAngle) % 360;
    const radius = 150;
    const radian = (angle * Math.PI) / 180;

    const x = radius * Math.cos(radian) + centerOffset.x;
    const y = radius * Math.sin(radian) + centerOffset.y;

    const zIndex = Math.round(100 + 50 * Math.cos(radian));
    const opacity = Math.max(
      0.4,
      Math.min(1, 0.4 + 0.6 * ((1 + Math.sin(radian)) / 2))
    );

    return { x, y, angle, zIndex, opacity };
  };

  const getRelatedItems = (itemId: number): number[] => {
    const currentItem = timelineData.find((item) => item.id === itemId);
    return currentItem ? currentItem.relatedIds : [];
  };

  const isRelatedToActive = (itemId: number): boolean => {
    if (!activeNodeId) return false;
    const relatedItems = getRelatedItems(activeNodeId);
    return relatedItems.includes(itemId);
  };

  const getStatusStyles = (status: TimelineItem["status"]): string => {
    switch (status) {
      case "completed":
        return "text-white bg-black border-white";
      case "in-progress":
        return "text-black bg-white border-black";
      case "pending":
        return "text-white bg-black/40 border-white/50";
      default:
        return "text-white bg-black/40 border-white/50";
    }
  };

           return (
                       <div
              className="w-full min-h-screen flex flex-col items-center justify-center"
              ref={containerRef}
              onClick={handleContainerClick}
            >
             <div className="relative w-full max-w-4xl min-h-screen flex items-center justify-center py-8 overflow-x-hidden">
        <div
          className="absolute w-full h-full flex items-center justify-center"
          ref={orbitRef}
          style={{
            perspective: "1000px",
            transform: `translate(${centerOffset.x}px, ${centerOffset.y}px)`,
          }}
        >
          <div className="absolute w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 via-blue-500 to-teal-500 animate-pulse flex items-center justify-center z-10">
            <div className="absolute w-20 h-20 rounded-full border border-white/20 animate-ping opacity-70"></div>
            <div
              className="absolute w-24 h-24 rounded-full border border-white/10 animate-ping opacity-50"
              style={{ animationDelay: "0.5s" }}
            ></div>
            <div className="w-8 h-8 rounded-full bg-white/80 backdrop-blur-md"></div>
          </div>

                     <div className="absolute w-80 h-80 rounded-full border border-white/10"></div>

          {timelineData.map((item, index) => {
            const position = calculateNodePosition(index, timelineData.length);
            const isExpanded = expandedItems[item.id];
            const isRelated = isRelatedToActive(item.id);
            const isPulsing = pulseEffect[item.id];
            const Icon = item.icon;

            const nodeStyle = {
              transform: `translate(${position.x}px, ${position.y}px)`,
              zIndex: isExpanded ? 200 : position.zIndex,
              opacity: isExpanded ? 1 : position.opacity,
            };

            return (
              <div
                key={item.id}
                ref={(el) => { nodeRefs.current[item.id] = el; }}
                className="absolute transition-all duration-700 cursor-pointer"
                style={nodeStyle}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleItem(item.id);
                }}
              >
                <div
                  className={`absolute rounded-full -inset-1 ${
                    isPulsing ? "animate-pulse duration-1000" : ""
                  }`}
                  style={{
                    background: `radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%)`,
                    width: `${item.energy * 0.5 + 40}px`,
                    height: `${item.energy * 0.5 + 40}px`,
                    left: `-${(item.energy * 0.5 + 40 - 40) / 2}px`,
                    top: `-${(item.energy * 0.5 + 40 - 40) / 2}px`,
                  }}
                ></div>

                                 <div
                   className={`
                   w-10 h-10 rounded-full flex items-center justify-center
                   ${
                     isExpanded
                       ? "bg-white text-black"
                       : isRelated
                       ? "bg-white/50 text-black"
                       : "bg-black text-white"
                   }
                   border-2 
                   ${
                     isExpanded
                       ? "border-white shadow-lg shadow-white/30"
                       : isRelated
                       ? "border-white animate-pulse"
                       : "border-white/40"
                   }
                   transition-all duration-300 transform
                   ${isExpanded ? "scale-125" : ""}
                 `}
                >
                  <Icon size={16} />
                </div>

                                 <div
                   className={`
                   absolute whitespace-nowrap
                   text-xs font-semibold tracking-wider
                   transition-all duration-300
                   ${isExpanded ? "top-16 text-white scale-110" : "top-12 text-white/70"}
                 `}
                >
                  {item.title}
                </div>

                                                      {isExpanded && (
  <Card 
    className="absolute top-20 left-1/2 -translate-x-1/2 w-[calc(100vw-1.5rem)] sm:w-[calc(100vw-2rem)] md:w-[calc(100vw-18rem-2rem)] lg:w-[calc(100vw-18rem-3rem)] max-w-sm sm:max-w-md md:max-w-2xl lg:max-w-3xl xl:max-w-4xl bg-white/10 backdrop-blur-lg border-white/30 shadow-xl shadow-white/10 overflow-visible"
    onClick={(e) => e.stopPropagation()}
  >
    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-px h-3 bg-white/50"></div>
    <CardHeader className="pb-2">
      <div className="flex justify-between items-center">
        <Badge
          className={`px-2 text-xs ${getStatusStyles(
            item.status
          )}`}
        >
          {item.status === "completed"
            ? "COMPLETE"
            : item.status === "in-progress"
            ? "IN PROGRESS"
            : "PENDING"}
        </Badge>
        <span className="text-xs font-mono text-white/70">
          {item.date}
        </span>
      </div>
      <CardTitle className="text-sm mt-2 text-white">
        {item.title}
      </CardTitle>
    </CardHeader>
    <CardContent className="text-xs text-white">
      <p>{item.content}</p>

      <div className="mt-4 pt-3 border-t border-white/10">
        {/* Caso especial para AI chat */}
        {item.title === "AI chat" ? (
          <>
            <div className="text-xs text-white/70 mb-2">
              Escribe un comando o haz una pregunta
            </div>
            <div 
              className="h-[32rem] bg-black/20 rounded-lg border border-white/20 overflow-hidden flex relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Botón de toggle para la sidebar - solo visible cuando está cerrada */}
              {!sidebarOpen && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSidebarOpen(true);
                  }}
                  className="absolute top-2 left-2 z-20 p-2 bg-white/20 hover:bg-white/30 rounded-lg border border-white/30 text-white transition-all"
                  title="Mostrar sidebar"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
              )}

              {/* Sidebar */}
              <div 
                className={`h-full border-r border-white/20 bg-black/30 flex-shrink-0 transition-all duration-300 ${
                  sidebarOpen ? 'w-64' : 'w-0'
                } overflow-hidden relative`}
                onClick={(e) => e.stopPropagation()}
              >
                {sidebarOpen && (
                  <>
                    {/* Botón de cerrar sidebar - solo visible cuando está abierta */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSidebarOpen(false);
                      }}
                      className="absolute top-2 right-2 z-20 p-1.5 bg-white/20 hover:bg-white/30 rounded-lg border border-white/30 text-white transition-all"
                      title="Cerrar sidebar"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                    
                    {/* Sidebar personalizada para AI chat */}
                    <div className="flex flex-col h-full w-full p-3 bg-transparent text-white/90 relative">
                      {/* Perfil de usuario */}
                      <div className="flex items-center gap-2 mb-3 font-sans mt-1">
                        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white/[0.05] backdrop-blur-lg overflow-hidden">
                          {userPhoto ? (
                            <img src={userPhoto} alt="Foto de perfil" className="w-10 h-10 object-cover rounded-full" />
                          ) : (
                            <svg className="w-6 h-6 text-white/90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          )}
                        </div>
                        <span className="text-sm font-normal text-white/90">{userName}</span>
                      </div>
                      
                      <div className="border-t border-white/[0.08] my-3" />
                      
                      {/* Botón Nueva conversación */}
                      <button
                        className="flex items-center gap-2 px-3 py-2 mb-3 bg-white/[0.05] hover:bg-white/[0.10] rounded-lg text-white/90 text-sm font-medium transition-all"
                        onClick={(e) => {
                          e.stopPropagation();
                          createConversation();
                        }}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Nueva conversación
                      </button>
                      
                      <div className="border-t border-white/[0.08] my-3" />
                      
                      {/* Lista de conversaciones */}
                      <div className="flex-1 overflow-y-auto mb-4">
                        <h3 className="text-xs font-medium mb-2 text-white/60">Recientes</h3>
                        <ul className="space-y-1">
                          {conversations.map(conv => (
                            <li key={conv.id} className="group relative flex items-center">
                              <button
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium w-full text-left transition-all ${
                                  conv.id === activeId ? 'bg-white/[0.05] text-white' : 'text-white/70 hover:bg-white/[0.05] hover:text-white/90'
                                }`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  switchConversation(conv.id);
                                }}
                                title={conv.title}
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                                <span className="flex-1 truncate">{conv.title}</span>
                                <button
                                  type="button"
                                  className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity text-white/60 hover:text-red-400"
                                  title="Eliminar conversación"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteConversation(conv.id);
                                  }}
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </>
                )}
              </div>
              {/* Chat principal */}
              <div 
                className="flex-1 h-full relative overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="h-full w-full overflow-hidden">
                  <AnimatedAIChat
                    conversation={activeConversation || undefined}
                    sendMessage={sendMessage}
                  />
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="flex items-center">
                <Zap size={10} className="mr-1" />
                Energy Level
              </span>
              <span className="font-mono">{item.energy}%</span>
            </div>
            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                style={{ width: `${item.energy}%` }}
              ></div>
            </div>
          </>
        )}
      </div>

      {/* Selector de Perfil debajo de la barra de energía */}
      {item.title === "Perfil" && (
        <div className="mt-4 pt-3 border-t border-white/10">
          <h4 className="text-xs uppercase tracking-wider font-medium text-white/70 mb-2">Configuración de Perfil</h4>

          {/* Sección 1: Información general */}
          <div className="mb-2 overflow-hidden rounded-md border border-white/10 bg-white/5">
            <button
              className="w-full flex items-center justify-between px-3 py-2 text-left text-white hover:bg-white/10 transition"
              onClick={(e) => {
                e.stopPropagation();
                setPerfilSectionsOpen((s) => ({ ...s, general: !s.general }));
              }}
            >
              <span className="text-xs font-medium">1. Información general</span>
              <span className={`text-white/70 text-xs transition-transform ${perfilSectionsOpen.general ? 'rotate-180' : ''}`}>▼</span>
            </button>
            <div className={`px-3 pb-3 grid gap-3 transition-all duration-300 ${perfilSectionsOpen.general ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}>
              <label className="text-[11px] text-white/70">Nombre de la empresa (o proyecto)</label>
              <input
                className="w-full bg-transparent border border-white/20 rounded-md px-2 py-1 text-xs outline-none focus:border-white/40"
                placeholder="Introduce el nombre"
              />
              <label className="text-[11px] text-white/70">Actividad principal (describa brevemente)</label>
              <input
                className="w-full bg-transparent border border-white/20 rounded-md px-2 py-1 text-xs outline-none focus:border-white/40"
                placeholder="Describe la actividad"
              />
              <div className="mt-2">
                <span className="block text-[11px] text-white/70 mb-1">¿La empresa ya está constituida legalmente?</span>
                <div className="flex items-center gap-3 text-xs">
                  <label className="inline-flex items-center gap-1 cursor-pointer">
                    <input type="radio" name={`constitucion-${item.id}`} className="accent-white/80" />
                    <span>Sí</span>
                  </label>
                  <label className="inline-flex items-center gap-1 cursor-pointer">
                    <input type="radio" name={`constitucion-${item.id}`} className="accent-white/80" />
                    <span>No</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Sección 2: Forma jurídica y constitución */}
          <div className="overflow-hidden rounded-md border border-white/10 bg-white/5">
            <button
              className="w-full flex items-center justify-between px-3 py-2 text-left text-white hover:bg-white/10 transition"
              onClick={(e) => {
                e.stopPropagation();
                setPerfilSectionsOpen((s) => ({ ...s, legal: !s.legal }));
              }}
            >
              <span className="text-xs font-medium">2. Forma jurídica y constitución</span>
              <span className={`text-white/70 text-xs transition-transform ${perfilSectionsOpen.legal ? 'rotate-180' : ''}`}>▼</span>
            </button>
            <div className={`px-3 pb-3 grid gap-3 transition-all duration-300 ${perfilSectionsOpen.legal ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}>
              <span className="text-[11px] text-white/70">¿Cuál es la forma jurídica prevista o actual?</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {[
                  'Empresario individual / Autónomo',
                  'Sociedad Limitada (SL)',
                  'Sociedad Anónima (SA)',
                  'Sociedad Cooperativa',
                  'Comunidad de bienes / Sociedad civil',
                ].map(opt => (
                  <label key={opt} className="inline-flex items-center gap-2 bg-white/5 rounded-md px-2 py-1 border border-white/10 cursor-pointer hover:bg-white/10">
                    <input type="radio" name={`forma-${item.id}`} className="accent-white/80" />
                    <span>{opt}</span>
                  </label>
                ))}
                <div className="flex items-center gap-2 bg-white/5 rounded-md px-2 py-1 border border-white/10">
                  <input type="radio" name={`forma-${item.id}`} className="accent-white/80" />
                  <input
                    className="flex-1 bg-transparent outline-none text-xs"
                    placeholder="Otra: especifica"
                  />
                </div>
              </div>

              <div className="mt-2">
                <span className="block text-[11px] text-white/70 mb-1">¿Hay socios o es una actividad individual?</span>
                <div className="flex items-center gap-3 text-xs">
                  <label className="inline-flex items-center gap-1 cursor-pointer">
                    <input type="radio" name={`socios-${item.id}`} className="accent-white/80" />
                    <span>Individual</span>
                  </label>
                  <label className="inline-flex items-center gap-1 cursor-pointer">
                    <input type="radio" name={`socios-${item.id}`} className="accent-white/80" />
                    <span>Con socios</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Connected Nodes para elementos que NO sean Plan */}
      {item.title !== "Tareas" && item.relatedIds.length > 0 && (
        <div className="mt-4 pt-3 border-t border-white/10">
          <div className="flex items-center mb-2">
            <Link size={10} className="text-white/70 mr-1" />
            <h4 className="text-xs uppercase tracking-wider font-medium text-white/70">
              Nodos Conectados
            </h4>
          </div>
          <div className="flex flex-wrap gap-1">
            {item.relatedIds.map((relatedId) => {
              const relatedItem = timelineData.find(
                (i) => i.id === relatedId
              );
              return (
                <Button
                  key={relatedId}
                  variant="outline"
                  size="sm"
                  className="flex items-center h-6 px-2 py-0 text-xs rounded-none border-white/20 bg-transparent hover:bg-white/10 text-white/80 hover:text-white transition-all"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleItem(relatedId);
                  }}
                >
                  {relatedItem?.title}
                  <ArrowRight
                    size={8}
                    className="ml-1 text-white/60"
                  />
                </Button>
              );
            })}
          </div>
        </div>
      )}

      {/* Componente agent-plan para el elemento Tareas */}
      {item.title === "Tareas" && (
        <div className="mt-4 pt-3 border-t border-white/10">
          <div className="text-xs text-white/70 mb-2">
            Plan de Acción
          </div>
          <div className="origin-top-left">
            <Plan />
          </div>
        </div>
      )}

      {/* Connected Nodes después del Plan de Acción para el elemento Tareas */}
      {item.title === "Tareas" && item.relatedIds.length > 0 && (
        <div className="mt-4 pt-3 border-t border-white/10">
          <div className="flex items-center mb-2">
            <Link size={10} className="text-white/70 mr-1" />
            <h4 className="text-xs uppercase tracking-wider font-medium text-white/70">
              Nodos Conectados
            </h4>
          </div>
          <div className="flex flex-wrap gap-1">
            {item.relatedIds.map((relatedId) => {
              const relatedItem = timelineData.find(
                (i) => i.id === relatedId
              );
              return (
                <Button
                  key={relatedId}
                  variant="outline"
                  size="sm"
                  className="flex items-center h-6 px-2 py-0 text-xs rounded-none border-white/20 bg-transparent hover:bg-white/10 text-white/80 hover:text-white transition-all"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleItem(relatedId);
                  }}
                >
                  {relatedItem?.title}
                  <ArrowRight
                    size={8}
                    className="ml-1 text-white/60"
                  />
                </Button>
              );
            })}
          </div>
        </div>
      )}
    </CardContent>
  </Card>
)}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
