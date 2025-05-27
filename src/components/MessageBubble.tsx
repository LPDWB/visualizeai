'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface MessageBubbleProps {
  content: string;
  role: 'user' | 'assistant';
  timestamp: number;
  isLast?: boolean;
}

export function MessageBubble({ content, role, timestamp, isLast }: MessageBubbleProps) {
  const isAssistant = role === 'assistant';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ 
        duration: 0.3,
        type: "spring",
        stiffness: 200,
        damping: 20
      }}
      className={cn(
        "flex gap-2",
        isAssistant ? "justify-start" : "justify-end"
      )}
    >
      {isAssistant && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center"
        >
          <span className="text-lg">🤖</span>
        </motion.div>
      )}
      
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-2",
          isAssistant
            ? "bg-muted/50 backdrop-blur border border-primary/10"
            : "bg-primary text-primary-foreground"
        )}
      >
        <div className="prose prose-invert max-w-none">
          {content.split(/\n\n|\n- /).map((block, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="mb-2 last:mb-0"
            >
              {block.trim()}
            </motion.div>
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 0.2 }}
          className="text-xs mt-1"
        >
          {new Date(timestamp).toLocaleTimeString()}
        </motion.div>
      </div>

      {!isAssistant && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center"
        >
          <span className="text-lg">👤</span>
        </motion.div>
      )}
    </motion.div>
  );
} 