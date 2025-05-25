'use client';

import { useState, useCallback } from 'react';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { useDataStore, FileData } from '@/store/dataStore';

export default function FileUpload() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const setFileData = useDataStore((state) => state.setFileData);
  const addToArchive = useDataStore((state) => state.addToArchive);

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);
    setIsLoading(true);

    try {
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      
      if (fileExtension === 'csv') {
        Papa.parse(file, {
          complete: (results) => {
            if (results.errors.length > 0) {
              setError('Error parsing CSV file: ' + results.errors[0].message);
              return;
            }
            
            const headers = results.data[0] as string[];
            const rows = results.data.slice(1, 101) as any[][]; // Get first 100 rows
            
            const fileData: FileData = {
              type: 'file',
              fileName: file.name,
              rowCount: results.data.length - 1,
              data: { headers, rows }
            };
            
            setFileData(fileData);
            addToArchive({
              type: 'file',
              name: file.name,
              data: fileData
            });
          },
          error: (error) => {
            setError('Error reading CSV file: ' + error.message);
          }
        });
      } else if (fileExtension === 'xlsx') {
        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data);
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        if (jsonData.length === 0) {
          setError('The Excel file is empty');
          return;
        }

        const headers = jsonData[0] as string[];
        const rows = jsonData.slice(1, 101) as any[][]; // Get first 100 rows
        
        const fileData: FileData = {
          type: 'file',
          fileName: file.name,
          rowCount: jsonData.length - 1,
          data: { headers, rows }
        };
        
        setFileData(fileData);
        addToArchive({
          type: 'file',
          name: file.name,
          data: fileData
        });
      } else {
        setError('Unsupported file format. Please upload a CSV or XLSX file.');
      }
    } catch (err) {
      setError('Error processing file: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, [setFileData, addToArchive]);

  const fileData = useDataStore((state) => state.fileData);

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center justify-center w-full">
        <label
          htmlFor="file-upload"
          className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg
              className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 16"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
              />
            </svg>
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">CSV or XLSX files only</p>
          </div>
          <input
            id="file-upload"
            type="file"
            className="hidden"
            accept=".csv,.xlsx"
            onChange={handleFileUpload}
          />
        </label>
      </div>

      {isLoading && (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
        </div>
      )}

      {error && (
        <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
          {error}
        </div>
      )}

      {fileData && fileData.type === 'file' && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                {fileData.data.headers.map((header, index) => (
                  <th key={index} scope="col" className="px-6 py-3">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {fileData.data.rows.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className="px-6 py-4">
                      {cell?.toString() || ''}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 