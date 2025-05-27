import { ChartTemplate, ChartEncoding } from './types';
import { Type } from '../data/types';

const defaultEncoding: ChartEncoding = {
  x: { field: '', type: Type.String },
  y: { field: '', type: Type.Number },
  tooltip: []
};

export const chartTemplates: ChartTemplate[] = [
  {
    type: 'scatter',
    name: 'Scatter Plot',
    description: 'Compare two numeric variables',
    icon: '⚪',
    defaultEncoding,
    supportedChannels: ['x', 'y', 'color', 'size', 'tooltip'],
    recommendedDataTypes: {
      x: [Type.Number],
      y: [Type.Number],
      color: [Type.String]
    },
    postProcess: (data, encoding) => {
      if (!encoding.x?.field || !encoding.y?.field) return data;
      return data.map(d => ({
        ...d,
        x: d[encoding.x!.field],
        y: d[encoding.y!.field]
      }));
    }
  },
  {
    type: 'bar',
    name: 'Bar Chart',
    description: 'Compare values across categories',
    icon: '📊',
    defaultEncoding,
    supportedChannels: ['x', 'y', 'color', 'tooltip'],
    recommendedDataTypes: {
      x: [Type.String],
      y: [Type.Number],
      color: [Type.String]
    },
    postProcess: (data, encoding) => {
      if (!encoding.x?.field || !encoding.y?.field) return data;
      return data.map(d => ({
        ...d,
        x: d[encoding.x!.field],
        y: d[encoding.y!.field]
      }));
    }
  },
  {
    type: 'line',
    name: 'Line Chart',
    description: 'Show trends over time',
    icon: '📈',
    defaultEncoding,
    supportedChannels: ['x', 'y', 'color', 'tooltip'],
    recommendedDataTypes: {
      x: [Type.Date, Type.Number],
      y: [Type.Number],
      color: [Type.String]
    },
    postProcess: (data, encoding) => {
      if (!encoding.x?.field || !encoding.y?.field) return data;
      return data
        .map(d => ({
          ...d,
          x: d[encoding.x!.field],
          y: d[encoding.y!.field]
        }))
        .sort((a, b) => a.x - b.x);
    }
  },
  {
    type: 'pie',
    name: 'Pie Chart',
    description: 'Show proportions of a whole',
    icon: '🥧',
    defaultEncoding: {
      ...defaultEncoding,
      color: { field: '', type: Type.String }
    },
    supportedChannels: ['x', 'y', 'color', 'tooltip'],
    recommendedDataTypes: {
      x: [Type.String],
      y: [Type.Number],
      color: [Type.String]
    },
    postProcess: (data, encoding) => {
      if (!encoding.x?.field || !encoding.y?.field) return data;
      return data.map(d => ({
        ...d,
        name: d[encoding.x!.field],
        value: d[encoding.y!.field]
      }));
    }
  },
  {
    type: 'area',
    name: 'Area Chart',
    description: 'Show cumulative values over time',
    icon: '📊',
    defaultEncoding,
    supportedChannels: ['x', 'y', 'color', 'tooltip'],
    recommendedDataTypes: {
      x: [Type.Date, Type.Number],
      y: [Type.Number],
      color: [Type.String]
    },
    postProcess: (data, encoding) => {
      if (!encoding.x?.field || !encoding.y?.field) return data;
      return data
        .map(d => ({
          ...d,
          x: d[encoding.x!.field],
          y: d[encoding.y!.field]
        }))
        .sort((a, b) => a.x - b.x);
    }
  }
]; 