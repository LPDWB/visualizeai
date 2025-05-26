'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface FileUploaderProps {
  onFileUpload: (file: File) => void;
}

export const FileUploader = ({ onFileUpload }: FileUploaderProps) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      const validTypes = [
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/csv',
      ];

      if (!validTypes.includes(file.type)) {
        toast.error('Please upload a valid Excel or CSV file');
        return;
      }

      onFileUpload(file);
    },
    [onFileUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'text/csv': ['.csv'],
    },
    maxFiles: 1,
  });

  return (
    <div
      {...getRootProps()}
      className={`relative flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors ${
        isDragActive
          ? 'border-primary bg-primary/10'
          : 'border-muted-foreground/25 hover:border-primary/50'
      }`}
    >
      <input {...getInputProps()} />
      <Upload className="mb-4 h-12 w-12 text-muted-foreground/50" />
      <p className="text-center text-lg font-medium text-muted-foreground">
        {isDragActive
          ? 'Drop your file here'
          : 'Drag and drop your Excel or CSV file here'}
      </p>
      <p className="mt-2 text-sm text-muted-foreground/75">
        or click to select a file
      </p>
    </div>
  );
}; 