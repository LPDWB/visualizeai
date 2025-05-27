import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { devtools } from 'zustand/middleware';
import { StoreState, TableState, Chart, UIState, FileData } from './types';
import { v4 as uuidv4 } from 'uuid';
import { chartTemplates } from '../lib/charts/templates';
import { ChartConfig } from '../lib/charts/types';
import { Table } from '../lib/data/types';

const initialState: StoreState = {
  // File state
  currentFile: null,
  fileHistory: [],

  // Table and chart state
  tables: {},
  charts: {},
  ui: {
    activeTableId: null,
    activeChartId: null,
    sidebarOpen: true,
    theme: 'light',
  },

  // File actions
  setCurrentFile: () => {},
  addToHistory: () => {},
  clearCurrentFile: () => {},

  // Table actions
  addTable: () => '',
  updateTable: () => {},
  deleteTable: () => {},

  // Chart actions
  addChart: () => '',
  updateChart: () => {},
  deleteChart: () => {},
  createChartFromAIConfig: () => null,

  // UI actions
  setActiveTable: () => {},
  setActiveChart: () => {},
  toggleSidebar: () => {},
  setTheme: () => {},
};

export const useStore = create<StoreState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // File actions
        setCurrentFile: (file: FileData) => set({ currentFile: file }),
        addToHistory: (file: FileData) => set(state => ({
          fileHistory: [...state.fileHistory, file]
        })),
        clearCurrentFile: () => set({ currentFile: null }),

        // Table actions
        addTable: (name: string, data: Table) => {
          const id = `table_${Date.now()}`;
          set(state => ({
            tables: {
              ...state.tables,
              [id]: {
                id,
                name,
                data,
                createdAt: Date.now(),
                updatedAt: Date.now(),
              },
            },
          }));
          return id;
        },

        updateTable: (id: string, updates: Partial<TableState>) => {
          set(state => ({
            tables: {
              ...state.tables,
              [id]: {
                ...state.tables[id],
                ...updates,
                updatedAt: Date.now(),
              },
            },
          }));
        },

        deleteTable: (id: string) => {
          set(state => {
            const { [id]: _, ...tables } = state.tables;
            return { tables };
          });
        },

        // Chart actions
        addChart: (name: string, config: Omit<Chart, 'id' | 'name' | 'createdAt' | 'updatedAt'>) => {
          const id = `chart_${Date.now()}`;
          set(state => ({
            charts: {
              ...state.charts,
              [id]: {
                id,
                name,
                ...config,
                createdAt: Date.now(),
                updatedAt: Date.now(),
              },
            },
          }));
          return id;
        },

        updateChart: (id: string, updates: Partial<Chart>) => {
          set(state => ({
            charts: {
              ...state.charts,
              [id]: {
                ...state.charts[id],
                ...updates,
                updatedAt: Date.now(),
              },
            },
          }));
        },

        deleteChart: (id: string) => {
          set(state => {
            const { [id]: _, ...charts } = state.charts;
            return { charts };
          });
        },

        createChartFromAIConfig: (config: ChartConfig, data: Table) => {
          const template = chartTemplates.find(t => t.type === config.type);
          if (!template) return null;

          const id = `chart_${Date.now()}`;
          const name = `AI Generated ${template.name}`;

          set(state => ({
            charts: {
              ...state.charts,
              [id]: {
                id,
                name,
                ...config,
                data,
                createdAt: Date.now(),
                updatedAt: Date.now(),
              },
            },
            ui: {
              ...state.ui,
              activeChartId: id,
            },
          }));

          return id;
        },

        // UI actions
        setActiveTable: (id: string | null) => set(state => ({
          ui: { ...state.ui, activeTableId: id }
        })),

        setActiveChart: (id: string | null) => set(state => ({
          ui: { ...state.ui, activeChartId: id }
        })),

        toggleSidebar: () => set(state => ({
          ui: { ...state.ui, sidebarOpen: !state.ui.sidebarOpen }
        })),

        setTheme: (theme: 'light' | 'dark') => set(state => ({
          ui: { ...state.ui, theme }
        })),
      }),
      {
        name: 'visualize-ai-store',
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          tables: state.tables,
          charts: state.charts,
          ui: {
            theme: state.ui.theme
          }
        })
      }
    )
  )
); 