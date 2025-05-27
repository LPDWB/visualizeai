"use client";

import { useState, ChangeEvent, useEffect, useRef } from 'react';
import { FileUploader } from './FileUploader';
import { useStore } from '../store/useStore';
import { Button } from './ui/button';
import { FileData } from '../store/types';
import { MessageBubble } from './MessageBubble';
import { ModelDropdown, MODELS } from './ModelDropdown';
import { ChartSuggestionPanel } from './ChartSuggestionPanel';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';
import { AIChartDisplay } from './charts/AIChartDisplay';
import { ChartConfig, ChartTemplate, ChartEncoding } from '../lib/charts/types';
import { createTableFromText } from '../lib/data/utils';
import { chartTemplates } from '../lib/charts/templates';
import { Type } from '../lib/data/types';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  suggestions?: string[];
  chartConfig?: ChartConfig;
}

export function AIAssistant() {
  const { currentFile, addToHistory, setCurrentFile, fileHistory, createChartFromAIConfig } = useStore();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedModel, setSelectedModel] = useState(MODELS[0].id);
  const [showVisualizations, setShowVisualizations] = useState(false);
  const [activeChartId, setActiveChartId] = useState<string | null>(null);
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
    try {
      const text = await file.text();
      const table = createTableFromText(text);
      const fileData: FileData = {
        name: file.name,
        data: table.rows,
        columns: table.columns.map(col => col.name),
        timestamp: Date.now(),
      };
      setCurrentFile(fileData);
      addToHistory(fileData);

      // Add welcome message
      setMessages([{
        role: 'assistant',
        content: `I've loaded your ${file.name} file. What would you like to know about the data?`,
        timestamp: Date.now(),
      }]);
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
    setActiveChartId(null);

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
      
      // Extract chart configuration from response
      let chartConfig: ChartConfig | undefined;
      try {
        const configMatch = aiResponse.match(/```json\n([\s\S]*?)\n```/);
        if (configMatch) {
          const parsedConfig = JSON.parse(configMatch[1]);
          const template = chartTemplates.find((t: ChartTemplate) => t.type === parsedConfig.type);
          if (!template) {
            throw new Error('Invalid chart type');
          }

          // Convert string encoding to ChartChannel objects
          const encoding: ChartEncoding = {};
          if (parsedConfig.encoding) {
            Object.entries(parsedConfig.encoding).forEach(([key, value]) => {
              if (key === 'tooltip' && Array.isArray(value)) {
                encoding.tooltip = value.map(field => ({
                  field,
                  type: Type.String
                }));
              } else if (typeof value === 'string') {
                const column = currentFile.columns.find(col => col === value);
                if (column) {
                  const channel = {
                    field: value,
                    type: Type.String
                  };
                  encoding[key as keyof Omit<ChartEncoding, 'tooltip'>] = channel;
                }
              }
            });
          }

          chartConfig = {
            type: parsedConfig.type,
            template,
            encoding,
            data: {
              columns: currentFile.columns.map(name => ({
                name,
                type: Type.String,
                values: currentFile.data.map(row => row[name])
              })),
              rows: currentFile.data
            }
          };
        }
      } catch (e) {
        console.error('Error parsing chart config:', e);
      }

      // Extract suggestions from response
      const extractedSuggestions = aiResponse
        .split('\n')
        .filter((line: string) => 
          line.toLowerCase().includes('chart') || 
          line.toLowerCase().includes('visualization') ||
          line.toLowerCase().includes('график') ||
          line.toLowerCase().includes('диаграмма')
        )
        .map((line: string) => line.trim());

      // Add AI message
      const assistantMessage: Message = {
        role: 'assistant',
        content: aiResponse,
        timestamp: Date.now(),
        suggestions: extractedSuggestions.length > 0 ? extractedSuggestions : undefined,
        chartConfig
      };
      setMessages(prev => [...prev, assistantMessage]);
      
      // Create chart if config is available
      if (chartConfig) {
        const chartId = createChartFromAIConfig(chartConfig, chartConfig.data);
        if (chartId) {
          setActiveChartId(chartId);
        }
      }
      
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
    <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-4 h-[calc(100vh-12rem)]">
      {/* Main Chat Area */}
      <motion.div 
        className="flex flex-col bg-background/50 backdrop-blur border border-primary/10 rounded-2xl p-4 shadow-lg"
        layout
      >
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
            {messages.map((message, index) => (
              <div key={message.timestamp} className="space-y-4">
                <MessageBubble
                  content={message.content}
                  role={message.role}
                  timestamp={message.timestamp}
                  isLast={index === messages.length - 1}
                />
                {message.chartConfig && activeChartId && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                  >
                    <AIChartDisplay
                      chartId={activeChartId}
                      onClose={() => setActiveChartId(null)}
                    />
                  </motion.div>
                )}
              </div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="relative">
          <textarea
            className="w-full rounded-xl border border-input bg-background/50 backdrop-blur px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary min-h-[60px] resize-none"
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
      </motion.div>

      {/* Visualization Panel */}
      <AnimatePresence>
        {showVisualizations && (
          <ChartSuggestionPanel
            suggestions={messages[messages.length - 1]?.suggestions || []}
            onSuggestionClick={(suggestion) => {
              console.log('Build chart:', suggestion);
            }}
            visible={showVisualizations}
            data={currentFile?.data}
            columns={currentFile?.columns}
          />
        )}
      </AnimatePresence>
    </div>
  );
} 