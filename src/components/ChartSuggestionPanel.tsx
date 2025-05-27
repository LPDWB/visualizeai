'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { ChartRenderer } from './charts/ChartRenderer';
import { useState } from 'react';
import { cn } from '../lib/utils';
import { ChartConfig, ChartTemplate, ChartType } from '../lib/charts/types';
import { Type } from '../lib/data/types';
import { chartTemplates } from '../lib/charts/templates';

interface ChartSuggestionPanelProps {
  suggestions: string[];
  onSuggestionClick: (suggestion: string, chartConfig: ChartConfig) => void;
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

  const generateChartConfig = (suggestion: string): ChartConfig | null => {
    if (!data || !columns) return null;

    // Определяем тип графика на основе текста предложения
    let chartType: ChartType = 'bar';
    if (suggestion.toLowerCase().includes('pie')) chartType = 'pie';
    else if (suggestion.toLowerCase().includes('scatter')) chartType = 'scatter';
    else if (suggestion.toLowerCase().includes('line')) chartType = 'line';
    else if (suggestion.toLowerCase().includes('area')) chartType = 'area';

    const template = chartTemplates.find((t: ChartTemplate) => t.type === chartType);
    if (!template) return null;

    // Определяем оси на основе данных
    const xAxis = columns[0];
    const yAxis = columns[1];

    return {
      type: chartType,
      template,
      encoding: {
        x: { field: xAxis, type: Type.String },
        y: { field: yAxis, type: Type.Number }
      },
      data: {
        columns: columns.map(name => ({
          name,
          type: Type.String,
          values: data.map(row => row[name])
        })),
        rows: data
      }
    };
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="w-full max-w-[400px] bg-background/50 backdrop-blur border border-primary/10 rounded-2xl p-4 space-y-4 shadow-lg"
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
                  selectedChart === suggestion && "bg-primary/20",
                  "text-left line-clamp-2"
                )}
                onClick={() => {
                  setSelectedChart(suggestion);
                  const config = generateChartConfig(suggestion);
                  if (config) {
                    onSuggestionClick(suggestion, config);
                  }
                }}
              >
                <span className="truncate">{suggestion}</span>
              </Button>
            </motion.div>
          ))}
        </div>

        {selectedChart && data && columns && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 bg-background/30 rounded-xl p-3"
          >
            <ChartRenderer
              config={generateChartConfig(selectedChart) || {
                type: 'bar',
                template: chartTemplates[0],
                encoding: {
                  x: { field: columns[0], type: Type.String },
                  y: { field: columns[1], type: Type.Number }
                },
                data: {
                  columns: columns.map(name => ({
                    name,
                    type: Type.String,
                    values: data.map(row => row[name])
                  })),
                  rows: data
                }
              }}
            />
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
} 