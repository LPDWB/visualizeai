'use client';

import { useState } from 'react';
import { useDataStore } from '@/store/dataStore';
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

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

type ChartType = 'line' | 'bar' | 'pie';

export default function VisualizePage() {
  const fileData = useDataStore((state) => state.fileData);
  const [chartType, setChartType] = useState<ChartType>('line');
  const [xAxis, setXAxis] = useState<string>('');
  const [yAxis, setYAxis] = useState<string>('');

  if (!fileData) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Visualize</h1>
        <div className="bg-yellow-50 dark:bg-yellow-900/30 p-4 rounded-lg">
          <p className="text-yellow-800 dark:text-yellow-200">
            No data available. Please upload a file on the{' '}
            <a href="/upload" className="underline hover:text-yellow-600 dark:hover:text-yellow-300">
              upload page
            </a>
            .
          </p>
        </div>
      </div>
    );
  }

  const chartData = fileData.rows.map((row) => {
    const xIndex = fileData.headers.indexOf(xAxis);
    const yIndex = fileData.headers.indexOf(yAxis);
    return {
      name: row[xIndex]?.toString() || '',
      value: Number(row[yIndex]) || 0,
    };
  });

  const renderChart = () => {
    switch (chartType) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        );
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        );
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={400}>
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
                {chartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Visualize</h1>
      
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="chart-type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Chart Type
            </label>
            <select
              id="chart-type"
              value={chartType}
              onChange={(e) => setChartType(e.target.value as ChartType)}
              className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="line">Line Chart</option>
              <option value="bar">Bar Chart</option>
              <option value="pie">Pie Chart</option>
            </select>
          </div>

          <div>
            <label htmlFor="x-axis" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              X-Axis
            </label>
            <select
              id="x-axis"
              value={xAxis}
              onChange={(e) => setXAxis(e.target.value)}
              className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">Select X-Axis</option>
              {fileData.headers.map((header) => (
                <option key={header} value={header}>
                  {header}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="y-axis" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Y-Axis
            </label>
            <select
              id="y-axis"
              value={yAxis}
              onChange={(e) => setYAxis(e.target.value)}
              className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">Select Y-Axis</option>
              {fileData.headers.map((header) => (
                <option key={header} value={header}>
                  {header}
                </option>
              ))}
            </select>
          </div>
        </div>

        {xAxis && yAxis ? (
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            {renderChart()}
          </div>
        ) : (
          <div className="bg-yellow-50 dark:bg-yellow-900/30 p-4 rounded-lg">
            <p className="text-yellow-800 dark:text-yellow-200">
              Please select both X and Y axes to display the chart.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}