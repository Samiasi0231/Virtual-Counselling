import React, { useEffect, useState } from 'react';

const selfCareTips = [
  "🧘‍♀️ Take 5 minutes to breathe deeply and reset.",
  "💤 Prioritize at least 7 hours of sleep tonight.",
  "📝 Write down 3 things you're grateful for.",
  "🌿 Step outside and get some fresh air.",
  "📵 Disconnect from screens for 30 minutes today.",
  "🚶‍♂️ Stretch or take a short walk between tasks.",
  "🧠 Speak kindly to yourself — you’re doing your best.",
];

const SelfCareTips = () => {
  const [tip, setTip] = useState('');
  const [today, setToday] = useState(new Date().getDate());

  useEffect(() => {
    const updateTip = () => {
      const currentDay = new Date().getDate();
      const index = currentDay % selfCareTips.length;
      setTip(selfCareTips[index]);
      setToday(currentDay);
    };

    updateTip(); // initial load

    const interval = setInterval(() => {
      const now = new Date().getDate();
      if (now !== today) {
        updateTip();
      }
    }, 1000 * 60); // check every minute

    return () => clearInterval(interval);
  }, [today]);

  return (
 <div className="flex p-4 flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
 
      <h3 className=" p-4 text-lg font-semibold text-purple-700 mb-3">   Self-Care Tip of the Day</h3>
      <div className="bg-purple-50 p-4 rounded-md text-purple-900 text-sm font-medium">
        {tip}
      </div>

      <p className="text-2xl text-gray-500 mt-2 ">
        A small step toward your well-being.
      </p>
    </div>
  );
};

export default SelfCareTips;
