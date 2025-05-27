"use client";

import { useState, ChangeEvent, useEffect, useRef } from 'react';
import { FileUploader } from '@/components/FileUploader';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { FileData } from '@/types';
import { MessageBubble } from '@/components/MessageBubble';
import { ModelDropdown, MODELS } from '@/components/ModelDropdown';
import { ChartSuggestionPanel } from '@/components/ChartSuggestionPanel';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  suggestions?: string[];
}

export function AIAssistant() {
  const { currentFile, addToHistory, setCurrentFile, fileHistory } = useStore();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedModel, setSelectedModel] = useState(MODELS[0].id);
  const [showVisualizations, setShowVisualizations] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Save model preference
  useEffect(() => {
    localStorage.setItem('preferredModel', selectedModel);
  }, [selectedModel]);

  const handleFileUpload = async (file: File) => {
    if (!file) return;
    const { parseFile } = await import('@/utils/fileParser');
    try {
      const { data, columns } = await parseFile(file);
      const fileData: FileData = {
        name: file.name,
        data,
        columns,
        timestamp: Date.now(),
      };
      setCurrentFile(fileData);
      addToHistory(fileData);
    } catch (e) {
      console.error('Error parsing file:', e);
    }
  };

  const handleAskAI = async () => {
    if (!input.trim() || !currentFile) return;
    
    // Add user message
    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: Date.now(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setShowVisualizations(false);

    try {
      const dataSample = currentFile.data.slice(0, 100);
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: input, 
          previewData: dataSample,
          model: selectedModel 
        }),
      });
      
      if (!res.ok) {
        throw new Error('AI request failed');
      }
      
      const data = await res.json();
      const aiResponse = data.output || 'No AI response received';
      
      // Extract suggestions from response
      const extractedSuggestions = aiResponse
        .split('\n')
        .filter((line: string) => line.toLowerCase().includes('chart') || line.toLowerCase().includes('visualization'))
        .map((line: string) => line.trim());

      // Add AI message
      const assistantMessage: Message = {
        role: 'assistant',
        content: aiResponse,
        timestamp: Date.now(),
        suggestions: extractedSuggestions.length > 0 ? extractedSuggestions : undefined,
      };
      setMessages(prev => [...prev, assistantMessage]);
      
      // Show visualization panel if suggestions exist
      if (extractedSuggestions.length > 0) {
        setShowVisualizations(true);
      }
    } catch (e) {
      console.error('Error contacting AI:', e);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Error contacting AI. Please try again.',
        timestamp: Date.now(),
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-12rem)] gap-4">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <ModelDropdown value={selectedModel} onChange={setSelectedModel} />
          <FileUploader onFileUpload={handleFileUpload} />
        </div>

        {/* Chat Messages */}
        <div 
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto space-y-4 mb-4 pr-4"
        >
          <AnimatePresence>
            {messages.map((message) => (
              <MessageBubble
                key={message.timestamp}
                content={message.content}
                role={message.role}
                timestamp={message.timestamp}
              />
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="relative">
          <textarea
            className="w-full rounded-lg border border-input bg-background/50 backdrop-blur px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary min-h-[60px] resize-none"
            placeholder={currentFile ? "Ask about your data..." : "Upload a file to get started..."}
            value={input}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value)}
            disabled={loading || !currentFile}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleAskAI();
              }
            }}
          />
          <Button 
            onClick={handleAskAI} 
            disabled={loading || !input.trim() || !currentFile} 
            className="absolute right-2 bottom-2 transition-all hover:scale-[1.02]"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin">⚡</span>
                Thinking...
              </span>
            ) : 'Send'}
          </Button>
        </div>
      </div>

      {/* Visualization Panel */}
      <ChartSuggestionPanel
        suggestions={messages[messages.length - 1]?.suggestions || []}
        onSuggestionClick={(suggestion) => {
          console.log('Build chart:', suggestion);
        }}
        visible={showVisualizations}
      />
    </div>
  );
} 