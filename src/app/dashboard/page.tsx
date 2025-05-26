'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDataStore } from '@/store/dataStore';
import { ChartCard } from '@/components/ChartCard';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Visualization {
  id: string;
  title: string;
  data: any;
  type: 'line' | 'bar' | 'pie';
  xAxis: string;
  yAxis: string;
}

export default function DashboardPage() {
  const fileData = useDataStore((state) => state.fileData);
  const [visualizations, setVisualizations] = useState<Visualization[]>([]);

  const handleAddVisualization = () => {
    if (!fileData || fileData.type !== 'file') {
      toast.error('Please upload data first');
      return;
    }

    const newViz: Visualization = {
      id: Date.now().toString(),
      title: `Visualization ${visualizations.length + 1}`,
      data: fileData.data,
      type: 'line',
      xAxis: fileData.data.headers[0] || '',
      yAxis: fileData.data.headers[1] || '',
    };

    setVisualizations([...visualizations, newViz]);
    toast.success('New visualization added');
  };

  const handleDeleteVisualization = (id: string) => {
    setVisualizations(visualizations.filter(viz => viz.id !== id));
    toast.success('Visualization removed');
  };

  const handleRefreshVisualization = (id: string) => {
    setVisualizations(visualizations.map(viz => 
      viz.id === id ? { ...viz, data: fileData?.data } : viz
    ));
    toast.success('Visualization refreshed');
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
          Ваши визуализации
        </h1>
        <Button
          onClick={handleAddVisualization}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Добавить визуализацию
        </Button>
      </div>

      {visualizations.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700"
        >
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Нет визуализаций. Добавьте данные для анализа.
          </p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {visualizations.map((viz) => (
              <ChartCard
                key={viz.id}
                id={viz.id}
                title={viz.title}
                data={viz.data}
                onDelete={handleDeleteVisualization}
                onRefresh={handleRefreshVisualization}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
} 