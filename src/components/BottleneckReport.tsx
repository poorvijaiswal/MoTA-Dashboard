import React from 'react';

type BottleneckItem = {
    name: string;
    delay: number;
};

type BottleneckReportProps = {
    data: BottleneckItem[];
};

const BottleneckReport: React.FC<BottleneckReportProps> = ({ data }) => {
    return (
        <div className="h-64 overflow-y-auto">
            <ul className="space-y-4">
                {data.map((item, index) => (
                    <li key={index} className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
                        <span className="font-medium text-gray-700">{item.name}</span>
                        <span className="text-red-500 font-bold">{item.delay}% delay</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default BottleneckReport;