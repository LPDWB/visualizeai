"use client";
import { useState } from 'react';
import { FileUploader } from '@/components/FileUploader';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export function AIAssistant() {
  const { currentFile, addToHistory, setCurrentFile, fileHistory } = useStore();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');

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
    try {
      const dataSample = currentFile.data.slice(0, 100);
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input, data: dataSample }),
      });
      const { result } = await res.json();
      setResponse(result);
    } catch (e) {
      setResponse('Error contacting AI.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl glass-card rounded-2xl shadow-xl border border-white/10 backdrop-blur-md bg-background/60 flex flex-col gap-6 p-6">
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Ask AI to analyze your data</h1>
        <p className="text-muted-foreground mb-4">Upload an Excel or CSV file and get suggestions for how to visualize it.</p>
      </div>
      <div className="mb-2">
        <FileUploader onFileUpload={handleFileUpload} />
        {fileHistory.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {fileHistory.map((file) => (
              <Button key={file.timestamp} size="sm" variant={currentFile?.timestamp === file.timestamp ? 'default' : 'outline'} onClick={() => setCurrentFile(file)}>
                {file.name}
              </Button>
            ))}
          </div>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <input
          className="rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="What would you like to know?"
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={loading || !currentFile}
        />
        <Button onClick={handleAskAI} disabled={loading || !input.trim() || !currentFile} className="w-full">
          {loading ? 'Asking AI…' : 'Ask AI'}
        </Button>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: response ? 1 : 0.5, y: 0 }}
        transition={{ duration: 0.3 }}
        className="min-h-[120px] bg-muted/40 rounded-xl p-4 mt-2 border border-white/10 shadow-inner"
      >
        {loading && <span className="animate-pulse text-muted-foreground">AI is thinking…</span>}
        {!loading && !response && <span className="text-muted-foreground">AI suggestions and summaries will appear here.</span>}
        {!loading && response && (
          <div className="space-y-4">
            {response.split(/\n\n|\n- /).map((block, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="flex-1 whitespace-pre-line">{block.trim()}</span>
                {/* Placeholder for "Build this chart" button if block looks like a chart suggestion */}
                {block.toLowerCase().includes('chart') && (
                  <Button size="sm" variant="outline" className="ml-2 opacity-80 cursor-pointer">Build this chart</Button>
                )}
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
} 