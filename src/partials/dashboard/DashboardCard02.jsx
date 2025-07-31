
 import React, { useEffect, useState } from "react";

const counsellorTips = [
"🤝 Take a moment to reflect on a positive session today.",
  "📚 Read one paragraph from a psychology article or book.",
  "📅 Review your upcoming appointments and prepare notes.",
  "💬 Practice active listening in all conversations.",
  "🧠 Remember: holding space is as important as offering advice.",
  "🎧 Listen to calming music before your first session.",
  "📝 Jot down one thing you’ve learned from a client this week.",
];

function DashboardCard02() {

 const [tip, setTip] = useState('');
  const [today, setToday] = useState(new Date().getDate());


    useEffect(() => {
    const updateTip = () => {
      const currentDay = new Date().getDate();
      const index = currentDay % counsellorTips.length;
      setTip(counsellorTips[index]);
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
        <div className="px-5 pt-5">
         <header className="flex justify-between items-start mb-2">
        <h2 className="text-base font-serif sm:text-lg font-light text-gray-500 dark:text-gray-100 mb-2">
        Counsellor Tip of the Day
      </h2>
      </header>
      <p className="font-sans text-sm sm:text-base text-purple-400 dark:text-gray-300 leading-relaxed">
        {tip}
      </p>
   <p className="font-sans text-sm sm:text-base text-gray-400 dark:text-gray-300 leading-relaxed">
        A moment to reflect and grow in your practice.
      </p>
</div>
    </div>
  );
}

export default DashboardCard02;
