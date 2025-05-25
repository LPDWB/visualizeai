'use client';

import { motion } from 'framer-motion';
import MainUploadSection from '@/components/MainUploadSection';

export default function Home() {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex min-h-screen items-center justify-center bg-background p-4"
    >
      <div className="w-full max-w-[600px]">
        <MainUploadSection onFileAccepted={(file) => {
          console.log('File accepted:', file);
          // Handle file upload here
        }} />
      </div>
    </motion.main>
  );
}
