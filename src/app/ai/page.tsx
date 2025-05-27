"use client";

import { AIAssistant } from '@/components/AIAssistant';

export default function AIPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              AI Data Assistant
            </h1>
            <p className="text-muted-foreground">
              Upload your data and let AI help you analyze and visualize it.
            </p>
          </div>
          <AIAssistant />
        </div>
      </div>
    </div>
  );
}