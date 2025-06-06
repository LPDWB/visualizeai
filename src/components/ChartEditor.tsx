'use client';

import { useState, useRef, useEffect } from 'react';
import { useDataStore } from '@/store/useDataStore';
import { toPng, toSvg } from 'html-to-image';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
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
  ResponsiveContainer,
} from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ChevronDown, ChevronUp, Download, Save, Filter, Loader2 } from 'lucide-react';
import { GlowingBackground } from '@/components/ui/glowing-background';
import { ChartLegend } from '@/components/ui/chart-legend';
import { useChartDataTransform, ChartType, ChartDataPoint } from '@/hooks/useChartDataTransform';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'] as const;

interface ParsedDataRow {
  [key: string]: string | number;
}

interface DataSummary {
  min: number;
  max: number;
  avg: number;
  count: number;
}

// Animation variants
const chartVariants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { 
    opacity: 1, 
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
      duration: 0.5
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.95,
    transition: {
      duration: 0.2
    }
  }
};

const tooltipVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.2,
      ease: "easeOut"
    }
  },
  exit: { 
    opacity: 0, 
    y: 10,
    transition: {
      duration: 0.15
    }
  }
};

interface ChartEditorProps {
  data: {
    headers: string[];
    rows: Array<Record<string, any>>;
  };
}

export default function ChartEditor({ data }: ChartEditorProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const [chartType, setChartType] = useState<ChartType>('bar');
  const [xAxis, setXAxis] = useState<string>('');
  const [yAxis, setYAxis] = useState<string>('');
  const [isExporting, setIsExporting] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [topN, setTopN] = useState<number>(0);
  const controls = useAnimation();

  // Get unique column names from data
  const columns = data.headers;

  // Transform data for chart
  const rawChartData: ChartDataPoint[] = data.rows
    .map((row) => ({
      name: row[xAxis]?.toString() || '',
      value: Number(row[yAxis]) || 0,
    }));

  // Use our custom hook for data transformation
  const { transformedData, shouldSwitchToBar } = useChartDataTransform({
    data: rawChartData,
    chartType,
    topN
  });

  // Switch to bar chart if needed
  useEffect(() => {
    if (shouldSwitchToBar) {
      setChartType('bar');
    }
  }, [shouldSwitchToBar]);

  // Calculate data summary
  const dataSummary: DataSummary = transformedData.reduce(
    (acc, point) => ({
      min: Math.min(acc.min, point.value),
      max: Math.max(acc.max, point.value),
      avg: acc.avg + point.value,
      count: acc.count + 1,
    }),
    { min: Infinity, max: -Infinity, avg: 0, count: 0 }
  );
  dataSummary.avg = dataSummary.avg / dataSummary.count;

  useEffect(() => {
    controls.start("animate");
  }, [chartType, controls]);

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

    const chartHeight = Math.max(400, Math.min(800, transformedData.length * 40));

    return (
      <div className="grid grid-cols-1 lg:grid-cols-[1fr,300px] gap-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={chartType}
            variants={chartVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="relative"
            style={{ height: chartHeight }}
            ref={chartRef}
          >
            <GlowingBackground className="opacity-30" />
            <ResponsiveContainer width="100%" height="100%">
              <>
                {chartType === 'line' && (
                  <LineChart data={transformedData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name"
                      angle={-45}
                      textAnchor="end"
                      height={70}
                      interval={0}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis />
                    <Tooltip 
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <motion.div
                              variants={tooltipVariants}
                              initial="initial"
                              animate="animate"
                              exit="exit"
                              className="bg-background/80 backdrop-blur-sm p-2 rounded-lg border border-border shadow-lg"
                            >
                              <p className="font-medium">{label}</p>
                              <p className="text-primary">{payload[0].value}</p>
                            </motion.div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="var(--primary)"
                      strokeWidth={2}
                      dot={{ r: 4, fill: "var(--primary)" }}
                      activeDot={{ r: 6, fill: "var(--primary)" }}
                      animationDuration={1000}
                      animationBegin={0}
                    />
                  </LineChart>
                )}
                {chartType === 'bar' && (
                  <BarChart data={transformedData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name"
                      angle={-45}
                      textAnchor="end"
                      height={70}
                      interval={0}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis />
                    <Tooltip 
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <motion.div
                              variants={tooltipVariants}
                              initial="initial"
                              animate="animate"
                              exit="exit"
                              className="bg-background/80 backdrop-blur-sm p-2 rounded-lg border border-border shadow-lg"
                            >
                              <p className="font-medium">{label}</p>
                              <p className="text-primary">{payload[0].value}</p>
                            </motion.div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar 
                      dataKey="value" 
                      fill="var(--primary)"
                      animationDuration={1000}
                      animationBegin={0}
                    >
                      {transformedData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                )}
                {chartType === 'pie' && (
                  <PieChart>
                    <Pie
                      data={transformedData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={Math.min(chartHeight * 0.4, 200)}
                      label={({ name, percent }) => 
                        `${name} (${(percent * 100).toFixed(0)}%)`
                      }
                      animationDuration={1000}
                      animationBegin={0}
                    >
                      {transformedData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <motion.div
                              variants={tooltipVariants}
                              initial="initial"
                              animate="animate"
                              exit="exit"
                              className="bg-background/80 backdrop-blur-sm p-2 rounded-lg border border-border shadow-lg"
                            >
                              <p className="font-medium">{label}</p>
                              <p className="text-primary">{payload[0].value}</p>
                            </motion.div>
                          );
                        }
                        return null;
                      }}
                    />
                  </PieChart>
                )}
              </>
            </ResponsiveContainer>
          </motion.div>
        </AnimatePresence>

        {/* Enhanced Legend */}
        <ChartLegend
          data={transformedData.map((item, index) => ({
            name: item.name,
            value: item.value,
            color: COLORS[index % COLORS.length]
          }))}
          className="lg:sticky lg:top-4"
        />
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 space-y-8">
      {/* Page Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Визуализация данных</h1>
        <p className="text-muted-foreground">
          Визуализируйте ваши данные. Выберите тип графика, оси и начните анализ.
        </p>
      </div>

      {/* Control Panel */}
      <Card className="p-6 backdrop-blur-sm bg-background/50">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Тип графика</Label>
              <Select value={chartType} onValueChange={(value: ChartType) => setChartType(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите тип графика" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bar">Столбчатый график</SelectItem>
                  <SelectItem value="line">Линейный график</SelectItem>
                  <SelectItem value="pie">Круговая диаграмма</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Ось X</Label>
              <Select value={xAxis} onValueChange={setXAxis}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите ось X" />
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
              <Label>Ось Y</Label>
              <Select value={yAxis} onValueChange={setYAxis}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите ось Y" />
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

          {/* Filters Toggle */}
          <Button
            variant="ghost"
            className="w-full flex items-center justify-between"
            onClick={() => setShowFilters(!showFilters)}
          >
            <span className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Фильтры
            </span>
            {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>

          {/* Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                  <div className="space-y-2">
                    <Label>Показать топ N значений</Label>
                    <Select
                      value={topN.toString()}
                      onValueChange={(value: string) => setTopN(Number(value))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите количество" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Все значения</SelectItem>
                        <SelectItem value="5">Топ 5</SelectItem>
                        <SelectItem value="10">Топ 10</SelectItem>
                        <SelectItem value="20">Топ 20</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Card>

      {/* Chart Title */}
      {xAxis && yAxis && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h2 className="text-xl font-semibold">
            {chartType === 'bar' && 'Столбчатый график: '}
            {chartType === 'line' && 'Линейный график: '}
            {chartType === 'pie' && 'Круговая диаграмма: '}
            {yAxis} по {xAxis}
          </h2>
        </motion.div>
      )}

      {/* Chart Area */}
      <Card className="p-6 backdrop-blur-sm bg-background/50">
        {isLoading ? (
          <div className="h-[400px] flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          renderChart()
        )}
      </Card>

      {/* Data Summary */}
      {transformedData.length > 0 && (
        <Card className="p-6 backdrop-blur-sm bg-background/50">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Минимум</p>
              <p className="text-lg font-semibold">{dataSummary.min.toFixed(2)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Максимум</p>
              <p className="text-lg font-semibold">{dataSummary.max.toFixed(2)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Среднее</p>
              <p className="text-lg font-semibold">{dataSummary.avg.toFixed(2)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Количество</p>
              <p className="text-lg font-semibold">{dataSummary.count}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          onClick={() => handleExport('png')}
          disabled={isExporting || !xAxis || !yAxis}
          className="gap-2"
        >
          <Download className="w-4 h-4" />
          PNG
        </Button>
        <Button
          variant="outline"
          onClick={() => handleExport('svg')}
          disabled={isExporting || !xAxis || !yAxis}
          className="gap-2"
        >
          <Download className="w-4 h-4" />
          SVG
        </Button>
        <Button
          variant="outline"
          disabled={!xAxis || !yAxis}
          className="gap-2"
        >
          <Save className="w-4 h-4" />
          Сохранить
        </Button>
      </div>
    </div>
  );
} 