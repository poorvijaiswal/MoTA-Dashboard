import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  AreaChart,
  Area,
  ComposedChart
} from 'recharts';
import { GOV_COLORS, CHART_CONFIG } from './theme';

// Base Chart Container Component
interface ChartContainerProps {
  title: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  className?: string;
}

export const ChartContainer: React.FC<ChartContainerProps> = ({
  title,
  description,
  icon: Icon,
  children,
  className = ''
}) => (
  <Card className={`shadow-sm border-gray-200 ${className}`}>
    <CardHeader className="pb-4">
      <CardTitle className="flex items-center text-lg font-semibold text-gov-primary">
        {Icon && <Icon className="w-5 h-5 mr-2 text-gov-secondary" />}
        {title}
      </CardTitle>
      {description && (
        <CardDescription className="text-sm text-gray-600">
          {description}
        </CardDescription>
      )}
    </CardHeader>
    <CardContent className="pt-0">
      {children}
    </CardContent>
  </Card>
);

// Status Distribution Pie Chart
interface StatusPieChartProps {
  data: Array<{ name: string; value: number; percentage: string }>;
  title: string;
  description?: string;
}

export const StatusPieChart: React.FC<StatusPieChartProps> = ({ 
  data, 
  title, 
  description 
}) => (
  <ChartContainer title={title} description={description}>
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={120}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={GOV_COLORS.chart[index % GOV_COLORS.chart.length]} 
              />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value, name) => [
              `${value} (${data.find(d => d.name === name)?.percentage}%)`, 
              name
            ]}
            contentStyle={CHART_CONFIG.tooltip.contentStyle}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  </ChartContainer>
);

// District Bar Chart
interface DistrictBarChartProps {
  data: Array<{ district: string; [key: string]: any }>;
  dataKey: string;
  title: string;
  description?: string;
  color?: string;
  yAxisLabel?: string;
}

export const DistrictBarChart: React.FC<DistrictBarChartProps> = ({
  data,
  dataKey,
  title,
  description,
  color = GOV_COLORS.primary,
  yAxisLabel
}) => (
  <ChartContainer title={title} description={description}>
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={CHART_CONFIG.margin}>
          <CartesianGrid {...CHART_CONFIG.grid} />
          <XAxis 
            dataKey="district" 
            angle={-45} 
            textAnchor="end" 
            height={80}
            fontSize={12}
            stroke={GOV_COLORS.text.secondary}
          />
          <YAxis 
            fontSize={12}
            stroke={GOV_COLORS.text.secondary}
            label={{ value: yAxisLabel, angle: -90, position: 'insideLeft' }}
          />
          <Tooltip contentStyle={CHART_CONFIG.tooltip.contentStyle} />
          <Bar 
            dataKey={dataKey} 
            fill={color} 
            radius={[2, 2, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </ChartContainer>
);

// Multi-metric Composed Chart
interface ComposedAnalyticsChartProps {
  data: Array<{ [key: string]: any }>;
  bars: Array<{ dataKey: string; fill: string; name: string }>;
  lines?: Array<{ dataKey: string; stroke: string; name: string }>;
  title: string;
  description?: string;
  xAxisKey: string;
}

export const ComposedAnalyticsChart: React.FC<ComposedAnalyticsChartProps> = ({
  data,
  bars,
  lines,
  title,
  description,
  xAxisKey
}) => (
  <ChartContainer title={title} description={description} className="col-span-full">
    <div className="h-96">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={CHART_CONFIG.margin}>
          <CartesianGrid {...CHART_CONFIG.grid} />
          <XAxis 
            dataKey={xAxisKey} 
            angle={-45} 
            textAnchor="end" 
            height={80}
            fontSize={12}
            stroke={GOV_COLORS.text.secondary}
          />
          <YAxis 
            yAxisId="left"
            fontSize={12}
            stroke={GOV_COLORS.text.secondary}
          />
          {lines && (
            <YAxis 
              yAxisId="right" 
              orientation="right"
              fontSize={12}
              stroke={GOV_COLORS.text.secondary}
            />
          )}
          <Tooltip contentStyle={CHART_CONFIG.tooltip.contentStyle} />
          <Legend />
          
          {bars.map((bar, index) => (
            <Bar
              key={index}
              yAxisId="left"
              dataKey={bar.dataKey}
              stackId="a"
              fill={bar.fill}
              name={bar.name}
            />
          ))}
          
          {lines?.map((line, index) => (
            <Line
              key={index}
              yAxisId="right"
              type="monotone"
              dataKey={line.dataKey}
              stroke={line.stroke}
              strokeWidth={2}
              name={line.name}
            />
          ))}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  </ChartContainer>
);

// Area Chart for Trends
interface TrendAreaChartProps {
  data: Array<{ [key: string]: any }>;
  dataKey: string;
  title: string;
  description?: string;
  xAxisKey: string;
  color?: string;
  yAxisLabel?: string;
}

export const TrendAreaChart: React.FC<TrendAreaChartProps> = ({
  data,
  dataKey,
  title,
  description,
  xAxisKey,
  color = GOV_COLORS.secondary,
  yAxisLabel
}) => (
  <ChartContainer title={title} description={description}>
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={CHART_CONFIG.margin}>
          <CartesianGrid {...CHART_CONFIG.grid} />
          <XAxis 
            dataKey={xAxisKey} 
            angle={-45} 
            textAnchor="end" 
            height={80}
            fontSize={12}
            stroke={GOV_COLORS.text.secondary}
          />
          <YAxis 
            fontSize={12}
            stroke={GOV_COLORS.text.secondary}
            label={{ value: yAxisLabel, angle: -90, position: 'insideLeft' }}
          />
          <Tooltip 
            formatter={(value) => [`${value}`, dataKey]}
            contentStyle={CHART_CONFIG.tooltip.contentStyle}
          />
          <Area 
            type="monotone" 
            dataKey={dataKey} 
            stroke={color} 
            fill={color}
            fillOpacity={0.3}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </ChartContainer>
);