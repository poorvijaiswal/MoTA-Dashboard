import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, ComposedChart, Area, AreaChart,
  ScatterChart, Scatter, RadialBarChart, RadialBar, Treemap
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  TrendingUp, TrendingDown, Users, FileText, DollarSign, 
  AlertTriangle, CheckCircle, Clock, MapPin, Target,
  Filter, Download, Calendar, BarChart3, PieChart as PieChartIcon,
  Activity, Shield, TreePine, Zap, Award, AlertCircle
} from 'lucide-react';

// Color schemes for consistent theming
const COLORS = {
  primary: '#1B365D',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#3B82F6',
  secondary: '#6B7280',
  approved: '#10B981',
  pending: '#F59E0B',
  rejected: '#EF4444',
  gradient: ['#1B365D', '#2B4A7E', '#3B5F9F', '#4B74C0']
};

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ElementType;
  trend?: { value: number; isPositive: boolean; period?: string };
  colorScheme: 'primary' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md' | 'lg';
}

const PowerBIKPICard: React.FC<KPICardProps> = ({ 
  title, value, subtitle, icon: Icon, trend, colorScheme, size = 'md' 
}) => {
  const colorMap = {
    primary: 'bg-blue-50 border-blue-200 text-blue-900',
    success: 'bg-green-50 border-green-200 text-green-900',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-900',
    danger: 'bg-red-50 border-red-200 text-red-900',
    info: 'bg-indigo-50 border-indigo-200 text-indigo-900'
  };

  const iconColorMap = {
    primary: 'text-blue-600',
    success: 'text-green-600',
    warning: 'text-yellow-600',
    danger: 'text-red-600',
    info: 'text-indigo-600'
  };

  const sizeClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  return (
    <Card className={`${colorMap[colorScheme]} border ${sizeClasses[size]} hover:shadow-lg transition-all duration-200`}>
      <CardContent className="p-0">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <div className={`p-2 rounded-lg bg-white/50`}>
                <Icon className={`h-5 w-5 ${iconColorMap[colorScheme]}`} />
              </div>
              <div>
                <p className="text-sm font-medium opacity-80">{title}</p>
                <p className={`text-2xl font-bold ${size === 'lg' ? 'text-3xl' : ''}`}>
                  {typeof value === 'number' ? value.toLocaleString() : value}
                </p>
              </div>
            </div>
            {subtitle && (
              <p className="text-xs opacity-70 mb-2">{subtitle}</p>
            )}
            {trend && (
              <div className="flex items-center space-x-1">
                {trend.isPositive ? (
                  <TrendingUp className="h-3 w-3 text-green-600" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-600" />
                )}
                <span className={`text-xs font-medium ${
                  trend.isPositive ? 'text-green-700' : 'text-red-700'
                }`}>
                  {trend.value}% {trend.period || 'vs last month'}
                </span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Enhanced Donut Chart Component
const PowerBIDonutChart: React.FC<{
  data: any[];
  title: string;
  description?: string;
  centerValue?: string;
  centerLabel?: string;
}> = ({ data, title, description, centerValue, centerLabel }) => {
  const [activeIndex, setActiveIndex] = useState(-1);

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <PieChartIcon className="h-5 w-5" />
          <span>{title}</span>
        </CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="relative">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={120}
                paddingAngle={2}
                dataKey="value"
                onMouseEnter={(_, index) => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(-1)}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS.gradient[index % COLORS.gradient.length]}
                    stroke={activeIndex === index ? "#fff" : "none"}
                    strokeWidth={activeIndex === index ? 3 : 0}
                  />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: any, name: any) => [
                  `${value.toLocaleString()} (${((value / data.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(1)}%)`,
                  name
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
          
          {/* Center content */}
          {centerValue && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{centerValue}</div>
                {centerLabel && (
                  <div className="text-sm text-gray-600">{centerLabel}</div>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Legend */}
        <div className="grid grid-cols-2 gap-2 mt-4">
          {data.map((entry, index) => (
            <div key={entry.name} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: COLORS.gradient[index % COLORS.gradient.length] }}
              />
              <span className="text-sm text-gray-700">{entry.name}</span>
              <span className="text-sm font-medium ml-auto">{entry.value.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Enhanced Bar Chart Component
const PowerBIBarChart: React.FC<{
  data: any[];
  title: string;
  description?: string;
  xDataKey: string;
  yDataKey: string;
  color?: string;
  showTrend?: boolean;
}> = ({ data, title, description, xDataKey, yDataKey, color = COLORS.primary, showTrend = false }) => {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <BarChart3 className="h-5 w-5" />
          <span>{title}</span>
        </CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey={xDataKey} 
              angle={-45}
              textAnchor="end"
              height={80}
              fontSize={12}
            />
            <YAxis fontSize={12} />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Bar 
              dataKey={yDataKey} 
              fill={color}
              radius={[4, 4, 0, 0]}
            />
            {showTrend && (
              <Line 
                type="monotone" 
                dataKey="trend" 
                stroke={COLORS.warning} 
                strokeWidth={2}
                dot={{ fill: COLORS.warning, strokeWidth: 2, r: 4 }}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

// Heat Map Component
const PowerBIHeatMap: React.FC<{
  data: any[];
  title: string;
  description?: string;
}> = ({ data, title, description }) => {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MapPin className="h-5 w-5" />
          <span>{title}</span>
        </CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <Treemap
            data={data}
            dataKey="value"
            stroke="#fff"
            fill={COLORS.primary}
          />
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

// Performance Matrix Component
const PowerBIPerformanceMatrix: React.FC<{
  data: any[];
  title: string;
}> = ({ data, title }) => {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Target className="h-5 w-5" />
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((district, index) => {
            const performance = (district.fraClaimsApproved / district.fraClaimsTotal) * 100;
            const utilizationScore = district.schemeUtilization;
            const overallScore = (performance + utilizationScore) / 2;
            
            return (
              <div key={district.district} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{district.district}</h4>
                    <Badge variant={overallScore >= 75 ? "default" : overallScore >= 50 ? "secondary" : "destructive"}>
                      {overallScore.toFixed(1)}%
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">FRA Approval</p>
                      <div className="flex items-center space-x-2">
                        <Progress value={performance} className="flex-1" />
                        <span className="font-medium">{performance.toFixed(1)}%</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-600">Scheme Utilization</p>
                      <div className="flex items-center space-x-2">
                        <Progress value={utilizationScore} className="flex-1" />
                        <span className="font-medium">{utilizationScore.toFixed(1)}%</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-600">Processing Speed</p>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">{district.avgProcessingDays} days</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export {
  PowerBIKPICard,
  PowerBIDonutChart,
  PowerBIBarChart,
  PowerBIHeatMap,
  PowerBIPerformanceMatrix,
  COLORS
};