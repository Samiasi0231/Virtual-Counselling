import React from "react";

const assignedGoals = [
  {
    id: 1,
    student: "Jane Doe",
    goal: "Complete weekly journal entries",
    progress: 80,
  },
  {
    id: 2,
    student: "John Smith",
    goal: "Practice breathing exercises daily",
    progress: 45,
  },
  {
    id: 3,
    student: "Grace Adams",
    goal: "Attend all group sessions this month",
    progress: 100,
  },
];

const AssignedGoalsOverview = () => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
        🟢 Assigned Goals Overview
      </h2>

      {assignedGoals.length === 0 ? (
        <p className="text-gray-500">No assigned goals available.</p>
      ) : (
        <ul className="space-y-4">
          {assignedGoals.map((goal) => (
            <li
              key={goal.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition"
            >
              <div className="flex justify-between items-center mb-2">
                <div>
                  <p className="font-medium text-gray-700">{goal.student}</p>
                  <p className="text-sm text-gray-500">{goal.goal}</p>
                </div>
                <span className="text-sm text-gray-600">
                  {goal.progress}%
                </span>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full ${
                    goal.progress === 100
                      ? "bg-green-600"
                      : "bg-blue-500"
                  }`}
                  style={{ width: `${goal.progress}%` }}
                ></div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AssignedGoalsOverview;
