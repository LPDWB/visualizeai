"use client";

import { AIAssistant } from '@/components/AIAssistant';
import { motion } from 'framer-motion';

export default function AIPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-b from-background to-background/80"
    >
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <motion.h1
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent"
          >
            AI Data Assistant
          </motion.h1>
          <motion.p
            initial={{ y: -10 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-2 text-muted-foreground"
          >
            Upload your data and chat with AI to get insights and visualizations
          </motion.p>
        </div>

        <motion.div
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-background/50 backdrop-blur border rounded-lg shadow-lg p-6"
        >
          <AIAssistant />
        </motion.div>
      </div>
    </motion.div>
  );
}