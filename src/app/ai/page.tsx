"use client";
import { AIAssistant } from '@/components/AIAssistant';
import { ErrorBoundary } from 'react-error-boundary';

function ErrorFallback({ error }: { error: Error }) {
  return (
    <div className="p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-500">
      <h2 className="text-lg font-bold mb-2">Something went wrong:</h2>
      <pre className="text-sm">{error.message}</pre>
    </div>
  );
}

export default function AIPage() {
  console.log('Rendering AIPage');
  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-4 bg-background">
      {/* Debug element */}
      <div className="w-full max-w-4xl mb-4 p-4 bg-blue-500/10 border border-blue-500 rounded-lg text-blue-500">
        DEBUG: AI Page is rendering
      </div>
      
      {/* Error boundary */}
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <div className="w-full max-w-4xl border-2 border-green-500/50 rounded-lg">
          <AIAssistant />
        </div>
      </ErrorBoundary>
    </div>
  );
} 