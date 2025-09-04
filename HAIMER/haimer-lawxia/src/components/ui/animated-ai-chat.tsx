"use client";

import { useEffect, useRef, useCallback, useTransition } from "react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
    Paperclip,
    SendIcon,
    XIcon,
    LoaderIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import * as React from "react"
// Add imports for types
import type { Conversation } from "@/hooks/useChat";

interface UseAutoResizeTextareaProps {
    minHeight: number;
    maxHeight?: number;
}

function useAutoResizeTextarea({
    minHeight,
    maxHeight,
}: UseAutoResizeTextareaProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const adjustHeight = useCallback(
        (reset?: boolean) => {
            const textarea = textareaRef.current;
            if (!textarea) return;

            if (reset) {
                textarea.style.height = `${minHeight}px`;
                return;
            }

            textarea.style.height = `${minHeight}px`;
            const newHeight = Math.max(
                minHeight,
                Math.min(
                    textarea.scrollHeight,
                    maxHeight ?? Number.POSITIVE_INFINITY
                )
            );

            textarea.style.height = `${newHeight}px`;
        },
        [minHeight, maxHeight]
    );

    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = `${minHeight}px`;
        }
    }, [minHeight]);

    useEffect(() => {
        const handleResize = () => adjustHeight();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [adjustHeight]);

    return { textareaRef, adjustHeight };
}



interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  containerClassName?: string;
  showRing?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, containerClassName, showRing = true, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);
    
    return (
      <div className={cn(
        "relative",
        containerClassName
      )}>
        <textarea
          className={cn(
            "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
            "transition-all duration-200 ease-in-out",
            "placeholder:text-muted-foreground",
            "disabled:cursor-not-allowed disabled:opacity-50",
            showRing ? "focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0" : "",
            className
          )}
          ref={ref}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        
        {showRing && isFocused && (
          <motion.span 
            className="absolute inset-0 rounded-md pointer-events-none ring-2 ring-offset-0 ring-violet-500/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        )}

        {props.onChange && (
          <div 
            className="absolute bottom-2 right-2 opacity-0 w-2 h-2 bg-violet-500 rounded-full"
            style={{
              animation: 'none',
            }}
            id="textarea-ripple"
          />
        )}
      </div>
    )
  }
)
Textarea.displayName = "Textarea"

export function AnimatedAIChat({ conversation, sendMessage }: { conversation?: Conversation, sendMessage: (content: string) => void }) {
    const [value, setValue] = useState("");
    const [attachments, setAttachments] = useState<string[]>([]);
    const [isTyping, setIsTyping] = useState(false);
    const [isPending, startTransition] = useTransition();
    const { textareaRef, adjustHeight } = useAutoResizeTextarea({
        minHeight: 35,
        maxHeight: 100,
    });
    const [inputFocused, setInputFocused] = useState(false);
    // --- Animation state ---
    // Remove local messages state, use conversation prop
    const [hasSlidDown, setHasSlidDown] = useState(false);
    // Ref para el scroll automático
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    // Scroll automático al último mensaje
    useEffect(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, [conversation?.messages?.length]);





    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (value.trim()) {
                handleSendMessage();
            }
        }
    };

    const handleSendMessage = () => {
        if (value.trim()) {
            if (!hasSlidDown) setHasSlidDown(true);
            sendMessage(value);
            startTransition(() => {
                setIsTyping(true);
                setTimeout(() => {
                    setIsTyping(false);
                    setValue("");
                    adjustHeight(true);
                }, 1200);
            });
        }
    };

    const handleAttachFile = () => {
        const mockFileName = `file-${Math.floor(Math.random() * 1000)}.pdf`;
        setAttachments(prev => [...prev, mockFileName]);
    };

    const removeAttachment = (index: number) => {
        setAttachments(prev => prev.filter((_, i) => i !== index));
    };
    


    // Helper: check if la conversación tiene mensaje de usuario
    const hasUserMessage = !!(conversation && conversation.hasUserMessage);
    // Estado para controlar si el mensaje de bienvenida debe mostrarse (solo si la conversación está vacía)
    const [showWelcome, setShowWelcome] = useState(!(conversation && conversation.messages.length > 0));
    // Detectar cuando la conversación pasa de vacía a tener mensaje de usuario para animar el fade-out
    useEffect(() => {
      if (conversation && conversation.messages.length > 0 && showWelcome) {
        // Espera a que el fade-out termine antes de ocultar completamente
        const timeout = setTimeout(() => setShowWelcome(false), 600);
        return () => clearTimeout(timeout);
      } else if (conversation && conversation.messages.length === 0 && !showWelcome) {
        // Si se cambia a una conversación vacía, vuelve a mostrar el mensaje
        setShowWelcome(true);
      }
    }, [conversation, showWelcome]);

    return (
      <div className="flex flex-col min-h-0 w-full h-full relative">
        {/* Fondo decorativo */}
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-500/10 rounded-full mix-blend-normal filter blur-[128px] animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full mix-blend-normal filter blur-[128px] animate-pulse delay-700" />
          <div className="absolute top-1/4 right-1/3 w-64 h-64 bg-fuchsia-500/10 rounded-full mix-blend-normal filter blur-[96px] animate-pulse delay-1000" />
        </div>
        {/* Hero section: área de mensajes con scroll */}
        <div className="flex-1 w-full flex flex-col min-h-0">
          <div className="flex-1 flex flex-col items-center space-y-1 w-full overflow-y-auto pr-1 pt-1 pb-[1.5cm] scrollbar-thin scrollbar-thumb-white/50 scrollbar-track-transparent" style={{ minHeight: 0, maxHeight: '100%' }}>
            <AnimatePresence>
              {showWelcome && (
                <motion.div
                  key="welcome-message"
                  initial={{ opacity: 1, y: 0 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 40 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  className="w-full flex flex-col items-center justify-center py-2"
                >
                  <h1 className="text-lg font-medium tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white/90 to-white/40 pb-1 text-center">
                    ¿En qué puedo ayudarte hoy?
                  </h1>
                  <p className="text-xs text-white/40 mt-1 text-center">
                    Escribe un comando o haz una pregunta
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
            {conversation && conversation.messages.length > 0 && conversation.messages
              .filter((msg, index, arr) => {
                // Filtrar mensajes duplicados por ID
                return arr.findIndex(m => m.id === msg.id) === index;
              })
              .map((msg, i) => {
              // Asegurar que el mensaje tenga un ID válido
              if (!msg.id) {
                console.warn('Message without ID:', msg);
                return null;
              }
              
              return msg.role === 'user' ? (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.1 }}
                  className="self-end bg-white/10 text-white px-2 py-1.5 rounded-lg shadow w-fit min-w-[35%] max-w-[80%] text-right text-xs"
                >
                  {msg.content}
                </motion.div>
              ) : (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.1 }}
                  className="self-start w-full text-left text-sm font-normal text-white/90 px-1 py-0.5"
                  style={{background: 'none', borderRadius: 0, boxShadow: 'none'}}
                >
                  {msg.content}
                </motion.div>
              );
            }).filter(Boolean)}
            {/* Elemento invisible para hacer scroll al final */}
            <div ref={messagesEndRef} />
          </div>
        </div>
        {/* Input y comandos abajo, fuera de la hero section */}
        <motion.div 
          className="relative z-0 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <motion.div 
            className="relative backdrop-blur-2xl bg-white/[0.02] rounded-lg border border-white/[0.05] shadow-2xl"
            initial={{ scale: 0.98 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1 }}
          >


            {/* Input area siempre visible y fija en la parte inferior */}
            <div className="p-1.5 sticky bottom-0 bg-transparent z-20">
              <Textarea
                ref={textareaRef}
                value={value}
                onChange={(e) => {
                  setValue(e.target.value);
                  adjustHeight();
                }}
                onKeyDown={handleKeyDown}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
                placeholder="Escribe tu pregunta"
                containerClassName="w-full"
                className={cn(
                  "w-full px-1.5 py-1.5",
                  "resize-none",
                  "bg-transparent",
                  "border-none",
                  "text-white/90 text-sm",
                  "focus:outline-none",
                  "placeholder:text-white/20",
                  "min-h-[40px]"
                )}
                style={{
                  overflow: "hidden",
                }}
                showRing={false}
              />
            </div>

            <AnimatePresence>
              {attachments.length > 0 && (
                <motion.div 
                  className="px-1.5 pb-1.5 flex gap-1 flex-wrap"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  {attachments.map((file, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center gap-1 text-xs bg-white/[0.03] py-0.5 px-1.5 rounded-md text-white/70"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                    >
                      <span className="text-xs">{file}</span>
                      <button 
                        onClick={() => removeAttachment(index)}
                        className="text-white/40 hover:text-white transition-colors"
                        title="Eliminar archivo"
                      >
                        <XIcon className="w-2.5 h-2.5" />
                      </button>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="p-1.5 border-t border-white/[0.05] flex items-center justify-between gap-1.5 sticky bottom-0 bg-transparent z-20">
              <div className="flex items-center gap-1.5">
                <motion.button
                  type="button"
                  onClick={handleAttachFile}
                  whileTap={{ scale: 0.94 }}
                  className="p-1 rounded-md text-white/40 hover:text-white/90 transition-colors relative group"
                  title="Adjuntar archivo"
                >
                  <Paperclip className="w-3 h-3" />
                  <motion.span
                    className="absolute inset-0 bg-white/[0.05] rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                    layoutId="button-highlight"
                  />
                </motion.button>

              </div>
              
              <motion.button
                type="button"
                onClick={handleSendMessage}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                disabled={isTyping || !value.trim()}
                className={cn(
                  "px-2 py-1 rounded-md text-xs font-medium transition-all",
                  "flex items-center gap-1",
                  value.trim()
                    ? "bg-white text-[#0A0A0B] shadow-lg shadow-white/10"
                    : "bg-white/[0.05] text-white/40"
                )}
              >
                {isTyping ? (
                  <LoaderIcon className="w-3 h-3 animate-[spin_2s_linear_infinite]" />
                ) : (
                  <SendIcon className="w-3 h-3" />
                )}
                <span>Enviar</span>
              </motion.button>
            </div>
          </motion.div>


        </motion.div>

        <AnimatePresence>
          {isTyping && (
            <motion.div 
              className="fixed bottom-4 mx-auto transform -translate-x-1/2 backdrop-blur-2xl bg-white/[0.02] rounded-full px-2 py-1 shadow-lg border border-white/[0.05]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
            >
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-4 rounded-full bg-white/[0.05] flex items-center justify-center text-center">
                  <span className="text-xs font-medium text-white/90 mb-0.5">zap</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-white/70">
                  <span>Pensando</span>
                  <TypingDots />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>


      </div>
    );
}

function TypingDots() {
    return (
        <div className="flex items-center ml-1">
            {[1, 2, 3].map((dot) => (
                <motion.div
                    key={dot}
                    className="w-1.5 h-1.5 bg-white/90 rounded-full mx-0.5"
                    initial={{ opacity: 0.3 }}
                    animate={{ 
                        opacity: [0.3, 0.9, 0.3],
                        scale: [0.85, 1.1, 0.85]
                    }}
                    transition={{
                        duration: 1.2,
                        repeat: Infinity,
                        delay: dot * 0.15,
                        ease: "easeInOut",
                    }}
                    style={{
                        boxShadow: "0 0 4px rgba(255, 255, 255, 0.3)"
                    }}
                />
            ))}
        </div>
    );
}

interface ActionButtonProps {
    icon: React.ReactNode;
    label: string;
}

function ActionButton({ icon, label }: ActionButtonProps) {
    const [isHovered, setIsHovered] = useState(false);
    
    return (
        <motion.button
            type="button"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.97 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            className="flex items-center gap-2 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 rounded-full border border-neutral-800 text-neutral-400 hover:text-white transition-all relative overflow-hidden group"
        >
            <div className="relative z-10 flex items-center gap-2">
                {icon}
                <span className="text-xs relative z-10">{label}</span>
            </div>
            
            <AnimatePresence>
                {isHovered && (
                    <motion.div 
                        className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-indigo-500/10"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    />
                )}
            </AnimatePresence>
            
            <motion.span 
                className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-violet-500 to-indigo-500"
                initial={{ width: 0 }}
                whileHover={{ width: "100%" }}
                transition={{ duration: 0.3 }}
            />
        </motion.button>
    );
}

const rippleKeyframes = `
@keyframes ripple {
  0% { transform: scale(0.5); opacity: 0.6; }
  100% { transform: scale(2); opacity: 0; }
}
`;

if (typeof document !== 'undefined') {
    const style = document.createElement('style');
    style.innerHTML = rippleKeyframes;
    document.head.appendChild(style);
} 