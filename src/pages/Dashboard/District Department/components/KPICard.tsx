import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GOV_COLORS } from './theme';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  colorScheme?: 'primary' | 'success' | 'warning' | 'info';
}

const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  colorScheme = 'primary'
}) => {
  const getColorClasses = () => {
    switch (colorScheme) {
      case 'success':
        return {
          bg: 'bg-white border-l-4 border-l-green-600',
          iconBg: 'bg-green-50',
          iconColor: 'text-green-600',
          valueColor: 'text-green-700'
        };
      case 'warning':
        return {
          bg: 'bg-white border-l-4 border-l-orange-600',
          iconBg: 'bg-orange-50', 
          iconColor: 'text-orange-600',
          valueColor: 'text-orange-700'
        };
      case 'info':
        return {
          bg: 'bg-white border-l-4 border-l-blue-600',
          iconBg: 'bg-blue-50',
          iconColor: 'text-blue-600', 
          valueColor: 'text-blue-700'
        };
      default:
        return {
          bg: 'bg-white border-l-4 border-l-navy-600',
          iconBg: 'bg-slate-50',
          iconColor: 'text-slate-700',
          valueColor: 'text-slate-800'
        };
    }
  };

  const colors = getColorClasses();

  return (
    <Card className={`${colors.bg} shadow-sm hover:shadow-md transition-shadow`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <p className={`text-2xl font-bold ${colors.valueColor} mb-1`}>
              {typeof value === 'number' ? value.toLocaleString() : value}
            </p>
            <p className="text-sm text-gray-500">{subtitle}</p>
            {trend && (
              <div className="flex items-center mt-2">
                <span className={`text-xs font-medium ${
                  trend.isPositive ? 'text-green-600' : 'text-red-600'
                }`}>
                  {trend.isPositive ? '↗' : '↘'} {Math.abs(trend.value)}%
                </span>
                <span className="text-xs text-gray-500 ml-1">vs last period</span>
              </div>
            )}
          </div>
          <div className={`${colors.iconBg} p-3 rounded-lg`}>
            <Icon className={`w-6 h-6 ${colors.iconColor}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default KPICard;