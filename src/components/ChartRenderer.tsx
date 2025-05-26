import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  LabelList,
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

interface ChartRendererProps {
  chartType: 'bar' | 'line' | 'pie';
  data: any[];
  xAxis: string;
  yAxis: string;
  columns: string[];
}

export function ChartRenderer({ chartType, data, xAxis, yAxis, columns }: ChartRendererProps) {
  if (!xAxis || !yAxis) {
    return (
      <div className="h-[400px] flex items-center justify-center text-muted-foreground">
        Choose a chart type and data columns to preview
      </div>
    );
  }

  // Pie chart: group minor slices into "Other" if too many
  let pieData = data;
  if (chartType === 'pie' && data.length > 20) {
    const sorted = [...data].sort((a, b) => b[yAxis] - a[yAxis]);
    const major = sorted.slice(0, 15);
    const minor = sorted.slice(15);
    const otherValue = minor.reduce((sum, d) => sum + d[yAxis], 0);
    pieData = [
      ...major,
      { [xAxis]: 'Other', [yAxis]: otherValue },
    ];
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-background/80 backdrop-blur-sm p-3 rounded-lg border shadow-lg"
        >
          <p className="font-medium break-words max-w-xs">{label}</p>
          <p className="text-primary">{payload[0].value}</p>
        </motion.div>
      );
    }
    return null;
  };

  switch (chartType) {
    case 'bar':
      return (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 90 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis
              dataKey={xAxis}
              angle={-45}
              textAnchor="end"
              height={90}
              tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
              interval={0}
            />
            <YAxis tick={{ fill: 'var(--muted-foreground)' }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar
              dataKey={yAxis}
              fill="var(--primary)"
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            >
              <LabelList
                dataKey={yAxis}
                position="top"
                formatter={(value: any) => String(value).length > 8 ? String(value).slice(0, 8) + '…' : value}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      );
    case 'line':
      return (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 90 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis
              dataKey={xAxis}
              angle={-45}
              textAnchor="end"
              height={90}
              tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
              interval={0}
            />
            <YAxis tick={{ fill: 'var(--muted-foreground)' }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey={yAxis}
              stroke="var(--primary)"
              strokeWidth={2}
              dot={{ r: 4, fill: 'var(--primary)' }}
              activeDot={{ r: 6, fill: 'var(--primary)' }}
            />
          </LineChart>
        </ResponsiveContainer>
      );
    case 'pie':
      return (
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey={yAxis}
              nameKey={xAxis}
              cx="50%"
              cy="50%"
              outerRadius={150}
              fill="var(--primary)"
              label={({ name, percent }) => {
                const label = String(name);
                return label.length > 16 ? label.slice(0, 16) + '…' : label;
              }}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      );
  }
  return null;
} 