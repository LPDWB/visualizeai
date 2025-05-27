'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChartRenderer } from '@/components/ChartRenderer';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface ChartSuggestionPanelProps {
  suggestions: string[];
  onSuggestionClick: (suggestion: string) => void;
  visible: boolean;
  data?: any[];
  columns?: string[];
}

export function ChartSuggestionPanel({ 
  suggestions, 
  onSuggestionClick, 
  visible,
  data,
  columns 
}: ChartSuggestionPanelProps) {
  const [selectedChart, setSelectedChart] = useState<string | null>(null);

  if (!visible || suggestions.length === 0) return null;

  // Determine x and y axes based on data
  const xAxis = columns?.[0] || '';
  const yAxis = columns?.[1] || '';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="w-80 bg-background/50 backdrop-blur border border-primary/10 rounded-lg p-4 space-y-4"
      >
        <motion.h3 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm font-medium flex items-center gap-2"
        >
          <span className="text-lg">📊</span>
          Suggested Visualizations
        </motion.h3>

        <div className="space-y-2">
          {suggestions.map((suggestion, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Button
                size="sm"
                variant="outline"
                className={cn(
                  "w-full justify-start transition-all hover:scale-[1.02] hover:bg-primary/10",
                  selectedChart === suggestion && "bg-primary/20"
                )}
                onClick={() => {
                  setSelectedChart(suggestion);
                  onSuggestionClick(suggestion);
                }}
              >
                {suggestion}
              </Button>
            </motion.div>
          ))}
        </div>

        {selectedChart && data && columns && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4"
          >
            <ChartRenderer
              data={data}
              columns={columns}
              chartType={selectedChart.toLowerCase().includes('pie') ? 'pie' : 'bar'}
              xAxis={xAxis}
              yAxis={yAxis}
            />
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
} 