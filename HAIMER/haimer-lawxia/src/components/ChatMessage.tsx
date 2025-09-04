import React from 'react';

interface ChatMessageProps {
  role: 'user' | 'model';
  content: string;
}

export default function ChatMessage({ role, content }: ChatMessageProps) {
  return (
    <div className={`flex ${role === 'user' ? 'justify-end' : 'justify-start'} my-2 px-2 sm:px-0`}>
      <div className="bg-contentBackground rounded-large px-3 sm:px-4 py-2 sm:py-3 max-w-[85vw] sm:max-w-xl text-textPrimary text-sm sm:text-base">
        <span className="block whitespace-pre-line">{content}</span>
      </div>
    </div>
  );
} 