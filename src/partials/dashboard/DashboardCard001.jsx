import React from 'react';
import { Link } from 'react-router-dom';
import LineChart from '../../charts/LineChart01';
import { chartAreaGradient } from '../../charts/ChartjsConfig';
import EditMenu from '../../components/DropdownEditMenu';

// Import utilities
import { adjustColorOpacity, getCssVariable } from '../../utils/Utils';

function DashboardCard001() {



  return (
    <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
      <div className="px-5 pt-5">
        <header className="flex justify-between items-start mb-2">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Hi asi! 👋 Welcome.</h2>
        </header>
        <h3>
We're glad you're here.
Whether you're looking for support, guidance, or just someone to talk to
you're not alone.
Take your time, explore at your own pace, and reach out when you're ready.
Your journey to healing starts here. 💬</h3>
      </div>
    </div>
  );
}

export default DashboardCard001;