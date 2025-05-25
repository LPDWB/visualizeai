'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DataTableProps {
  data: any[];
}

export default function DataTable({ data }: DataTableProps) {
  if (!data || data.length === 0) {
    return (
      <div className="rounded-lg border p-4 text-center text-gray-500 dark:text-gray-400">
        Нет данных
      </div>
    );
  }

  const headers = Object.keys(data[0]);
  const rows = data.slice(0, 100);

  return (
    <div className="rounded-lg border">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {headers.map((header) => (
                <TableHead key={header} className="font-medium">
                  {header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, rowIndex) => (
              <TableRow
                key={rowIndex}
                className={rowIndex % 2 === 0 ? "bg-gray-50 dark:bg-gray-800" : ""}
              >
                {headers.map((header) => (
                  <TableCell key={`${rowIndex}-${header}`}>
                    {row[header]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
} 