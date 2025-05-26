import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

export interface ChartDataPoint {
  name: string;
  value: number;
}

export type ChartType = 'bar' | 'line' | 'pie';

interface UseChartDataTransformProps {
  data: ChartDataPoint[];
  chartType: ChartType;
  topN: number;
}

export function useChartDataTransform({ data, chartType, topN }: UseChartDataTransformProps) {
  const [transformedData, setTransformedData] = useState<ChartDataPoint[]>([]);
  const [shouldSwitchToBar, setShouldSwitchToBar] = useState(false);

  useEffect(() => {
    let processedData = [...data];

    // Sort data by value
    processedData.sort((a, b) => b.value - a.value);

    // Handle pie chart specific logic
    if (chartType === 'pie') {
      if (processedData.length > 20) {
        setShouldSwitchToBar(true);
        toast('Слишком много значений для круговой диаграммы, переключено на столбчатую.');
        return;
      }

      if (processedData.length > 12) {
        // Group small values into "Others"
        const mainData = processedData.slice(0, 11);
        const othersData = processedData.slice(11);
        const othersSum = othersData.reduce((sum, item) => sum + item.value, 0);
        
        processedData = [
          ...mainData,
          { name: 'Другие', value: othersSum }
        ];
      }
    }

    // Apply topN filter if specified
    if (topN > 0) {
      processedData = processedData.slice(0, topN);
    }

    setTransformedData(processedData);
    setShouldSwitchToBar(false);
  }, [data, chartType, topN]);

  return {
    transformedData,
    shouldSwitchToBar
  };
} 