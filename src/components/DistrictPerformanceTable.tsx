import React from 'react';

type DistrictPerformanceProps = {
    data: { name: string; claimsApproved: number; totalClaims: number }[];
};

const DistrictPerformanceTable: React.FC<DistrictPerformanceProps> = ({ data }) => {
    return (
        <table className="min-w-full table-auto">
            <thead>
                <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                    <th className="py-3 px-6 text-left">District</th>
                    <th className="py-3 px-6 text-left">Claims Approved</th>
                    <th className="py-3 px-6 text-left">Total Claims</th>
                </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
                {data.map((item, index) => (
                    <tr key={index} className="border-b border-gray-200 hover:bg-gray-100">
                        <td className="py-3 px-6 text-left whitespace-nowrap">{item.name}</td>
                        <td className="py-3 px-6 text-left">{item.claimsApproved}</td>
                        <td className="py-3 px-6 text-left">{item.totalClaims}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default DistrictPerformanceTable;