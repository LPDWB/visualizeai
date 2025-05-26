'use client';

import { useState, useRef } from 'react';
import { useDataStore } from '@/store/useDataStore';
import { toPng, toSvg } from 'html-to-image';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'] as const;

type ChartType = 'bar' | 'line' | 'pie';
type ChartDataPoint = {
  name: string;
  value: number;
};

interface ParsedDataRow {
  [key: string]: string | number;
}

export default function ChartEditor() {
  const { parsedData } = useDataStore();
  const chartRef = useRef<HTMLDivElement>(null);
  const [chartType, setChartType] = useState<ChartType>('bar');
  const [xAxis, setXAxis] = useState<string>('');
  const [yAxis, setYAxis] = useState<string>('');
  const [isExporting, setIsExporting] = useState(false);

  // Get unique column names from parsed data
  const columns = parsedData.length > 0 ? Object.keys(parsedData[0]) : [];

  // Transform data for chart
  const chartData: ChartDataPoint[] = parsedData.map((row: ParsedDataRow) => ({
    name: row[xAxis]?.toString() || '',
    value: Number(row[yAxis]) || 0,
  }));

  const handleExport = async (format: 'png' | 'svg') => {
    if (!chartRef.current) return;

    setIsExporting(true);
    try {
      const element = chartRef.current.querySelector('.recharts-wrapper');
      if (!element) throw new Error('Could not find chart element');

      const dataUrl = format === 'png'
        ? await toPng(element as HTMLElement, { quality: 1.0 })
        : await toSvg(element as HTMLElement);

      const link = document.createElement('a');
      link.download = `chart-${new Date().toISOString()}.${format}`;
      link.href = dataUrl;
      link.click();

      toast.success(`Chart exported as ${format.toUpperCase()}`);
    } catch (error) {
      toast.error('Failed to export chart');
      console.error('Export error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const renderChart = () => {
    if (!xAxis || !yAxis) {
      return (
        <div className="h-[400px] flex items-center justify-center text-muted-foreground">
          Please select both X and Y axes to display the chart
        </div>
      );
    }

    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={chartType}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="h-[400px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <>
              {chartType === 'line' && (
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="value" stroke="#8884d8" />
                </LineChart>
              )}
              {chartType === 'bar' && (
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              )}
              {chartType === 'pie' && (
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={150}
                    label
                  >
                    {chartData.map((_, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              )}
            </>
          </ResponsiveContainer>
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <Card className="p-6">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Chart Type</Label>
              <Select value={chartType} onValueChange={(value: ChartType) => setChartType(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select chart type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bar">Bar Chart</SelectItem>
                  <SelectItem value="line">Line Chart</SelectItem>
                  <SelectItem value="pie">Pie Chart</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>X-Axis</Label>
              <Select value={xAxis} onValueChange={setXAxis}>
                <SelectTrigger>
                  <SelectValue placeholder="Select X-axis" />
                </SelectTrigger>
                <SelectContent>
                  {columns.map((column: string) => (
                    <SelectItem key={column} value={column}>
                      {column}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Y-Axis</Label>
              <Select value={yAxis} onValueChange={setYAxis}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Y-axis" />
                </SelectTrigger>
                <SelectContent>
                  {columns.map((column: string) => (
                    <SelectItem key={column} value={column}>
                      {column}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div ref={chartRef} className="bg-card rounded-lg border p-4">
            {renderChart()}
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => handleExport('png')}
              disabled={isExporting || !xAxis || !yAxis}
            >
              Export as PNG
            </Button>
            <Button
              variant="outline"
              onClick={() => handleExport('svg')}
              disabled={isExporting || !xAxis || !yAxis}
            >
              Export as SVG
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
} 