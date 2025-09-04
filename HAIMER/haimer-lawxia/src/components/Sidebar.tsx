import React, { useEffect, useState } from 'react';
import Button from './Button';
import ChatItem from './ChatItem';
import { Conversation } from '@/hooks/useChat';
import { MessageSquare, Activity, Settings, PlusIcon, User, Briefcase, Trash2, Pencil, X } from "lucide-react";
import { useRouter } from 'next/navigation';
import { auth } from "@/services/firebase";

interface SidebarProps {
  conversations: Conversation[];
  activeId: string;
  onNewConversation: () => void;
  onSelectConversation: (id: string) => void;
  onClose?: () => void;
}

export default function Sidebar({ conversations, activeId, onNewConversation, onSelectConversation, deleteConversation, renameConversation, onClose }: SidebarProps & { deleteConversation: (id: string) => void, renameConversation: (id: string, title: string) => void }) {
  const [userName, setUserName] = useState("Usuario");
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const unsubscribe = auth.onAuthStateChanged(user => {
        if (user) {
          setUserName(user.displayName || user.email || "Usuario");
          setUserPhoto(user.photoURL);
        } else {
          setUserName("Usuario");
          setUserPhoto(null);
        }
      });
      return () => unsubscribe();
    }
  }, []);
  const router = useRouter();
  return (
    <aside className="flex flex-col h-full w-full p-3 sm:p-4 bg-transparent rounded-2xl border border-white/[0.05] shadow-2xl text-white/90 backdrop-blur-2xl bg-white/[0.02] relative">
      {/* Botón de cerrar para móviles */}
      {onClose && (
        <button
          onClick={onClose}
          className="md:hidden absolute top-2 right-2 p-1.5 text-white/70 hover:text-white transition-colors z-10"
          aria-label="Cerrar sidebar"
        >
          <X size={18} />
        </button>
      )}
      {/* Perfil de usuario */}
      <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 font-sans mt-1">
        <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-white/[0.05] backdrop-blur-lg overflow-hidden">
          {userPhoto ? (
            <img src={userPhoto} alt="Foto de perfil" className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-full" />
          ) : (
            <User className="w-6 h-6 sm:w-7 sm:h-7 text-white/90" />
          )}
        </div>
        <span className="text-sm sm:text-base font-normal text-white/90">{userName}</span>
      </div>
      <div className="border-t border-white/[0.08] my-3" />
      {/* Card de empresa */}
      <div
        className="flex flex-col items-center justify-center mb-3 sm:mb-4 bg-white/[0.05] rounded-lg font-sans w-full aspect-[2/1] min-h-[36px] min-w-[72px] cursor-pointer transition hover:bg-white/[0.08]"
        onClick={() => router.push('/company-dashboard')}
        tabIndex={0}
        role="button"
        aria-label="Ir a panel de empresa"
      >
        <Briefcase className="w-8 h-8 sm:w-10 sm:h-10 text-white/90 mb-1 sm:mb-2" />
        <span className="text-sm sm:text-base font-normal text-white/90">Mi empresa</span>
      </div>
      <div className="border-t border-white/[0.08] my-2 sm:my-3" />
      {/* Botón Nueva conversación */}
      <button
        className="flex items-center gap-2 px-2 sm:px-3 py-2 mb-3 sm:mb-4 bg-white/[0.05] hover:bg-white/[0.10] rounded-lg text-white/90 text-xs sm:text-sm font-medium transition-all"
        onClick={onNewConversation}
      >
        <PlusIcon className="w-4 h-4" />
        Nueva conversación
      </button>
      <div className="border-t border-white/[0.08] my-3" />
      {/* Conversaciones recientes y resto de la sidebar */}
      <div className="flex-1 overflow-y-auto mb-4">
        <h3 className="text-xs font-medium mb-2 text-white/60">Recientes</h3>
        <ul className="space-y-1">
          {conversations.map(conv => (
            <li key={conv.id} className="group relative flex items-center">
              {editingId === conv.id ? (
                <form
                  className="flex items-center w-full gap-2"
                  onSubmit={e => {
                    e.preventDefault();
                    if (editTitle.trim()) {
                      renameConversation(conv.id, editTitle.trim());
                      setEditingId(null);
                    }
                  }}
                >
                  <input
                    className="flex-1 bg-transparent border-b border-white/30 text-white px-2 py-1 outline-none"
                    value={editTitle}
                    onChange={e => setEditTitle(e.target.value)}
                    autoFocus
                    onBlur={() => setEditingId(null)}
                    aria-label="Editar título de la conversación"
                    placeholder="Nuevo título"
                  />
                  <button type="submit" className="text-xs text-white/70 px-2">OK</button>
                </form>
              ) : (
                <button
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium w-full text-left transition-all ${conv.id === activeId ? 'bg-white/[0.05] text-white' : 'text-white/70 hover:bg-white/[0.05] hover:text-white/90'}`}
                  onClick={() => onSelectConversation(conv.id)}
                  onDoubleClick={() => {
                    setEditingId(conv.id);
                    setEditTitle(conv.title);
                  }}
                  title="Haz doble click para renombrar"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span className="flex-1 truncate">{conv.title}</span>
                  <button
                    type="button"
                    className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity text-white/60 hover:text-red-400"
                    title="Eliminar conversación"
                    onClick={e => {
                      e.stopPropagation();
                      deleteConversation(conv.id);
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity text-white/60 hover:text-white"
                    title="Renombrar conversación"
                    onClick={e => {
                      e.stopPropagation();
                      setEditingId(conv.id);
                      setEditTitle(conv.title);
                    }}
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
      <div className="border-t border-white/[0.08] my-3" />
      <div className="flex items-center gap-3 px-2 mt-auto">
        <Activity className="w-5 h-5 text-white/60" />
        <Settings className="w-5 h-5 text-white/60" />
      </div>
    </aside>
  );
} 