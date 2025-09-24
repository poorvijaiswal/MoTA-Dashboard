import React from 'react';

type MetricCardProps = {
    title: string;
    value: number | string;
    bgColor?: string;
    bgGradient?: string;
};

const MetricCard: React.FC<MetricCardProps> = ({ title, value, bgColor, bgGradient }) => {
    return (
        <div className={`p-6 rounded-xl shadow-lg text-white ${bgColor || ''} ${bgGradient || ''}`}>
            <h3 className="text-lg font-medium">{title}</h3>
            <p className="mt-2 text-4xl font-bold">{value}</p>
        </div>
    );
};

export default MetricCard;