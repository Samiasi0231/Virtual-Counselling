import React, { useState } from 'react';
import FilterButton from '../components/DropdownFilter';
import Datepicker from '../components/Datepicker';
import DashboardCard01 from '../partials/dashboard/DashboardCard01';
import DashboardCard02 from '../partials/dashboard/DashboardCard02';
import DashboardCard03 from '../partials/dashboard/DashboardCard03';
 import DashboardCard04 from '../partials/dashboard/DashboardCard04';
import DashboardCard10 from '../partials/dashboard/DashboardCard10';
import DashboardCard05 from '../partials/dashboard/DashboardCared05';



import Banner from '../layout/Banner';
import SelfCareTips from './users/SelfCareTips';
// import UpcomingSession from '../partials/dashboard/UpcomingSection';
import LastSession from '../partials/dashboard/LastSession';

function Dashboard() {

  return (
    <>
        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">

            {/* Dashboard actions */}
            <div className="sm:flex sm:justify-between sm:items-center mb-8">

              {/* Left: Title */}
              <div className="mb-4 sm:mb-0">
                <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">Dashboard</h1>
              </div>

              {/* Right: Actions */}
              <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
                {/* Filter button */}
                <FilterButton align="right" />
                {/* Datepicker built with React Day Picker */}
                <Datepicker align="right" />
                {/* Add view button */}
                <button className="btn bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white">
                  <svg className="fill-current shrink-0 xs:hidden" width="16" height="16" viewBox="0 0 16 16">
                    <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
                  </svg>
                  <span className="max-xs:sr-only">Add View</span>
                </button>                
              </div>

            </div>

            {/* Cards counselling */}
            <div className="grid grid-cols-12 gap-6">
              {/* Line chart (welocme counsellor) */}
              <DashboardCard01 />
              {/* Line chart (message info) */}
              <DashboardCard02 />
              {/* Line chart (active user) */}
              <DashboardCard03 />
             
                  {/* (Studentmood) */}
              {/*  (GroupEventPlanner) */}
               <DashboardCard05 />

               
              {/* Cards students  */}
             {/* (SelfCareTips) */}
                <SelfCareTips />
                {/* (UpcomingSession) */}
                {/* <UpcomingSession /> */}
                  {/* (UpcomingSession) */}
                <LastSession />
              {/* Card (Customers) */}
              <DashboardCard10 />   
    {/* (TodaysAppointments) */}
               <DashboardCard04 /> 
            </div>

          </div>
        </main>

        <Banner />
        </>
  );
}

export default Dashboard;