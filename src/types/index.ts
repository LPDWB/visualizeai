import { ReactNode } from 'react';

export interface DataRow {
  [key: string]: string | number;
}

export interface FileData {
  name: string;
  columns: string[];
  data: DataRow[];
  timestamp: number;
}

export interface ChartProps {
  data: DataRow[];
  xAxis: string;
  yAxis: string;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
} 