import { create } from 'zustand';

interface DataStore {
  parsedData: any[];
  setParsedData: (data: any[]) => void;
}

export const useDataStore = create<DataStore>((set) => ({
  parsedData: [],
  setParsedData: (data) => set({ parsedData: data }),
})); 