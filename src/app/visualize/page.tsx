'use client';

import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { DataRow } from '@/types';
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
  Cell,
} from 'recharts';
import { motion } from 'framer-motion';
import { ChartRenderer } from '@/components/ChartRenderer';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function VisualizePage() {
  const { currentFile } = useStore();
  const [chartType, setChartType] = useState<'bar' | 'line' | 'pie'>('bar');
  const [xAxis, setXAxis] = useState<string>('');
  const [yAxis, setYAxis] = useState<string>('');

  const renderChart = () => {
    if (!currentFile || !xAxis || !yAxis) return null;
    const chartData = currentFile.data.map((row: DataRow) => ({
      [xAxis]: row[xAxis],
      [yAxis]: Number(row[yAxis]),
    }));
    return (
      <ChartRenderer
        chartType={chartType}
        data={chartData}
        xAxis={xAxis}
        yAxis={yAxis}
        columns={currentFile.columns}
      />
    );
  };

  if (!currentFile) {
    return (
      <div className="container mx-auto p-8">
        <h1 className="mb-8 text-4xl font-bold tracking-tight">Visualize</h1>
        <Card>
          <CardHeader>
            <CardTitle>No Data Selected</CardTitle>
            <CardDescription>
              Please upload a file first to start visualizing your data
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="mb-8 text-4xl font-bold tracking-tight">Visualize</h1>
      
      <div className="grid gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Chart Configuration</CardTitle>
            <CardDescription>
              Configure your visualization settings
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

              <Select value={xAxis} onValueChange={setXAxis}>
                <SelectTrigger>
                  <SelectValue placeholder="Select X axis" />
                </SelectTrigger>
                <SelectContent>
                  {currentFile.columns.map((column: string) => (
                    <SelectItem key={column} value={column}>
                      {column}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={yAxis} onValueChange={setYAxis}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Y axis" />
                </SelectTrigger>
                <SelectContent>
                  {currentFile.columns.map((column: string) => (
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
            <CardTitle>Preview</CardTitle>
            <CardDescription>
              {currentFile.name} - {currentFile.data.length} rows
            </CardDescription>
          </CardHeader>
          <CardContent>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {renderChart()}
            </motion.div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}