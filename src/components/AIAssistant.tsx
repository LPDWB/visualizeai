"use client";

import { useState, ChangeEvent, useEffect, useRef } from 'react';
import { FileUploader } from '@/components/FileUploader';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { FileData } from '@/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  suggestions?: string[];
}

const MODELS = [
  { id: 'claude-3-haiku', name: 'Claude 3 Haiku' },
  { id: 'mixtral', name: 'Mixtral' },
  { id: 'gpt-4', name: 'GPT-4' },
];

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

  // Load model preference
  useEffect(() => {
    const savedModel = localStorage.getItem('preferredModel');
    if (savedModel && MODELS.some(m => m.id === savedModel)) {
      setSelectedModel(savedModel);
    }
  }, []);

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
          <Select value={selectedModel} onValueChange={setSelectedModel}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select model" />
            </SelectTrigger>
            <SelectContent>
              {MODELS.map(model => (
                <SelectItem key={model.id} value={model.id}>
                  {model.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <FileUploader onFileUpload={handleFileUpload} />
        </div>

        {/* Chat Messages */}
        <div 
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto space-y-4 mb-4 pr-4"
        >
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={message.timestamp}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <div className="prose prose-invert max-w-none">
                    {message.content.split(/\n\n|\n- /).map((block, i) => (
                      <div key={i} className="mb-2 last:mb-0">
                        {block.trim()}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="relative">
          <textarea
            className="w-full rounded-lg border border-input bg-background/50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary min-h-[60px] resize-none"
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
      <AnimatePresence>
        {showVisualizations && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="w-64 bg-background/50 backdrop-blur border rounded-lg p-4 space-y-4"
          >
            <h3 className="text-sm font-medium">Suggested Visualizations</h3>
            <div className="space-y-2">
              {messages[messages.length - 1]?.suggestions?.map((suggestion, i) => (
                <Button
                  key={i}
                  size="sm"
                  variant="outline"
                  className="w-full justify-start transition-all hover:scale-[1.02] hover:bg-primary/10"
                  onClick={() => {
                    console.log('Build chart:', suggestion);
                  }}
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 