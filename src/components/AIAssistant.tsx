"use client";

import { useState, ChangeEvent } from 'react';
import { FileUploader } from '@/components/FileUploader';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { FileData } from '@/types';

export function AIAssistant() {
  const { currentFile, addToHistory, setCurrentFile, fileHistory } = useStore();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);

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
    setLoading(true);
    setResponse('');
    setSuggestions([]);
    try {
      const dataSample = currentFile.data.slice(0, 100);
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input, data: dataSample }),
      });
      const { result } = await res.json();
      setResponse(result);
      
      // Extract suggestions from response
      const extractedSuggestions = result
        .split('\n')
        .filter((line: string) => line.toLowerCase().includes('chart') || line.toLowerCase().includes('visualization'))
        .map((line: string) => line.trim());
      setSuggestions(extractedSuggestions);
    } catch (e) {
      console.error('Error contacting AI:', e);
      setResponse('Error contacting AI. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* File Upload Section */}
      <div className="glass-card p-6 rounded-xl border border-white/10">
        <h2 className="text-xl font-semibold mb-4">Upload Your Data</h2>
        <FileUploader onFileUpload={handleFileUpload} />
        
        {fileHistory.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-medium mb-2">Recent Files</h3>
            <div className="flex flex-wrap gap-2">
              {fileHistory.map((file: FileData) => (
                <Button 
                  key={file.timestamp} 
                  size="sm" 
                  variant={currentFile?.timestamp === file.timestamp ? 'default' : 'outline'} 
                  onClick={() => setCurrentFile(file)}
                  className="transition-all hover:scale-105"
                >
                  {file.name}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* AI Interaction Section */}
      <div className="glass-card p-6 rounded-xl border border-white/10">
        <h2 className="text-xl font-semibold mb-4">Ask AI</h2>
        <div className="space-y-4">
          <textarea
            className="w-full rounded-lg border border-input bg-background/50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary min-h-[120px] resize-none"
            placeholder="What would you like the AI to analyze?"
            value={input}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value)}
            disabled={loading || !currentFile}
          />
          <Button 
            onClick={handleAskAI} 
            disabled={loading || !input.trim() || !currentFile} 
            className="w-full transition-all hover:scale-[1.02]"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin">⚡</span>
                AI is thinking...
              </span>
            ) : 'Ask AI'}
          </Button>
        </div>
      </div>

      {/* Response Section */}
      <div className="glass-card p-6 rounded-xl border border-white/10">
        <h2 className="text-xl font-semibold mb-4">AI Response</h2>
        {loading && (
          <div className="flex items-center justify-center py-8">
            <span className="animate-pulse text-muted-foreground">AI is analyzing your data...</span>
          </div>
        )}
        {!loading && !response && (
          <div className="text-center py-8 text-muted-foreground">
            {currentFile ? 'Ask a question about your data.' : 'Upload a file and ask a question to get started.'}
          </div>
        )}
        {!loading && response && (
          <div className="space-y-6">
            <div className="prose prose-invert max-w-none">
              {response.split(/\n\n|\n- /).map((block: string, i: number) => (
                <div key={i} className="mb-4 last:mb-0">
                  {block.trim()}
                </div>
              ))}
            </div>
            
            {suggestions.length > 0 && (
              <div className="mt-6 pt-6 border-t border-white/10">
                <h3 className="text-sm font-medium mb-3">Suggested Visualizations</h3>
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((suggestion: string, i: number) => (
                    <Button
                      key={i}
                      size="sm"
                      variant="outline"
                      className="transition-all hover:scale-105 hover:bg-primary/10"
                      onClick={() => {
                        console.log('Build chart:', suggestion);
                      }}
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 