import { useState, useEffect, useCallback } from 'react';
import { db, auth } from '@/services/firebase';
import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
  query,
  orderBy
} from 'firebase/firestore';

export interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  hasUserMessage?: boolean;
  createdAt?: any;
}

const initialConversations: Conversation[] = [];

// Función para generar IDs únicos de mensajes
const generateMessageId = (conversationId: string, timestamp: number, index: number): string => {
  return `${conversationId}-msg-${timestamp}-${index}`;
};

// Función para limpiar mensajes duplicados
const cleanDuplicateMessages = (messages: Message[]): Message[] => {
  const seen = new Set<string>();
  return messages.filter(msg => {
    if (seen.has(msg.id)) {
      return false;
    }
    seen.add(msg.id);
    return true;
  });
};

export function useChat() {
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [pendingConversation, setPendingConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(false);

  // Leer conversaciones en tiempo real
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    setLoading(true);
    const authUnsub = auth.onAuthStateChanged(user => {
      if (user) {
        const convRef = collection(db, 'users', user.uid, 'conversations');
        const q = query(convRef, orderBy('createdAt', 'desc'));
        unsubscribe = onSnapshot(q, async snapshot => {
          const loaded: Conversation[] = [];
          snapshot.forEach(docSnap => {
            const data = docSnap.data();
            // Asegurar que los mensajes tengan IDs únicos
            const messages = (data.messages || []).map((msg: Message, index: number) => {
              if (!msg.id || msg.id.startsWith('msg-')) {
                // Regenerar ID si es inválido o usa el formato antiguo
                return {
                  ...msg,
                  id: generateMessageId(docSnap.id, Date.now(), index)
                };
              }
              return msg;
            });
            
            loaded.push({
              id: docSnap.id,
              title: data.title,
              messages: cleanDuplicateMessages(messages),
              hasUserMessage: data.hasUserMessage || false,
              createdAt: data.createdAt,
            });
          });
          setConversations(loaded);
          if ((!activeId || !loaded.find(c => c.id === activeId)) && loaded.length > 0) {
            setActiveId(loaded[0].id);
          }
          // Si no hay conversaciones, crea una nueva automáticamente
          if (loaded.length === 0 && user) {
            const newId = doc(collection(db, 'users', user.uid, 'conversations')).id;
            const newConv: Conversation = {
              id: newId,
              title: 'Nueva conversación',
              messages: [],
              hasUserMessage: false,
              createdAt: serverTimestamp(),
            };
            await setDoc(doc(db, 'users', user.uid, 'conversations', newId), newConv);
            setPendingConversation(newConv);
            setActiveId(newId);
          }
          setLoading(false);
        });
      } else {
        setConversations([]);
        setActiveId(null);
        setLoading(false);
      }
    });
    return () => {
      if (unsubscribe) unsubscribe();
      authUnsub();
    };
  }, [activeId]);

  const activeConversation =
    pendingConversation && pendingConversation.id === activeId
      ? pendingConversation
      : conversations.find(c => c.id === activeId) || null;

  // Crear nueva conversación en Firestore (vacía, pero solo mostrar si el usuario escribe)
  const createConversation = useCallback(async () => {
    const user = auth.currentUser;
    if (!user) return null;
    const newId = doc(collection(db, 'users', user.uid, 'conversations')).id;
    const newConv: Conversation = {
      id: newId,
      title: 'Nueva conversación',
      messages: [],
      hasUserMessage: false,
      createdAt: serverTimestamp(),
    };
    await setDoc(doc(db, 'users', user.uid, 'conversations', newId), newConv);
    setPendingConversation(newConv);
    setActiveId(newId);
    return newId;
  }, []);

  // Eliminar conversación
  const deleteConversation = useCallback(async (convId: string) => {
    const user = auth.currentUser;
    if (!user) return;
    await deleteDoc(doc(db, 'users', user.uid, 'conversations', convId));
    setConversations(convs => convs.filter(c => c.id !== convId));
    if (activeId === convId) {
      // Cambia a otra conversación si la activa fue eliminada
      const remaining = conversations.filter(c => c.id !== convId);
      setActiveId(remaining.length > 0 ? remaining[0].id : null);
    }
  }, [activeId, conversations]);

  // Renombrar conversación
  const renameConversation = useCallback(async (convId: string, newTitle: string) => {
    const user = auth.currentUser;
    if (!user) return;
    await updateDoc(doc(db, 'users', user.uid, 'conversations', convId), {
      title: newTitle,
    });
    setConversations(convs => convs.map(c => c.id === convId ? { ...c, title: newTitle } : c));
  }, []);

  // Modifica sendMessage para crear una conversación si no hay activa
  const sendMessage = async (content: string) => {
    let conv = activeConversation;
    let convId = activeId;
    
    // Si no hay conversación activa, crea una nueva
    if (!conv) {
      const user = auth.currentUser;
      if (!user) return;
      convId = doc(collection(db, 'users', user.uid, 'conversations')).id;
      const newConv: Conversation = {
        id: convId,
        title: 'Nueva conversación',
        messages: [],
        hasUserMessage: false,
        createdAt: serverTimestamp(),
      };
      await setDoc(doc(db, 'users', user.uid, 'conversations', convId), newConv);
      setPendingConversation(newConv);
      setActiveId(convId);
      conv = newConv;
    }

    // Generar IDs únicos para los mensajes
    const timestamp = Date.now();
    const currentMessageCount = conv?.messages?.length || 0;
    
    const newMessage: Message = {
      id: generateMessageId(convId!, timestamp, currentMessageCount),
      role: 'user',
      content,
    };
    
    const modelMessage: Message = {
      id: generateMessageId(convId!, timestamp, currentMessageCount + 1),
      role: 'model',
      content: 'Respuesta automática de Lawxia.',
    };

    if (pendingConversation && pendingConversation.id === convId) {
      // Primera vez que se escribe en la conversación
      const newConv: Conversation = {
        ...pendingConversation,
        messages: cleanDuplicateMessages([newMessage, modelMessage]),
        hasUserMessage: true,
      };
      await setDoc(doc(db, 'users', auth.currentUser!.uid, 'conversations', newConv.id), {
        ...newConv,
        createdAt: serverTimestamp(),
      });
      setPendingConversation(null);
    } else {
      // Actualizar conversación existente
      const updatedMessages = cleanDuplicateMessages([...(conv?.messages || []), newMessage, modelMessage]);
      await updateDoc(doc(db, 'users', auth.currentUser!.uid, 'conversations', convId!), {
        messages: updatedMessages,
        hasUserMessage: true,
      });
    }
  };

  // Cambiar de conversación activa
  const switchConversation = (id: string) => {
    setActiveId(id);
  };

  // Sidebar muestra todas las conversaciones, incluyendo la activa aunque esté vacía
  const sidebarConversations = [
    ...conversations.filter(c => c.hasUserMessage || (c.messages && c.messages.length > 0) || c.id === activeId)
  ];

  return {
    conversations: sidebarConversations,
    activeConversation,
    activeId,
    sendMessage,
    createConversation,
    deleteConversation,
    renameConversation,
    switchConversation,
    loading,
  };
} 