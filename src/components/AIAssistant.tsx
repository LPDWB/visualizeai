"use client";
import { useState, ChangeEvent } from 'react';
import { FileUploader } from '@/components/FileUploader';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { FileData } from '@/types/file';

export function AIAssistant() {
  const { currentFile, addToHistory, setCurrentFile, fileHistory } = useStore();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const handleFileUpload = async (file: File) => {
    // Reuse existing logic for parsing and storing file
    if (!file) return;
    const { parseFile } = await import('@/utils/fileParser');
    try {
      const { data, columns } = await parseFile(file);
      const fileData = {
        name: file.name,
        data,
        columns,
        timestamp: Date.now(),
      };
      setCurrentFile(fileData);
      addToHistory(fileData);
    } catch (e) {
      // handle error
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
      setResponse('Error contacting AI.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl glass-card rounded-2xl shadow-xl border border-white/10 backdrop-blur-md bg-background/60 flex flex-col gap-6 p-6">
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
          AI Data Assistant
        </h1>
        <p className="text-muted-foreground mb-4">Upload your data and let AI help you understand it better.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="glass-card p-4 rounded-xl border border-white/10">
            <h2 className="text-lg font-semibold mb-3">Upload Data</h2>
            <FileUploader onFileUpload={handleFileUpload} />
            {fileHistory.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
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
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="glass-card p-4 rounded-xl border border-white/10">
            <h2 className="text-lg font-semibold mb-3">Ask AI</h2>
            <div className="flex flex-col gap-3">
              <textarea
                className="rounded-lg border border-input bg-background/50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary min-h-[100px] resize-none"
                placeholder="What would you like to know about your data?"
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
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: response ? 1 : 0.5, y: 0 }}
        transition={{ duration: 0.3 }}
        className="glass-card rounded-xl p-6 mt-4 border border-white/10"
      >
        <h2 className="text-lg font-semibold mb-4">AI Response</h2>
        {loading && (
          <div className="flex items-center justify-center py-8">
            <span className="animate-pulse text-muted-foreground">AI is analyzing your data...</span>
          </div>
        )}
        {!loading && !response && (
          <div className="text-center py-8 text-muted-foreground">
            Upload a file and ask a question to get started.
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
                        // TODO: Implement chart building from suggestion
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
      </motion.div>
    </div>
  );
} 