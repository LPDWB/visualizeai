'use client';

import { motion } from 'framer-motion';

interface MessageBubbleProps {
  content: string;
  role: 'user' | 'assistant';
  timestamp: number;
}

export function MessageBubble({ content, role, timestamp }: MessageBubbleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={`flex ${role === 'user' ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2 ${
          role === 'user'
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted/50 backdrop-blur'
        }`}
      >
        <div className="prose prose-invert max-w-none">
          {content.split(/\n\n|\n- /).map((block, i) => (
            <div key={i} className="mb-2 last:mb-0">
              {block.trim()}
            </div>
          ))}
        </div>
        <div className="text-xs opacity-50 mt-1">
          {new Date(timestamp).toLocaleTimeString()}
        </div>
      </div>
    </motion.div>
  );
} 