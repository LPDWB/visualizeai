'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDataStore } from '@/store/dataStore';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'react-hot-toast';
import { ArchiveRecord, DiagramData, FileData } from '@/store/dataStore';

export default function ArchivePage() {
  const router = useRouter();
  const { records, removeFromArchive } = useDataStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'name'>('date');
  const [filterType, setFilterType] = useState<'all' | 'file' | 'diagram'>('all');

  const filteredRecords = records
    .filter((record: ArchiveRecord) => {
      const matchesSearch = record.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || record.type === filterType;
      return matchesSearch && matchesType;
    })
    .sort((a: ArchiveRecord, b: ArchiveRecord) => {
      if (sortBy === 'date') {
        return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
      }
      return a.name.localeCompare(b.name);
    });

  const handleDelete = (id: string) => {
    removeFromArchive(id);
    toast.success('Record removed from archive');
  };

  const handleLoadDiagram = (id: string) => {
    router.push(`/text-visuals?id=${id}`);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Archive</h1>
      
      <div className="flex flex-wrap gap-4 mb-6">
        <Input
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
          className="max-w-xs"
        />
        <Select value={sortBy} onValueChange={(value: 'date' | 'name') => setSortBy(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Date</SelectItem>
            <SelectItem value="name">Name</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterType} onValueChange={(value: 'all' | 'file' | 'diagram') => setFilterType(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="file">Files</SelectItem>
            <SelectItem value="diagram">Diagrams</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRecords.map((record: ArchiveRecord) => (
              <TableRow key={record.id}>
                <TableCell className="font-medium">{record.name}</TableCell>
                <TableCell>
                  <Badge variant={record.type === 'file' ? 'default' : 'secondary'}>
                    {record.type === 'file' ? 'File' : 'Diagram'}
                  </Badge>
                </TableCell>
                <TableCell>{format(new Date(record.uploadDate), 'PPp')}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {record.type === 'diagram' ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleLoadDiagram(record.id)}
                      >
                        Load
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          try {
                            const fileData = record.data as FileData;
                            window.open(URL.createObjectURL(fileData.file), '_blank');
                          } catch (error) {
                            toast.error('Failed to open file');
                            console.error('Error opening file:', error);
                          }
                        }}
                      >
                        View
                      </Button>
                    )}
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(record.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filteredRecords.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                  No records found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
} 