'use client';

import { useState, useEffect } from 'react';
import TextVisualizer from '@/components/TextVisualizer';
import { useSearchParams } from 'next/navigation';
import { useDataStore } from '@/store/dataStore';
import { DiagramData } from '@/store/dataStore';

export default function TextVisualsPage() {
  const searchParams = useSearchParams();
  const diagramId = searchParams.get('id');
  const records = useDataStore((state) => state.records);
  const [initialData, setInitialData] = useState<DiagramData | undefined>(undefined);

  useEffect(() => {
    if (diagramId) {
      const record = records.find((r) => r.id === diagramId);
      if (record && record.type === 'diagram') {
        setInitialData(record.data as DiagramData);
      }
    }
  }, [diagramId, records]);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Text Visualization</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Enter your text below, with each item on a new line. Click "Generate Diagram" to create a visual representation.
        You can drag nodes to rearrange them, and use the controls to zoom and pan.
      </p>
      <TextVisualizer initialData={initialData} />
    </div>
  );
} 