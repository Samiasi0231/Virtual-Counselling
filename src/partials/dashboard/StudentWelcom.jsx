import React from 'react';
import { useStateValue } from '../../Context/UseStateValue';

function StudentWelcome() {
  const [{ student }] = useStateValue(); 

  return (
 <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
  <div className="px-5 pt-5">
    <header className="flex justify-between items-start mb-2">
      <h2 className="text-base font-serif sm:text-lg font-light text-gray-500 dark:text-gray-100 mb-2">
        {student ? `Hi, ${student?.lastname || 'User'}` : 'Loading...'}
      </h2>
    </header>
    <p className="font-sans text-sm sm:text-base text-gray-400 dark:text-gray-300 leading-relaxed">
      We're glad you're here. Whether you're looking for support, guidance, or just someone to talk to,
      you're not alone. Take your time, explore at your own pace, and reach out when you're ready.
      Your journey to healing starts here.
    </p>
  </div>
</div>

  );
}

export default StudentWelcome;
