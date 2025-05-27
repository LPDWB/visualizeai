'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEffect, useState } from 'react';

export const MODELS = [
  { 
    id: 'anthropic/claude-3-haiku', 
    name: 'Claude 3 Haiku', 
    description: 'Fast & Smart',
    icon: '⚡'
  },
  { 
    id: 'mistralai/mixtral-8x7b-instruct', 
    name: 'Mixtral', 
    description: 'Ultra Fast',
    icon: '⚡'
  }
];

interface ModelDropdownProps {
  value: string;
  onChange: (value: string) => void;
}

export function ModelDropdown({ value, onChange }: ModelDropdownProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedModel = localStorage.getItem('preferredModel');
    if (savedModel && MODELS.some(m => m.id === savedModel)) {
      onChange(savedModel);
    }
  }, [onChange]);

  if (!mounted) return null;

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[220px] bg-background/50 backdrop-blur border-primary/20">
        <SelectValue placeholder="Select model" />
      </SelectTrigger>
      <SelectContent>
        {MODELS.map(model => (
          <SelectItem key={model.id} value={model.id}>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">{model.icon}</span>
              <div className="flex flex-col">
                <span className="font-medium leading-none">{model.name}</span>
                <span className="text-xs text-muted-foreground mt-1">{model.description}</span>
              </div>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
} 