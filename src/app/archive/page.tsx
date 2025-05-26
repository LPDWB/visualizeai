'use client';

import { useStore } from '@/store/useStore';
import { FileData } from '@/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

export default function ArchivePage() {
  const { fileHistory, setCurrentFile } = useStore();

  const handleFileSelect = (file: FileData) => {
    setCurrentFile(file);
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="mb-8 text-4xl font-bold tracking-tight">Archive</h1>
      
      <div className="grid gap-6">
        {fileHistory.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>No Files Found</CardTitle>
              <CardDescription>
                Upload some files to see them here
              </CardDescription>
            </CardHeader>
          </Card>
        ) : (
          fileHistory.map((file: FileData) => (
            <Card key={file.name}>
              <CardHeader>
                <CardTitle>{file.name}</CardTitle>
                <CardDescription>
                  {file.data.length} rows • {file.columns.length} columns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Last modified: {format(file.timestamp, 'PPp')}
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => handleFileSelect(file)}
                  >
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
} 