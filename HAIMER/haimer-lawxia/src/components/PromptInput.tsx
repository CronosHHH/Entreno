import React, { useRef, useState } from 'react';
import Button from './Button';

export default function PromptInput({ onSend }: { onSend?: (value: string) => void }) {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  };

  const handleSend = () => {
    if (value.trim() && onSend) {
      onSend(value);
      setValue('');
      if (textareaRef.current) textareaRef.current.style.height = 'auto';
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-end gap-2 p-3 sm:p-4 bg-contentBackground rounded-large">
      <div className="flex items-center gap-2 w-full sm:w-auto mb-2 sm:mb-0">
        <Button variant="inputAction" className="flex-shrink-0 text-xs sm:text-sm">
          <label htmlFor="file-upload" className="cursor-pointer">
            <input id="file-upload" type="file" className="hidden" title="Subir archivo" />
            <span className="hidden sm:inline">Subir archivo</span>
            <span className="sm:hidden">📎</span>
          </label>
        </Button>
        <Button variant="mic" className="flex-shrink-0 text-xs sm:text-sm">
          <span role="img" aria-label="Mic">🎤</span>
        </Button>
      </div>
      <div className="flex items-end gap-2 w-full">
        <textarea
          ref={textareaRef}
          className="flex-1 resize-none bg-contentBackground border border-borderSubtle rounded-pill px-3 sm:px-4 py-2 text-textPrimary placeholder-textTertiary focus:border-focusRing outline-none transition min-h-[40px] max-h-[120px] text-sm sm:text-base"
          rows={1}
          placeholder="Escribe tu mensaje..."
          aria-label="Campo de mensaje"
          title="Campo de mensaje"
          value={value}
          onChange={handleInput}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
        />
        <Button variant="signIn" className="flex-shrink-0 px-3 sm:px-4 py-2 text-xs sm:text-sm" onClick={handleSend}>
          <span className="hidden sm:inline">Enviar</span>
          <span className="sm:hidden">➤</span>
        </Button>
      </div>
    </div>
  );
} 