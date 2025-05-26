import { create } from 'zustand';

interface DataStore {
  parsedData: any[];
  setParsedData: (data: any[]) => void;
}

const useDataStore = create<DataStore>((set) => ({
  parsedData: [],
  setParsedData: (data) => set({ parsedData: data }),
}));

export { useDataStore }; 