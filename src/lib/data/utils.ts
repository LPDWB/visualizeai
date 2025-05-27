import { Type, TypeInferenceResult, Table, Column } from './types';

export function inferTypeFromValueArray(values: any[]): TypeInferenceResult {
  if (values.length === 0) {
    return { type: Type.String, confidence: 0, sampleValues: [] };
  }

  const nonNullValues = values.filter(v => v !== null && v !== undefined);
  const sampleValues = nonNullValues.slice(0, 5);

  // Check for dates
  const dateRegex = /^\d{4}-\d{2}-\d{2}|\d{2}\/\d{2}\/\d{4}$/;
  const isDate = nonNullValues.every(v => 
    typeof v === 'string' && dateRegex.test(v)
  );
  if (isDate) {
    return { type: Type.Date, confidence: 0.9, sampleValues };
  }

  // Check for booleans
  const isBoolean = nonNullValues.every(v => 
    typeof v === 'boolean' || v === 'true' || v === 'false'
  );
  if (isBoolean) {
    return { type: Type.Boolean, confidence: 0.9, sampleValues };
  }

  // Check for numbers
  const isNumber = nonNullValues.every(v => 
    !isNaN(Number(v)) && typeof v !== 'boolean'
  );
  if (isNumber) {
    return { type: Type.Number, confidence: 0.8, sampleValues };
  }

  // Check for categories (strings with limited unique values)
  const uniqueValues = new Set(nonNullValues.map(String));
  if (uniqueValues.size <= 10 && uniqueValues.size > 0) {
    return { type: Type.String, confidence: 0.7, sampleValues };
  }

  // Default to string
  return { type: Type.String, confidence: 0.6, sampleValues };
}

export function createTableFromText(text: string): Table {
  const lines = text.trim().split('\n');
  if (lines.length < 2) {
    throw new Error('Invalid table format: requires header and at least one row');
  }

  const headers = lines[0].split(',').map(h => h.trim());
  const rows = lines.slice(1).map(line => {
    const values = line.split(',').map(v => v.trim());
    return Object.fromEntries(headers.map((h, i) => [h, values[i]]));
  });

  const columns: Column[] = headers.map(header => {
    const values = rows.map(row => row[header]);
    const { type } = inferTypeFromValueArray(values);
    return { name: header, type, values };
  });

  return { columns, rows };
}

export function handleDuplicateColumnNames(columns: Column[]): Column[] {
  const nameCount = new Map<string, number>();
  return columns.map(col => {
    const count = nameCount.get(col.name) || 0;
    nameCount.set(col.name, count + 1);
    return {
      ...col,
      name: count === 0 ? col.name : `${col.name}_${count}`
    };
  });
} 