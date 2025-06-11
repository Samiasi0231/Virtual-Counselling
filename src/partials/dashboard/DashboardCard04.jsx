
// Import utilities
import { getCssVariable } from '../../utils/Utils';

function DashboardCard04() {


  return (
    <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
      <div className="px-5 pt-5">
        <header className="flex justify-between items-start mb-2">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Appointment</h2>
        </header>
   <div className=" p-4 mb-3 flex flex-col gap-3">
  {/* Achieved */}
  <div className="flex justify-between items-center">
    <h3 className="text-sm text-gray-600 font-medium">Achieved</h3>
    <span className="text-lg font-semibold text-green-600">25</span>
  </div>

  {/* Upcoming Session */}
  <div className="text-sm text-gray-700">
    <h3 className="font-medium">Upcoming</h3>
    <p className="mt-1">🕒 <span className="font-semibold">3:00 PM</span></p>
    <p>📅 <span className="font-semibold">12th June 2025</span></p>
  </div>
</div>

      </div>
    </div>
  );
}

export default DashboardCard04;
