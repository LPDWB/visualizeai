import { AIChat } from '@/components/AIChat';

export default function AssistantPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-4 bg-background">
      <h1 className="mb-8 text-4xl font-bold tracking-tight text-center">AI Assistant</h1>
      <div className="w-full max-w-2xl flex-1 flex flex-col justify-start items-center">
        <AIChat />
      </div>
    </div>
  );
} 