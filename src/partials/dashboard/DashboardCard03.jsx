import React from 'react';
import { Link } from 'react-router-dom';
import LineChart from '../../charts/LineChart01';
import { chartAreaGradient } from '../../charts/ChartjsConfig';
import EditMenu from '../../components/DropdownEditMenu';

// Import utilities
import { adjustColorOpacity, getCssVariable } from '../../utils/Utils';

function DashboardCard03() {



  return (
    <div className="flex flex-row gap-6 col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
      <div className="px-5 pt-5">
        <header className="flex justify-between items-start mb-2">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Active Users</h2>
        </header>
      <div className="flex flex-col items-center justify-center w-40 h-50 border rounded shadow bg-white">
    <h3 className="text-sm text-gray-700">Activer User</h3>
    <h1 className="text-2xl font-bold text-blue-600">120</h1>
  </div>
      </div>

        <div className="px-5 pt-5">
        <header className="flex justify-between items-start mb-2">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">All users</h2>
        </header>
             <div className="flex flex-col items-center justify-center w-40 h-50 border rounded shadow bg-white">
    <h3 className="text-sm text-gray-700">All User</h3>
    <h1 className="text-2xl font-bold text-blue-600">300</h1>
  </div>
      </div>
    </div>
  );
}

export default DashboardCard03;
