export enum Type {
  String = 'string',
  Number = 'number',
  Boolean = 'boolean',
  Date = 'date',
  DateTime = 'datetime'
}

export interface Column {
  name: string;
  type: Type;
  values: any[];
}

export interface Table {
  columns: Column[];
  rows: any[];
}

export interface TypeInferenceResult {
  type: Type;
  confidence: number;
  sampleValues: any[];
} 