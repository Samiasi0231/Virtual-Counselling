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
     <div className="flex flex-row gap-6 col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
      <h2 className="text-xl font-semibold text-gray-800">
         Self-Care Tip of the Day
      </h2>

      <div className="bg-purple-50 p-4 rounded-md text-purple-900 text-sm font-medium">
        {tip}
      </div>

      <p className="text-xs text-gray-500 mt-2 italic">
        A small step toward your well-being.
      </p>
    </div>
  );
};

export default SelfCareTips;
