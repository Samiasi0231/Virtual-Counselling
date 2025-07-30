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

    updateTip();

    const interval = setInterval(() => {
      const now = new Date().getDate();
      if (now !== today) {
        updateTip();
      }
    }, 1000 * 60); 

    return () => clearInterval(interval);
  }, [today]);

  return (
 <div className="flex p-4 flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
 
      <h3 className=" p-4 text-wrap text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">💜
  Self-Care Tip of the Day</h3>
      <h3 className="text-sm sm:text-base text-purple-700 dark:text-gray-300 leading-relaxed">
        {tip}
      </h3>

      <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300  leading-relaxed">
        A small step toward your well-being.
      </p>
    </div>
  );
};

export default SelfCareTips;
