"use client";

import AIAssistant from '@/components/AIAssistant';

export default function Page() {
  console.log('AI Page rendering');
  return (
    <div className="min-h-screen p-4 bg-background">
      <div className="text-white bg-red-500 p-4 mb-4">DEBUG: Page wrapper is rendering</div>
      <AIAssistant />
    </div>
  );
} 