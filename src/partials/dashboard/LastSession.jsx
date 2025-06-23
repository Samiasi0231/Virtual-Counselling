import React from 'react';

const LastSessionCard = () => {
  const summary = {
    sessionDate: 'June 10, 2025',
    counselor: 'Dr. Amanda Blake',
    notes: 'Discussed exam anxiety and study habits. Student showed increased openness about academic pressure.',
    goals: [
      'Implement 2-hour study blocks using Pomodoro technique',
      'Reflect daily using mood tracker',
      'Reach out if overwhelmed before finals',
    ],
  };

  return (
   <div className="flex flex-col gap-4 p-4 col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
      <h2 className="text-lg font-semibold text-purple-800">
        📝 Last Session Summary
      </h2>


      <div className="text-sm text-gray-700 space-y-2">
        <p>
          <span className="font-medium">Date:</span> {summary.sessionDate}
        </p>
        <p>
          <span className="font-medium">Counselor:</span> {summary.counselor}
        </p>
        <p>
          <span className="font-medium">Session Notes:</span> <br />
          <span className="text-gray-800 italic">{summary.notes}</span>
        </p>
        <div>
          <span className="font-medium">Goals & Actions:</span>
          <ul className="list-disc list-inside mt-1 text-gray-800">
            {summary.goals.map((goal, idx) => (
              <li key={idx}>{goal}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LastSessionCard;
