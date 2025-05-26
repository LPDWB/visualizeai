import { create } from 'zustand';
import { StateCreator } from 'zustand';

interface DataStore {
  parsedData: any[];
  setParsedData: (data: any[]) => void;
}

const useDataStore = create<DataStore>((set: StateCreator<DataStore>['set']) => ({
  parsedData: [],
  setParsedData: (data: any[]) => set({ parsedData: data }),
}));

export { useDataStore }; 