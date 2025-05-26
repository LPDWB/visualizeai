import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ChartLegendProps {
  data: Array<{ name: string; value: number; color: string }>;
  className?: string;
}

export function ChartLegend({ data, className = '' }: ChartLegendProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const legendContent = (
    <div className="space-y-2">
      {data.map((item, index) => (
        <motion.div
          key={item.name}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent/50 transition-colors"
        >
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: item.color }}
          />
          <span className="text-sm font-medium">{item.name}</span>
          <span className="text-sm text-muted-foreground ml-auto">
            {item.value.toLocaleString()}
          </span>
        </motion.div>
      ))}
    </div>
  );

  if (isMobile) {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="w-full flex items-center justify-between"
          >
            <span>Легенда</span>
            <ChevronDown className="w-4 h-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[280px] p-4">
          <ScrollArea className="h-[300px] pr-4">
            {legendContent}
          </ScrollArea>
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <div className={`border rounded-lg p-4 ${className}`}>
      <Button
        variant="ghost"
        size="sm"
        className="w-full flex items-center justify-between mb-2"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span>Легенда</span>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
      </Button>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <ScrollArea className="h-[300px] pr-4">
              {legendContent}
            </ScrollArea>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 