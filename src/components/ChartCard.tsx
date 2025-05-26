import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, RefreshCw, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ChartEditor from '@/components/ChartEditor';
import { toast } from 'react-hot-toast';
import html2canvas from 'html2canvas';

interface ChartCardProps {
  id: string;
  title: string;
  data: any;
  onDelete: (id: string) => void;
  onRefresh: (id: string) => void;
}

export function ChartCard({ id, title, data, onDelete, onRefresh }: ChartCardProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (format: 'png' | 'svg') => {
    try {
      setIsExporting(true);
      const chartElement = document.getElementById(`chart-${id}`);
      if (!chartElement) return;

      const canvas = await html2canvas(chartElement);
      const dataUrl = canvas.toDataURL(`image/${format}`);
      
      const link = document.createElement('a');
      link.download = `${title}.${format}`;
      link.href = dataUrl;
      link.click();
      
      toast.success(`Chart exported as ${format.toUpperCase()}`);
    } catch (error) {
      toast.error('Failed to export chart');
      console.error('Export error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="relative group bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleExport('png')}
            disabled={isExporting}
            className="hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Download className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onRefresh(id)}
            className="hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(id)}
            className="hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      <div id={`chart-${id}`} className="w-full h-[300px]">
        <ChartEditor data={data} />
      </div>
    </motion.div>
  );
} 