import * as XLSX from 'xlsx';
import Papa from 'papaparse';

export const parseFile = async (file: File): Promise<{ data: any[]; columns: string[] }> => {
  return new Promise((resolve, reject) => {
    const fileType = file.type;

    if (fileType === 'text/csv') {
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          const columns = results.meta.fields || [];
          resolve({
            data: results.data.slice(0, 100),
            columns,
          });
        },
        error: (error) => reject(error),
      });
    } else if (
      fileType === 'application/vnd.ms-excel' ||
      fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          const columns = Object.keys(jsonData[0] || {});
          resolve({
            data: jsonData.slice(0, 100),
            columns,
          });
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = (error) => reject(error);
      reader.readAsBinaryString(file);
    } else {
      reject(new Error('Unsupported file type'));
    }
  });
}; 