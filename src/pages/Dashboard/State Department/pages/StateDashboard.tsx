import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaFileAlt, 
  FaUsers, 
  FaChartLine, 
  FaClock,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaExclamationTriangle,
  FaEye,
  FaDownload,
  FaFilter,
  FaSearch,
  FaArrowUp,
  FaArrowDown,
  FaBell,
  FaTasks,
  FaCalendarAlt,
  FaUserCheck,
  FaPlay,
  FaLeaf,
  FaLandmark,
  FaBrain,
  FaClipboardList
} from 'react-icons/fa';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  action: string;
  urgency: 'high' | 'medium' | 'low';
}

interface ActivityItem {
  id: string;
  type: string;
  message: string;
  timestamp: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'completed' | 'in-progress';
}

const StateDashboard = () => {
  const navigate = useNavigate();

  // Add stats object for KPI section
  const stats = {
    totalClaims: 1247,
    approvedClaims: 892,
    pendingClaims: 355,
    activeBeneficiaries: 3456,
    totalLandArea: 12500 // example value in acres
  };
  
  // Professional KPI Data
  const kpiMetrics = [
    {
      title: 'Total FRA Claims',
      value: '1,247',
      change: '+8.2%',
      trend: 'up',
      icon: <FaFileAlt className="h-6 w-6" />,
      color: 'from-blue-600 to-blue-700',
      description: 'Claims submitted this month'
    },
    {
      title: 'Verified Claims',
      value: '892',
      change: '+12.3%',
      trend: 'up',
      icon: <FaCheckCircle className="h-6 w-6" />,
      color: 'from-green-600 to-green-700',
      description: 'Successfully verified'
    },
    {
      title: 'Active Holders',
      value: '3,456',
      change: '+5.7%',
      trend: 'up',
      icon: <FaUsers className="h-6 w-6" />,
      color: 'from-purple-600 to-purple-700',
      description: 'Registered tribal holders'
    },
    {
      title: 'Processing Time',
      value: '18 days',
      change: '-15.2%',
      trend: 'down',
      icon: <FaClock className="h-6 w-6" />,
      color: 'from-orange-600 to-orange-700',
      description: 'Average processing time'
    }
  ];

  const quickActions: QuickAction[] = [
    {
      id: '1',
      title: 'Review Priority Claims',
      description: '23 high-priority claims awaiting review',
      icon: <FaExclamationTriangle className="h-5 w-5" />,
      action: 'review-claims',
      urgency: 'high'
    },
    {
      id: '2',
      title: 'Field Verification',
      description: '15 claims scheduled for verification',
      icon: <FaMapMarkerAlt className="h-5 w-5" />,
      action: 'field-verification',
      urgency: 'medium'
    },
    {
      id: '3',
      title: 'Generate Reports',
      description: 'Monthly analytics and compliance reports',
      icon: <FaChartLine className="h-5 w-5" />,
      action: 'generate-reports',
      urgency: 'low'
    },
    {
      id: '4',
      title: 'Task Management',
      description: '8 pending administrative tasks',
      icon: <FaTasks className="h-5 w-5" />,
      action: 'task-management',
      urgency: 'medium'
    }
  ];

  const recentActivity: ActivityItem[] = [
    {
      id: '1',
      type: 'Claim Approved',
      message: 'Claim FRA-2024-1156 approved for Ramesh Kumar, Bastar District',
      timestamp: '2 hours ago',
      priority: 'high',
      status: 'completed'
    },
    {
      id: '2',
      type: 'Document Verification',
      message: 'Land survey documents verified for 5 claims in Dantewada',
      timestamp: '4 hours ago',
      priority: 'medium',
      status: 'completed'
    },
    {
      id: '3',
      type: 'Field Survey',
      message: 'GPS mapping completed for community forest rights in Kanker',
      timestamp: '6 hours ago',
      priority: 'medium',
      status: 'in-progress'
    },
    {
      id: '4',
      type: 'System Alert',
      message: 'Bulk upload of 45 new claims from Sukma district',
      timestamp: '8 hours ago',
      priority: 'low',
      status: 'pending'
    }
  ];

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'review-claims':
        navigate('/state/claims?filter=priority');
        break;
      case 'field-verification':
        navigate('/state/verification');
        break;
      case 'generate-reports':
        navigate('/state/reports');
        break;
      case 'task-management':
        navigate('/state/tasks');
        break;
      default:
        break;
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'border-red-200 bg-red-50';
      case 'medium': return 'border-yellow-200 bg-yellow-50';
      case 'low': return 'border-green-200 bg-green-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#1B365D] mb-2">
                State Tribal Officer Dashboard
              </h1>
              <p className="text-gray-600 text-lg">
                Forest Rights Act (FRA) Claims Management System
              </p>
            </div>
            <div className="flex items-center space-x-3 mt-4 md:mt-0">
              <Button variant="outline" className="flex items-center space-x-2">
                <FaDownload className="h-4 w-4" />
                <span>Export Data</span>
              </Button>
              <Button className="bg-[#1B365D] hover:bg-[#0F1B2E] flex items-center space-x-2">
                <FaPlay className="h-4 w-4" />
                <span>Quick Actions</span>
              </Button>
            </div>
          </div>
        </div>

        {/* KPI Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpiMetrics.map((metric, index) => (
            <Card 
              key={index} 
              className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${metric.color} opacity-90`}></div>
              <div className="absolute inset-0 bg-black opacity-10 group-hover:opacity-5 transition-opacity"></div>
              <CardContent className="relative p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                    {metric.icon}
                  </div>
                  <div className="flex items-center space-x-1">
                    {metric.trend === 'up' ? (
                      <FaArrowUp className="h-3 w-3 text-green-200" />
                    ) : (
                      <FaArrowDown className="h-3 w-3 text-red-200" />
                    )}
                    <span className="text-sm font-medium">{metric.change}</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-1">{metric.value}</h3>
                  <p className="text-sm opacity-90 font-medium">{metric.title}</p>
                  <p className="text-xs opacity-75 mt-1">{metric.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Quick Actions Panel */}
          <div className="lg:col-span-1">
            <Card className="shadow-lg border-0">
              <CardHeader className="pb-3">
                <CardTitle className="text-xl font-semibold text-[#1B365D] flex items-center">
                  <FaClipboardList className="h-5 w-5 mr-2" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {quickActions.map((action) => (
                  <div
                    key={action.id}
                    className={`p-4 rounded-lg border cursor-pointer hover:shadow-md transition-all duration-200 ${getUrgencyColor(action.urgency)}`}
                    onClick={() => handleQuickAction(action.action)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <div className="p-2 bg-white rounded-lg shadow-sm">
                          {action.icon}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 text-sm mb-1">
                          {action.title}
                        </h4>
                        <p className="text-gray-600 text-xs leading-relaxed">
                          {action.description}
                        </p>
                        <Badge 
                          className={`mt-2 text-xs ${getPriorityBadge(action.urgency)}`}
                          variant="outline"
                        >
                          {action.urgency.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity Feed */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg border-0">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-semibold text-[#1B365D] flex items-center">
                    <FaBell className="h-5 w-5 mr-2" />
                    Recent Activity
                  </CardTitle>
                  <Button variant="outline" size="sm" className="text-xs">
                    <FaEye className="h-3 w-3 mr-1" />
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex-shrink-0">
                        <div className={`w-3 h-3 rounded-full mt-2 ${
                          activity.status === 'completed' ? 'bg-green-500' :
                          activity.status === 'in-progress' ? 'bg-yellow-500' :
                          'bg-gray-400'
                        }`}></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold text-gray-900 text-sm">
                            {activity.type}
                          </h4>
                          <Badge 
                            className={`text-xs ${getPriorityBadge(activity.priority)}`}
                            variant="outline"
                          >
                            {activity.priority}
                          </Badge>
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed mb-2">
                          {activity.message}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">{activity.timestamp}</span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            activity.status === 'completed' ? 'bg-green-100 text-green-800' :
                            activity.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {activity.status.replace('-', ' ').toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* System Modules Grid */}
        <Card className="shadow-lg border-0">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold text-[#1B365D]">
              System Modules & Tools
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  title: 'Claims Management',
                  description: 'Process and verify FRA claims',
                  icon: <FaFileAlt className="h-6 w-6" />,
                  path: '/state/claims',
                  color: 'bg-blue-500'
                },
                {
                  title: 'GIS Mapping',
                  description: 'Forest area mapping and verification',
                  icon: <FaMapMarkerAlt className="h-6 w-6" />,
                  path: '/state/gis',
                  color: 'bg-green-500'
                },
                {
                  title: 'Holder Management',
                  description: 'Tribal community database',
                  icon: <FaUsers className="h-6 w-6" />,
                  path: '/state/holders',
                  color: 'bg-purple-500'
                },
                {
                  title: 'Decision Support',
                  description: 'AI-powered recommendations',
                  icon: <FaBrain className="h-6 w-6" />,
                  path: '/state/dss',
                  color: 'bg-orange-500'
                }
              ].map((module, index) => (
                <div
                  key={index}
                  className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200 cursor-pointer group"
                  onClick={() => navigate(module.path)}
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <div className={`p-3 ${module.color} text-white rounded-lg group-hover:scale-105 transition-transform`}>
                      {module.icon}
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{module.title}</h3>
                  <p className="text-gray-600 text-sm">{module.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};
// REMOVE this duplicate return block entirely.
// The main return block is already present above and uses the correct 'stats' variable in scope.
// If you need to merge any UI from this block, move it into the main return above.
// Otherwise, just delete this block to resolve the error.

export default StateDashboard;