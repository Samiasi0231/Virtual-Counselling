import React from 'react';
import { Link } from 'react-router-dom';
import LineChart from '../../charts/LineChart01';
import { chartAreaGradient } from '../../charts/ChartjsConfig';
import EditMenu from '../../components/DropdownEditMenu';

// Import utilities
import { adjustColorOpacity, getCssVariable } from '../../utils/Utils';

function DashboardCard02() {


  return (
    <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
      <div className="px-5 pt-5">
        <header className="flex justify-between items-start mb-2">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Messsages</h2>
        </header>
   <div className="flex gap-12 mb-4">
  {/* Read Card */}
  <div className="flex flex-col items-center justify-center w-24 h-24 border rounded shadow bg-white">
    <h3 className="text-sm text-gray-700">Read</h3>
    <h1 className="text-2xl font-bold text-blue-600">29</h1>
  </div>

  {/* Unread Card */}
  <div className="flex flex-col items-center justify-center w-24 h-24 border rounded shadow bg-white">
    <h3 className="text-sm text-gray-700">Unread</h3>
    <h1 className="text-2xl font-bold text-red-500">12</h1>
  </div>
</div>

      </div>
    </div>
  );
}

export default DashboardCard02;
