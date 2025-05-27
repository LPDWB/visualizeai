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

interface AIResponse {
  chartConfig?: ChartConfig;
  insight: string;
  suggestions?: string[];
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
      const aiResponse: AIResponse = data.output;
      
      // Create chart if config is available
      let chartId: string | null = null;
      if (aiResponse.chartConfig) {
        const config = {
          ...aiResponse.chartConfig,
          data: {
            columns: currentFile.columns.map(name => ({
              name,
              type: Type.String,
              values: currentFile.data.map(row => row[name])
            })),
            rows: currentFile.data
          }
        };
        chartId = createChartFromAIConfig(config, config.data);
      }

      // Add AI message
      const assistantMessage: Message = {
        role: 'assistant',
        content: aiResponse.insight,
        timestamp: Date.now(),
        suggestions: aiResponse.suggestions,
        chartConfig: aiResponse.chartConfig
      };
      setMessages(prev => [...prev, assistantMessage]);
      
      // Activate chart if created
      if (chartId) {
        setActiveChartId(chartId);
      }
      
      // Show visualization panel if suggestions exist
      if (aiResponse.suggestions?.length) {
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

  const handleSuggestionClick = (suggestion: string, chartConfig: ChartConfig) => {
    if (!currentFile) return;
    
    const config = {
      ...chartConfig,
      data: {
        columns: currentFile.columns.map(name => ({
          name,
          type: Type.String,
          values: currentFile.data.map(row => row[name])
        })),
        rows: currentFile.data
      }
    };
    
    const chartId = createChartFromAIConfig(config, config.data);
    if (chartId) {
      setActiveChartId(chartId);
      setShowVisualizations(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={chatContainerRef}>
        {messages.map((message, i) => (
          <div key={i} className="space-y-4">
            <MessageBubble
              content={message.content}
              role={message.role}
              timestamp={message.timestamp}
              isLast={i === messages.length - 1}
            />
            {message.chartConfig && (
              <div className="ml-4">
                <AIChartDisplay
                  chartId={activeChartId || ''}
                  onClose={() => setActiveChartId(null)}
                />
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t">
        <div className="flex gap-2">
          <ModelDropdown
            value={selectedModel}
            onChange={setSelectedModel}
          />
          <FileUploader onFileUpload={handleFileUpload} />
        </div>
        <div className="mt-4 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAskAI()}
            placeholder="Ask about your data..."
            className="flex-1 px-4 py-2 rounded-lg bg-background/50 backdrop-blur border border-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/20"
            disabled={!currentFile || loading}
          />
          <Button
            onClick={handleAskAI}
            disabled={!currentFile || loading || !input.trim()}
          >
            {loading ? 'Thinking...' : 'Ask'}
          </Button>
        </div>
      </div>

      <ChartSuggestionPanel
        suggestions={messages[messages.length - 1]?.suggestions || []}
        onSuggestionClick={handleSuggestionClick}
        visible={showVisualizations}
        data={currentFile?.data}
        columns={currentFile?.columns}
      />
    </div>
  );
} 