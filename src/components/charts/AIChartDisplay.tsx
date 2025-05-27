'use client';

import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { ChartRenderer } from './ChartRenderer';
import { EncodingShelf } from '../charts/EncodingShelf';
import { useStore } from '../../store/useStore';
import { ChartConfig } from '../../lib/charts/types';
import { motion, AnimatePresence } from 'framer-motion';
import { Table } from '../../lib/data/types';

interface AIChartDisplayProps {
  chartId: string;
  onClose?: () => void;
}

export function AIChartDisplay({ chartId, onClose }: AIChartDisplayProps) {
  const [showEncodingShelf, setShowEncodingShelf] = useState(false);
  const chart = useStore(state => state.charts[chartId]);
  const updateChart = useStore(state => state.updateChart);

  if (!chart) return null;

  const handleEncodingChange = (encoding: ChartConfig['encoding']) => {
    updateChart(chartId, { encoding });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">{chart.name}</h3>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowEncodingShelf(!showEncodingShelf)}
          >
            {showEncodingShelf ? 'Hide Configuration' : 'Configure Chart'}
          </Button>
          {onClose && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
            >
              Close
            </Button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showEncodingShelf && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <EncodingShelf
              template={chart.template}
              encoding={chart.encoding}
              onEncodingChange={handleEncodingChange}
              columns={(chart.data as Table).columns.map(col => ({
                name: col.name,
                type: col.type
              }))}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-background/50 backdrop-blur border border-primary/10 rounded-xl p-4">
        <ChartRenderer
          config={{
            type: chart.type,
            template: chart.template,
            encoding: chart.encoding,
            data: chart.data
          }}
        />
      </div>
    </div>
  );
} 