import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Node, Edge } from 'reactflow';

export type FileData = {
  file: File;
  parsedData: any[];
};

export type DiagramData = {
  nodes: Node[];
  edges: Edge[];
};

export type ArchiveRecord = {
  id: string;
  type: 'file' | 'diagram';
  name: string;
  uploadDate: string;
  data: FileData | DiagramData;
};

interface DataStore {
  records: ArchiveRecord[];
  addToArchive: (record: Omit<ArchiveRecord, 'id' | 'uploadDate'>) => void;
  removeFromArchive: (id: string) => void;
}

export const useDataStore = create<DataStore>()(
  persist(
    (set) => ({
      records: [],
      addToArchive: (record) =>
        set((state) => ({
          records: [
            ...state.records,
            {
              ...record,
              id: crypto.randomUUID(),
              uploadDate: new Date().toISOString(),
            },
          ],
        })),
      removeFromArchive: (id) =>
        set((state) => ({
          records: state.records.filter((record) => record.id !== id),
        })),
    }),
    {
      name: 'data-store',
    }
  )
); 