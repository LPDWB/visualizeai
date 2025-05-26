'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FileUploader } from '@/components/FileUploader';
import { GlowCursor } from '@/components/GlowCursor';
import { useStore } from '@/store/useStore';
import { parseFile } from '@/utils/fileParser';
import { toast } from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Upload } from 'lucide-react';

export default function Home() {
  const { setCurrentFile, addToHistory } = useStore();

  const handleFileUpload = async (file: File) => {
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
      toast.success('File uploaded successfully!');
    } catch (error) {
      toast.error('Error parsing file');
      console.error(error);
    }
  };

  return (
    <main className="min-h-screen bg-background relative">
      <GlowCursor />
      <Toaster position="top-right" />
      
      <div className="container mx-auto px-4 py-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-6 mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
            VisualizeAI
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Upload your data. See it come to life.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-2xl mx-auto"
        >
          <Card className="backdrop-blur-sm bg-background/30 border-white/10">
            <CardHeader>
              <CardTitle>Get Started</CardTitle>
              <CardDescription>
                Upload your Excel or CSV file to begin visualizing your data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FileUploader onFileUpload={handleFileUpload} />
              
              <div className="flex justify-center">
                <Link href="/visualize">
                  <Button size="lg" className="group">
                    Go to Visualizations
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </main>
  );
}
