'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEffect, useState } from 'react';

export const MODELS = [
  { id: 'claude-3-haiku', name: 'Claude 3 Haiku', description: 'Fast and efficient' },
  { id: 'gpt-4', name: 'GPT-4', description: 'Most capable' },
  { id: 'gpt-3.5-turbo', name: 'GPT-3.5', description: 'Balanced' },
  { id: 'mixtral', name: 'Mixtral', description: 'Open source' },
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
      <SelectTrigger className="w-[200px] bg-background/50 backdrop-blur">
        <SelectValue placeholder="Select model" />
      </SelectTrigger>
      <SelectContent>
        {MODELS.map(model => (
          <SelectItem key={model.id} value={model.id}>
            <div className="flex flex-col">
              <span>{model.name}</span>
              <span className="text-xs text-muted-foreground">{model.description}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
} 