'use client';

import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Button } from '../../components/ui/button';
import { ChartChannel, ChartEncoding, ChartTemplate } from '../../lib/charts/types';
import { Type } from '../../lib/data/types';
import { useStore } from '../../store/useStore';
import { cn } from '../../lib/utils';

interface EncodingShelfProps {
  template: ChartTemplate;
  encoding: ChartEncoding;
  onEncodingChange: (encoding: ChartEncoding) => void;
  columns: { name: string; type: Type }[];
}

const AGGREGATIONS = [
  { value: 'sum', label: 'Sum' },
  { value: 'average', label: 'Average' },
  { value: 'count', label: 'Count' },
  { value: 'min', label: 'Min' },
  { value: 'max', label: 'Max' }
];

export function EncodingShelf({ template, encoding, onEncodingChange, columns }: EncodingShelfProps) {
  const [expandedChannel, setExpandedChannel] = useState<keyof ChartEncoding | null>(null);

  const updateChannel = (channel: keyof ChartEncoding, field: string) => {
    const column = columns.find(c => c.name === field);
    if (!column) return;

    const newChannel: ChartChannel = {
      field,
      type: column.type
    };

    onEncodingChange({
      ...encoding,
      [channel]: channel === 'tooltip' ? [newChannel] : newChannel
    });
  };

  const updateAggregation = (channel: keyof ChartEncoding, aggregate: ChartChannel['aggregate']) => {
    if (!encoding[channel]) return;

    if (channel === 'tooltip') {
      const tooltipChannels = encoding.tooltip || [];
      onEncodingChange({
        ...encoding,
        tooltip: tooltipChannels.map(ch => ({
          ...ch,
          aggregate
        }))
      });
    } else {
      onEncodingChange({
        ...encoding,
        [channel]: {
          ...encoding[channel] as ChartChannel,
          aggregate
        }
      });
    }
  };

  const toggleChannel = (channel: keyof ChartEncoding) => {
    setExpandedChannel(expandedChannel === channel ? null : channel);
  };

  const getChannelValue = (channel: keyof ChartEncoding): string => {
    if (channel === 'tooltip') {
      return encoding.tooltip?.map(ch => ch.field).join(', ') || 'Not set';
    }
    return (encoding[channel] as ChartChannel)?.field || 'Not set';
  };

  return (
    <div className="space-y-4 p-4 bg-background/50 backdrop-blur border border-primary/10 rounded-xl">
      <h3 className="text-sm font-medium">Chart Encoding</h3>
      
      <div className="space-y-2">
        {template.supportedChannels.map(channel => (
          <div key={channel} className="space-y-2">
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-between",
                encoding[channel] && "bg-primary/10"
              )}
              onClick={() => toggleChannel(channel)}
            >
              <span className="capitalize">{channel}</span>
              <span className="text-muted-foreground">
                {getChannelValue(channel)}
              </span>
            </Button>

            {expandedChannel === channel && (
              <div className="pl-4 space-y-2">
                <Select
                  value={getChannelValue(channel)}
                  onValueChange={(value) => updateChannel(channel, value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select field" />
                  </SelectTrigger>
                  <SelectContent>
                    {columns.map(column => (
                      <SelectItem key={column.name} value={column.name}>
                        {column.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {encoding[channel] && (
                  <Select
                    value={(encoding[channel] as ChartChannel)?.aggregate || ''}
                    onValueChange={(value) => updateAggregation(channel, value as ChartChannel['aggregate'])}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select aggregation" />
                    </SelectTrigger>
                    <SelectContent>
                      {AGGREGATIONS.map(agg => (
                        <SelectItem key={agg.value} value={agg.value}>
                          {agg.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 