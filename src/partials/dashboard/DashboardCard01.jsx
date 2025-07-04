import React from 'react';
import { Link } from 'react-router-dom';


import { adjustColorOpacity, getCssVariable } from '../../utils/Utils';

function DashboardCard01() {



  return (
    <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-xs rounded-xl p-2">
      <div className="px-5 pt-5">
        <header className="flex justify-between items-start mb-2">
          <h2 className="text-lg font-semibold text-purple-800 dark:text-gray-100 mb-2"> Welcome, Name..</h2>
        </header>
        <h3>
We’re grateful to have you here.
Your presence means support, guidance, and hope for every student who reaches out.
</h3>
      </div>
    </div>
  );
}

export default DashboardCard01;
