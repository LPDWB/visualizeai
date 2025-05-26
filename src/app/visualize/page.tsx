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
import { Skeleton } from '@/components/ui/skeleton';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function VisualizePage() {
  const { currentFile } = useStore();
  const [chartType, setChartType] = useState<'bar' | 'line' | 'pie'>('bar');
  const [xAxis, setXAxis] = useState<string>('');
  const [yAxis, setYAxis] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleChartConfigChange = (setter: (v: any) => void) => (value: any) => {
    setLoading(true);
    setter(value);
    setTimeout(() => setLoading(false), 500); // имитация загрузки
  };

  const renderChart = () => {
    if (!currentFile) return null;
    if (!xAxis || !yAxis) {
      return (
        <div className="h-[400px] flex items-center justify-center text-muted-foreground text-center">
          <span>Выберите тип графика и колонки для предпросмотра</span>
        </div>
      );
    }
    if (loading) {
      return <Skeleton className="h-[400px] w-full" />;
    }
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
      <div className="container mx-auto p-4 md:p-8 flex flex-col items-center justify-center min-h-[70vh]">
        <h1 className="mb-8 text-4xl font-bold tracking-tight text-center">Visualize</h1>
        <Card className="w-full max-w-xl shadow-xl rounded-2xl backdrop-blur-md bg-background/60 border border-white/10">
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
    <div className="container mx-auto p-4 md:p-8 flex flex-col gap-8">
      <h1 className="mb-8 text-4xl font-bold tracking-tight text-center">Visualize</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="shadow-xl rounded-2xl backdrop-blur-md bg-background/60 border border-white/10">
          <CardHeader>
            <CardTitle>Chart Configuration</CardTitle>
            <CardDescription>
              Configure your visualization settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-1">
              <Select
                value={chartType}
                onValueChange={handleChartConfigChange(setChartType)}
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

              <Select value={xAxis} onValueChange={handleChartConfigChange(setXAxis)}>
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

              <Select value={yAxis} onValueChange={handleChartConfigChange(setYAxis)}>
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

        <Card className="shadow-xl rounded-2xl border border-white/10">
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
              className="min-h-[400px] flex items-center justify-center"
            >
              {renderChart()}
            </motion.div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}