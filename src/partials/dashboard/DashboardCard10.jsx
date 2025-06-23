import React from 'react';

import Image01 from '../../images/user-36-05.jpg';
import Image02 from '../../images/user-36-06.jpg';
import Image03 from '../../images/user-36-07.jpg';
import Image04 from '../../images/user-36-08.jpg';
import Image05 from '../../images/user-36-09.jpg';

function DashboardCard10() {

  const customers = [
    {
      id: '0',
      
      name: 'Alex Shatov',
      email: 'alexshatov@gmail.com',
      location: '🇺🇸',
    },
    {
      id: '1',
      
      name: 'Philip Harbach',
      email: 'philip.h@gmail.com',
      location: '🇩🇪',
    
    },
    {
      id: '2',
      name: 'Mirko Fisuk',
      email: 'mirkofisuk@gmail.com',
      location: '🇫🇷',
      
    },
    {
      id: '3',
      name: 'Olga Semklo',
      email: 'olga.s@cool.design',
      location: '🇮🇹',
    
    },
    {
      id: '4',
    
      name: 'Burak Long',
      email: 'longburak@gmail.com',
      location: '🇬🇧',
    
    },
  ];

  return (
    <div className="col-span-full xl:col-span-6 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <h2 className="text-lg font-semibold text-purple-800 dark:text-gray-100">Counsellors</h2>
      </header>      
   <div className="p-3">
  <div className="overflow-x-auto">
    <table className="table-auto w-full">
      {/* Table header */}
      <thead className="text-xs  uppercase text-lg font-semibold text-purple-800 dark:text-gray-500 bg-gray-50 dark:bg-gray-700/50">
        <tr>
          <th className="p-2 text-left">Name</th>
          <th className="p-2 text-left">Email</th>
          <th className="p-2 text-center">Country</th>
        </tr>
      </thead>

      {/* Table body */}
      <tbody className="text-sm divide-y divide-gray-100 dark:divide-gray-700/60">
        {customers.map((customer) => (
          <tr key={customer.id}>
            <td className="p-2 whitespace-nowrap">
              <div className="flex items-center">
                <div className="w-10 h-10 shrink-0 mr-3">
                  <img
                    className="rounded-full"
                    src={customer.image}
                    width="40"
                    height="40"
                    alt={customer.name}
                  />
                </div>
                <div className="font-medium text-gray-800 dark:text-gray-100">
                  {customer.name}
                </div>
              </div>
            </td>
            <td className="p-2 whitespace-nowrap">
              <div className="text-left">{customer.email}</div>
            </td>
            <td className="p-2 whitespace-nowrap">
              <div className="text-center font-medium text-green-600">
                {customer.location}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

    </div>
  );
}

export default DashboardCard10;
