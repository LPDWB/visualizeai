'use client';

import {
  ScatterChart,
  Scatter,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { ChartConfig, ChartChannel } from '@/lib/charts/types';
import { useMemo } from 'react';
import { ReactElement } from 'react';

const COLORS = [
  '#8884d8',
  '#82ca9d',
  '#ffc658',
  '#ff8042',
  '#0088fe',
  '#00c49f',
  '#ffbb28',
  '#ff8042'
];

interface ChartRendererProps {
  config: ChartConfig;
}

export function ChartRenderer({ config }: ChartRendererProps) {
  const { template, encoding, data, width = 800, height = 400, margin = { top: 20, right: 30, left: 20, bottom: 5 } } = config;

  const processedData = useMemo(() => {
    if (!template.postProcess) return data.rows;
    return template.postProcess(data.rows, encoding);
  }, [data, encoding, template]);

  const getFieldName = (channel: ChartChannel | undefined) => {
    if (!channel) return '';
    return channel.field;
  };

  const renderChart = (): ReactElement => {
    switch (template.type) {
      case 'scatter':
        return (
          <ScatterChart width={width} height={height} margin={margin}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={getFieldName(encoding.x)} type="number" />
            <YAxis dataKey={getFieldName(encoding.y)} type="number" />
            <Tooltip />
            <Legend />
            <Scatter
              data={processedData}
              fill={COLORS[0]}
              name={getFieldName(encoding.x)}
            />
          </ScatterChart>
        );

      case 'bar':
        return (
          <BarChart width={width} height={height} margin={margin} data={processedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={getFieldName(encoding.x)} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey={getFieldName(encoding.y)} fill={COLORS[0]} name={getFieldName(encoding.y)} />
          </BarChart>
        );

      case 'line':
        return (
          <LineChart width={width} height={height} margin={margin} data={processedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={getFieldName(encoding.x)} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey={getFieldName(encoding.y)}
              stroke={COLORS[0]}
              name={getFieldName(encoding.y)}
            />
          </LineChart>
        );

      case 'pie':
        return (
          <PieChart width={width} height={height} margin={margin}>
            <Pie
              data={processedData}
              dataKey={getFieldName(encoding.y)}
              nameKey={getFieldName(encoding.x)}
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill={COLORS[0]}
              label
            >
              {processedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        );

      case 'area':
        return (
          <AreaChart width={width} height={height} margin={margin} data={processedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={getFieldName(encoding.x)} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area
              type="monotone"
              dataKey={getFieldName(encoding.y)}
              stroke={COLORS[0]}
              fill={COLORS[0]}
              fillOpacity={0.3}
              name={getFieldName(encoding.y)}
            />
          </AreaChart>
        );

      default:
        return (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">Unsupported chart type</p>
          </div>
        );
    }
  };

  return (
    <div className="w-full h-full min-h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
} 