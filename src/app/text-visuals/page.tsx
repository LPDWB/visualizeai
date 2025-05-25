'use client';

import { Suspense } from 'react';
import TextVisualizer from '@/components/TextVisualizer';
import { useSearchParams } from 'next/navigation';
import { useDataStore } from '@/store/dataStore';
import { DiagramData } from '@/store/dataStore';

function TextVisualsContent() {
  const searchParams = useSearchParams();
  const records = useDataStore((state) => state.records);
  const diagramId = searchParams.get('id');

  const initialData = diagramId
    ? (records.find((record) => record.id === diagramId)?.data as DiagramData)
    : undefined;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Text Visualization</h1>
      <p className="text-gray-600 dark:text-gray-300 mb-8">
        Enter your text below, with each item on a new line. Click "Generate Diagram" to create an interactive visualization.
      </p>
      <TextVisualizer initialData={initialData} />
    </div>
  );
}

export default function TextVisualsPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8">Loading...</div>}>
      <TextVisualsContent />
    </Suspense>
  );
} 