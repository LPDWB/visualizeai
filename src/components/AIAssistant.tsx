"use client";

import { useEffect } from 'react';

export default function AIAssistant() {
  console.log('AIAssistant mounted');

  useEffect(() => {
    console.log('AIAssistant useEffect running');
  }, []);

  return (
    <div className="text-white bg-blue-500 p-4 rounded-lg">
      Hello from AI Assistant
    </div>
  );
} 