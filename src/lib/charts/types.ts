import { Type } from '../data/types';
import { Table } from '@/lib/data/types';

export type ChartType = 'bar' | 'line' | 'scatter' | 'pie' | 'area' | 'heatmap';

export interface ChartChannel {
  field: string;
  type: Type;
  aggregate?: 'sum' | 'average' | 'count' | 'min' | 'max';
}

export interface ChartEncoding {
  x?: ChartChannel;
  y?: ChartChannel;
  color?: ChartChannel;
  size?: ChartChannel;
  shape?: ChartChannel;
  text?: ChartChannel;
  tooltip?: ChartChannel[];
}

export interface ChartTemplate {
  type: ChartType;
  name: string;
  description: string;
  icon: string;
  defaultEncoding: ChartEncoding;
  supportedChannels: (keyof ChartEncoding)[];
  postProcess?: (data: any[], encoding: ChartEncoding) => any[];
  recommendedDataTypes: {
    x?: string[];
    y?: string[];
    color?: string[];
    size?: string[];
    shape?: string[];
    text?: string[];
  };
}

export interface ChartConfig {
  type: ChartType;
  template: ChartTemplate;
  encoding: ChartEncoding;
  data: Table;
  width?: number;
  height?: number;
  margin?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
} 