'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { UploadCloud } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MainUploadSectionProps {
  onFileAccepted: (file: File) => void;
}

export default function MainUploadSection({ onFileAccepted }: MainUploadSectionProps) {
  const [isDragging, setIsDragging] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file && (file.name.endsWith('.csv') || file.name.endsWith('.xlsx'))) {
      onFileAccepted(file);
    }
  }, [onFileAccepted]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    },
    maxFiles: 1,
    onDragEnter: () => setIsDragging(true),
    onDragLeave: () => setIsDragging(false)
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex min-h-[60vh] items-center justify-center px-4"
    >
      <div
        {...getRootProps()}
        className={cn(
          "w-full max-w-2xl rounded-xl border-2 border-dashed p-12 text-center transition-all duration-200",
          "hover:border-primary/50 hover:bg-primary/5",
          "dark:border-gray-700 dark:hover:border-primary/50 dark:hover:bg-primary/5",
          isDragActive && "border-primary bg-primary/5 dark:border-primary dark:bg-primary/5",
          "cursor-pointer"
        )}
      >
        <input {...getInputProps()} />
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center justify-center space-y-4"
        >
          <motion.div
            animate={{ y: isDragging ? -5 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <UploadCloud
              className={cn(
                "h-12 w-12 text-gray-400 transition-colors duration-200",
                "dark:text-gray-500",
                isDragActive && "text-primary dark:text-primary"
              )}
            />
          </motion.div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Перетащи файл или нажми для выбора
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Поддерживаются файлы .csv и .xlsx
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
} 