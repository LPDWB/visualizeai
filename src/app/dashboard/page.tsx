'use client';

import { useStore } from '@/store/useStore';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function DashboardPage() {
  const { currentFile } = useStore();

  if (!currentFile) {
    return (
      <div className="container mx-auto p-8">
        <h1 className="mb-8 text-4xl font-bold tracking-tight">Dashboard</h1>
        <Card>
          <CardHeader>
            <CardTitle>No Data Available</CardTitle>
            <CardDescription>
              Upload a file to see your data preview
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="mb-8 text-4xl font-bold tracking-tight">Dashboard</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Data Preview</CardTitle>
          <CardDescription>
            {currentFile.name} - {currentFile.data.length} rows
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px] w-full rounded-md border">
            <div className="p-4">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    {currentFile.columns.map((column) => (
                      <th
                        key={column}
                        className="px-4 py-2 text-left font-medium text-muted-foreground"
                      >
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {currentFile.data.slice(0, 100).map((row, i) => (
                    <tr key={i} className="border-b hover:bg-muted/50">
                      {currentFile.columns.map((column) => (
                        <td
                          key={column}
                          className="px-4 py-2 text-sm"
                        >
                          {row[column]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
} 