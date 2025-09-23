import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin } from 'lucide-react';

interface DistrictData {
  district: string;
  forestCover: number;
  tribalPopulation: number;
  fraClaimsApproved: number;
  fraClaimsTotal: number;
  schemeUtilization: number;
  complaintsResolved: number;
  totalComplaints: number;
}

interface PerformanceMatrixProps {
  districtData: DistrictData[];
}

const PerformanceMatrix: React.FC<PerformanceMatrixProps> = ({ districtData }) => {
  const getColorClass = (value: number, type: 'percentage' | 'count' | 'reverse') => {
    if (type === 'reverse') {
      // For complaints (lower is better)
      return value < 50 ? 'bg-green-100 text-green-800' : 
             value < 100 ? 'bg-yellow-100 text-yellow-800' : 
             'bg-red-100 text-red-800';
    }
    
    if (type === 'percentage') {
      return value > 75 ? 'bg-green-100 text-green-800' : 
             value > 50 ? 'bg-yellow-100 text-yellow-800' : 
             'bg-red-100 text-red-800';
    }
    
    return 'bg-gray-100 text-gray-800';
  };

  const getOverallScore = (district: DistrictData) => {
    const fraApproval = (district.fraClaimsApproved / district.fraClaimsTotal * 100);
    const complaintResolution = (district.complaintsResolved / district.totalComplaints * 100);
    return (fraApproval + district.schemeUtilization + complaintResolution) / 3;
  };

  return (
    <Card className="shadow-sm border-gray-200">
      <CardHeader>
        <CardTitle className="flex items-center text-lg font-semibold text-gov-primary">
          <MapPin className="w-5 h-5 mr-2 text-gov-secondary" />
          District Performance Matrix
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">District</th>
                <th className="text-center py-3 px-4 font-semibold text-sm text-gray-700">Forest Cover</th>
                <th className="text-center py-3 px-4 font-semibold text-sm text-gray-700">Tribal Pop</th>
                <th className="text-center py-3 px-4 font-semibold text-sm text-gray-700">FRA Approval</th>
                <th className="text-center py-3 px-4 font-semibold text-sm text-gray-700">Scheme Util</th>
                <th className="text-center py-3 px-4 font-semibold text-sm text-gray-700">Complaints</th>
                <th className="text-center py-3 px-4 font-semibold text-sm text-gray-700">Resolution</th>
                <th className="text-center py-3 px-4 font-semibold text-sm text-gray-700">Score</th>
              </tr>
            </thead>
            <tbody>
              {districtData.map((district) => {
                const fraApproval = (district.fraClaimsApproved / district.fraClaimsTotal * 100);
                const complaintResolution = (district.complaintsResolved / district.totalComplaints * 100);
                const score = getOverallScore(district);
                
                return (
                  <tr key={district.district} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-900">{district.district}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        getColorClass(district.forestCover, 'percentage')
                      }`}>
                        {district.forestCover.toFixed(1)}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        getColorClass(district.tribalPopulation, 'percentage')
                      }`}>
                        {district.tribalPopulation.toFixed(1)}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        getColorClass(fraApproval, 'percentage')
                      }`}>
                        {fraApproval.toFixed(1)}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        getColorClass(district.schemeUtilization, 'percentage')
                      }`}>
                        {district.schemeUtilization.toFixed(1)}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        getColorClass(district.totalComplaints, 'reverse')
                      }`}>
                        {district.totalComplaints}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        getColorClass(complaintResolution, 'percentage')
                      }`}>
                        {complaintResolution.toFixed(1)}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Badge variant={score > 75 ? "default" : score > 60 ? "secondary" : "destructive"}>
                        {score.toFixed(0)}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceMatrix;