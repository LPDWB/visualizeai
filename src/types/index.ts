import { ReactNode } from 'react';

export interface DataRow {
  [key: string]: string | number;
}

export interface FileData {
  name: string;
  data: any[];
  columns: string[];
  timestamp: number;
}

export interface ChartProps {
  data: DataRow[];
  xAxis: string;
  yAxis: string;
}

export interface AIResponse {
  result: string;
  suggestions?: string[];
}

export interface FileParserResult {
  data: any[];
  columns: string[];
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
} 