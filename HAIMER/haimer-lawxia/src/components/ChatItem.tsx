import React from 'react';

interface ChatItemProps {
  title: string;
  active?: boolean;
  onClick?: () => void;
}

export default function ChatItem({ title, active, onClick }: ChatItemProps) {
  return (
    <button
      className={`w-full text-left px-3 py-2 rounded-medium text-textPrimary transition ${active ? 'bg-componentSubtle' : 'hover:bg-componentSubtle'}`}
      onClick={onClick}
    >
      {title}
    </button>
  );
} 