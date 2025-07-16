import React from 'react';

const ContainerSkeletonRow = () => (
    <tr className="animate-pulse">
        {Array.from({ length: 10}).map((__dirname, idx) => (
            <td key={idx} className="py-4 px-6">
                <div className="h-5 bg-gray-100 rounded w-full"></div>
            </td>
        ))}
    </tr>
);

export default ContainerSkeletonRow;