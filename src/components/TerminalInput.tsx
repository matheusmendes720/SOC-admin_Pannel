/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const SUGGESTIONS = [
  'npm run dev',
  'npm install @google/genai',
  'git status',
  'git commit -m "update dashboard"',
  'ls -la',
  'cat /sys/kernel/debug/metrics',
  'grep -r "MetricsEngine" ./src',
  'curl -X GET /api/v1/metrics',
  'node --inspect-brk server.ts',
  'tail -f /var/log/syslog',
  'clear',
  'help'
];

interface TerminalInputProps {
  onExecute: (cmd: string) => void;
}

/**
 * TerminalInput Component
 * Provides a high-fidelity command entry interface with real-time autocompletion.
 * Supports Tab for completion and Enter for execution.
 */
export default function TerminalInput({ onExecute }: TerminalInputProps) {
  const [input, setInput] = useState('');
  const [suggestion, setSuggestion] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Keep focus on input
    const focus = () => inputRef.current?.focus();
    focus();
    window.addEventListener('click', focus);
    return () => window.removeEventListener('click', focus);
  }, []);

  useEffect(() => {
    if (input.trim() === '') {
      setSuggestion('');
      return;
    }

    const match = SUGGESTIONS.find(s => s.startsWith(input));
    if (match && match !== input) {
      setSuggestion(match);
    } else {
      setSuggestion('');
    }
  }, [input]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Tab' && suggestion) {
      e.preventDefault();
      setInput(suggestion);
    } else if (e.key === 'Enter') {
      const cmd = input.trim();
      if (cmd) {
        onExecute(cmd);
        setInput('');
      }
    }
  };

  return (
    <div className="relative flex items-center gap-2 tui-mono mt-4 border-t border-white/5 pt-4">
      <span className="text-neon-matrix shrink-0 font-bold glow-text-green">PETRO_SEC:~/shield#</span>
      
      <div className="relative flex-1">
        {/* Suggestion Ghost Text */}
        {suggestion && (
          <span className="absolute inset-0 text-white opacity-20 pointer-events-none italic">
            {suggestion}
          </span>
        )}
        
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full bg-transparent border-none outline-none text-white selection:bg-neon-matrix/30 caret-neon-matrix font-medium"
          spellCheck={false}
          autoComplete="off"
        />
      </div>

      <AnimatePresence>
        {suggestion && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute right-0 top-[-28px] bg-petro-orange/10 border border-petro-orange/30 px-2 py-0.5 rounded text-[9px] text-petro-orange font-black tracking-widest uppercase shadow-[0_0_15px_rgba(255,98,0,0.2)]"
          >
            TAB_AUTOCOMPLETE
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
