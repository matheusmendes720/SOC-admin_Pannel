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
    <div className="relative flex items-center gap-2 tui-mono mt-2">
      <span className="text-tui-green shrink-0">root@tui-station:~/app#</span>
      
      <div className="relative flex-1">
        {/* Suggestion Ghost Text */}
        {suggestion && (
          <span className="absolute inset-0 text-tui-text-secondary opacity-30 pointer-events-none">
            {suggestion}
          </span>
        )}
        
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full bg-transparent border-none outline-none text-white selection:bg-tui-cyan/30"
          spellCheck={false}
          autoComplete="off"
        />
      </div>

      <AnimatePresence>
        {suggestion && (
          <motion.div 
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            className="absolute right-0 top-[-24px] bg-tui-card border border-tui-orange/30 px-2 py-0.5 rounded text-[9px] text-tui-orange"
          >
            TAB TO AUTOCOMPLETE
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
