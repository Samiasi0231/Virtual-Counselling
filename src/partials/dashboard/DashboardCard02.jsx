
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
    <div className="flex flex-wrap gap-6 col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-xs rounded-xl p-4">
      
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
        Counsellor Tip of the Day
      </h2>
      <div className="rounded text-purple-800  text-sm font-medium">
        {tip}
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400 italic">
        A moment to reflect and grow in your practice.
      </p>

    </div>
  );
}

export default DashboardCard02;
