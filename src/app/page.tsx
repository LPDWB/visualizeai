'use client';

import { useState } from 'react';
import { FileUploader } from '@/components/FileUploader';
import { GlowCursor } from '@/components/GlowCursor';
import { useStore } from '@/store/useStore';
import { parseFile } from '@/utils/fileParser';
import { toast } from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export default function Home() {
  const { currentFile, setCurrentFile, addToHistory } = useStore();
  const [chartType, setChartType] = useState<'bar' | 'line' | 'pie'>('bar');
  const [xAxis, setXAxis] = useState<string>('');
  const [yAxis, setYAxis] = useState<string>('');

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

  const renderChart = () => {
    if (!currentFile || !xAxis || !yAxis) return null;

    const chartData = currentFile.data.map((row) => ({
      [xAxis]: row[xAxis],
      [yAxis]: Number(row[yAxis]),
    }));

    switch (chartType) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={xAxis} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey={yAxis} fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        );
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={xAxis} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey={yAxis} stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        );
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey={yAxis}
                nameKey={xAxis}
                cx="50%"
                cy="50%"
                outerRadius={150}
                fill="#8884d8"
                label
              />
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <main className="min-h-screen bg-background p-8">
      <GlowCursor />
      <Toaster position="top-right" />
      
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight">VisualizeAI</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Upload your data and create beautiful visualizations
          </p>
        </div>

        {!currentFile ? (
          <Card className="mx-auto max-w-2xl">
            <CardHeader>
              <CardTitle>Upload Your Data</CardTitle>
              <CardDescription>
                Drag and drop your Excel or CSV file to get started
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FileUploader onFileUpload={handleFileUpload} />
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Visualization Settings</CardTitle>
                <CardDescription>
                  Configure your chart type and axes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <Select
                    value={chartType}
                    onValueChange={(value: 'bar' | 'line' | 'pie') =>
                      setChartType(value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select chart type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bar">Bar Chart</SelectItem>
                      <SelectItem value="line">Line Chart</SelectItem>
                      <SelectItem value="pie">Pie Chart</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select
                    value={xAxis}
                    onValueChange={setXAxis}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select X axis" />
                    </SelectTrigger>
                    <SelectContent>
                      {currentFile.columns.map((column) => (
                        <SelectItem key={column} value={column}>
                          {column}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={yAxis}
                    onValueChange={setYAxis}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Y axis" />
                    </SelectTrigger>
                    <SelectContent>
                      {currentFile.columns.map((column) => (
                        <SelectItem key={column} value={column}>
                          {column}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Visualization</CardTitle>
                <CardDescription>
                  {currentFile.name} - {currentFile.data.length} rows
                </CardDescription>
              </CardHeader>
              <CardContent>{renderChart()}</CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Data Preview</CardTitle>
                <CardDescription>First 100 rows of your data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="max-h-[400px] overflow-auto">
                  <table className="w-full">
                    <thead>
                      <tr>
                        {currentFile.columns.map((column) => (
                          <th
                            key={column}
                            className="border-b px-4 py-2 text-left font-medium"
                          >
                            {column}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {currentFile.data.map((row, i) => (
                        <tr key={i}>
                          {currentFile.columns.map((column) => (
                            <td
                              key={column}
                              className="border-b px-4 py-2 text-sm"
                            >
                              {row[column]}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </main>
  );
}
