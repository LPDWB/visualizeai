import { Table } from '@/lib/data/types';
import { ChartConfig, ChartTemplate } from '@/lib/charts/types';

export interface FileData {
  name: string;
  data: any[];
  columns: string[];
  timestamp: number;
}

export interface Chart extends Omit<ChartConfig, 'data'> {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  data: Table;
}

export interface TableState {
  id: string;
  name: string;
  data: Table;
  createdAt: number;
  updatedAt: number;
}

export interface UIState {
  activeTableId: string | null;
  activeChartId: string | null;
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
}

export interface StoreState {
  // File state
  currentFile: FileData | null;
  fileHistory: FileData[];
  
  // Table and chart state
  tables: Record<string, TableState>;
  charts: Record<string, Chart>;
  ui: UIState;

  // File actions
  setCurrentFile: (file: FileData) => void;
  addToHistory: (file: FileData) => void;
  clearCurrentFile: () => void;

  // Table actions
  addTable: (name: string, data: Table) => string;
  updateTable: (id: string, updates: Partial<TableState>) => void;
  deleteTable: (id: string) => void;

  // Chart actions
  addChart: (name: string, config: Omit<Chart, 'id' | 'name' | 'createdAt' | 'updatedAt'>) => string;
  updateChart: (id: string, updates: Partial<Chart>) => void;
  deleteChart: (id: string) => void;
  createChartFromAIConfig: (config: ChartConfig, data: Table) => string | null;

  // UI actions
  setActiveTable: (id: string | null) => void;
  setActiveChart: (id: string | null) => void;
  toggleSidebar: () => void;
  setTheme: (theme: UIState['theme']) => void;
} 