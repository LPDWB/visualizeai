import { AIChat } from '@/components/AIChat';

export default function AssistantPage() {
  return (
    <div className="container mx-auto p-4 md:p-8 flex flex-col items-center min-h-[70vh]">
      <h1 className="mb-8 text-4xl font-bold tracking-tight text-center">AI Assistant</h1>
      <div className="w-full max-w-2xl">
        <AIChat />
      </div>
    </div>
  );
} 