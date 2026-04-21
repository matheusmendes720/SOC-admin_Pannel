/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const SUGGESTIONS = [
  'axeguard --harden-nodes',
  'dlp.extract --pii-check',
  'langgraph.sync --subgraph-01',
  'prometheus.query --entropy',
  'grep -i "THREAT" /var/logs/flows',
  'siem.ingest --source-alpha',
  'agent.triage --l2-escalate',
  'system.diag --heavy',
  'help',
  'clear'
];

interface TerminalInputProps {
  onExecute: (cmd: string) => void;
}

/**
 * TerminalInput Component
 * 
 * ARCHITECTURAL ROLE:
 * TUI Control Interface. Acts as the primary write-conduit for the simulation 
 * environment. It allows users to simulate CLI-driven orchestration of the 
 * agentic middlewares (Axe-Guard, LangGraph, etc).
 * 
 * DESIGN PATTERN:
 * Ghost-text Autocompletion. Implements a real-time "Command Suggestion" engine 
 * that predicts SOC-specific operations based on the `SUGGESTIONS` dictionary.
 * 
 * DATA MAPPING:
 * Dispatches terminal primitives to the global execution history, which is 
 * consumed by the operational logs to simulate persistent command auditing.
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
    <div className="relative flex items-center gap-2 tui-mono py-1">
      <span className="text-neon-matrix shrink-0 font-bold glow-text-green text-sm tracking-tight">PETRO_SEC:~/shield#</span>
      
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
