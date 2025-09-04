"use client";
import Sidebar from '@/components/Sidebar';
import { AnimatedAIChat } from "@/components/ui/animated-ai-chat";
import { useChat } from '@/hooks/useChat';
import { BeamsBackground } from "@/components/ui/beams-background";
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function MainChatPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const {
    conversations,
    activeConversation,
    activeId,
    sendMessage,
    createConversation,
    deleteConversation,
    renameConversation,
    switchConversation,
    loading,
  } = useChat();

  return (
    <div className="relative min-h-screen bg-primaryBackground text-textPrimary flex overflow-hidden">
      {/* Background animado */}
      <div className="fixed inset-0 -z-10">
        <BeamsBackground intensity="strong" />
      </div>

      {/* Botón de menú móvil - solo visible cuando la sidebar está cerrada */}
      {!isSidebarOpen && (
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 text-white hover:bg-white/20 transition-all"
          aria-label="Abrir menú de navegación"
        >
          <Menu size={20} />
        </button>
      )}

      {/* Sidebar móvil */}
      {isSidebarOpen && (
        <div className="md:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsSidebarOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-80 max-w-[85vw]">
            <Sidebar
              conversations={conversations}
              activeId={activeId || ''}
              onNewConversation={() => {
                createConversation();
                setIsSidebarOpen(false);
              }}
              onSelectConversation={(id) => {
                switchConversation(id);
                setIsSidebarOpen(false);
              }}
              deleteConversation={deleteConversation}
              renameConversation={renameConversation}
              onClose={() => setIsSidebarOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Contenido principal del chat y sidebar */}
      <div className="hidden md:flex flex-col w-72 h-screen sticky top-0 left-0 z-10">
        <Sidebar
          conversations={conversations}
          activeId={activeId || ''}
          onNewConversation={createConversation}
          onSelectConversation={switchConversation}
          deleteConversation={deleteConversation}
          renameConversation={renameConversation}
        />
      </div>
      <div className="flex-1 flex flex-col min-h-screen h-screen">
        {/* Header del chat IA */}
        <div className="w-full h-6 flex items-center justify-center bg-white/[0.05] rounded-t-2xl border-b border-white/[0.08] text-white/90 text-xs font-sans font-normal z-10 sticky top-0 px-2 sm:px-0" style={{letterSpacing: 0}}>
          <span className="text-center text-xs sm:text-sm">Considera verificar la información importante.</span>
        </div>
        <div className="flex-1 flex w-full min-h-0">
          <AnimatedAIChat
            conversation={activeConversation ?? undefined}
            sendMessage={sendMessage}
          />
        </div>
      </div>
    </div>
  );
} 