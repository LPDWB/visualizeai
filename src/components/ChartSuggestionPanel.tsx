'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface ChartSuggestionPanelProps {
  suggestions: string[];
  onSuggestionClick: (suggestion: string) => void;
  visible: boolean;
}

export function ChartSuggestionPanel({ suggestions, onSuggestionClick, visible }: ChartSuggestionPanelProps) {
  if (!visible || suggestions.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        className="w-64 bg-background/50 backdrop-blur border rounded-lg p-4 space-y-4"
      >
        <h3 className="text-sm font-medium">Suggested Visualizations</h3>
        <div className="space-y-2">
          {suggestions.map((suggestion, i) => (
            <Button
              key={i}
              size="sm"
              variant="outline"
              className="w-full justify-start transition-all hover:scale-[1.02] hover:bg-primary/10"
              onClick={() => onSuggestionClick(suggestion)}
            >
              {suggestion}
            </Button>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
} 