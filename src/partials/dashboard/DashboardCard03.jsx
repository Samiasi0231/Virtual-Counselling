import React from 'react';
import { Link } from 'react-router-dom';
import LineChart from '../../charts/LineChart01';
import { chartAreaGradient } from '../../charts/ChartjsConfig';
import EditMenu from '../../components/DropdownEditMenu';
import { adjustColorOpacity, getCssVariable } from '../../utils/Utils';

function DashboardCard03() {
  return (
    <div className="flex flex-wrap gap-6 col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-xs rounded-xl p-4">
      
      {/* Active Users */}
      <div className="flex-1 min-w-[150px] flex flex-col items-center justify-center border rounded shadow bg-white p-4">
        <h2 className="text-lg font-semibold text-purple-800 dark:text-gray-100 mb-2">Active Users</h2>
        <h1 className="text-2xl font-bold text-blue-600">120</h1>
      </div>

      {/* All Users */}
      <div className="flex-1 min-w-[150px] flex flex-col items-center justify-center border rounded shadow bg-white p-4">
        <h2 className="text-lg font-semibold text-purple-800 dark:text-gray-100 mb-2">All Users</h2>
      
        <h1 className="text-2xl font-bold text-blue-600">300</h1>
      </div>

    </div>
  );
}

export default DashboardCard03;
