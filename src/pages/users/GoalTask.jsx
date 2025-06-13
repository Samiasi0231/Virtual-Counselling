import React, { useState } from 'react';

const GoalsTasksCard = () => {
  const [goals, setGoals] = useState([
    { id: 1, text: 'Practice mindfulness for 5 minutes daily', completed: false },
    { id: 2, text: 'Write in journal three times this week', completed: false },
    { id: 3, text: 'Attend next group session on stress management', completed: false },
  ]);
  const [newGoal, setNewGoal] = useState('');

  const toggleGoal = (id) => {
    setGoals((prev) =>
      prev.map((goal) =>
        goal.id === id ? { ...goal, completed: !goal.completed } : goal
      )
    );
  };

  const addGoal = () => {
    if (newGoal.trim() === '') return;
    const newTask = {
      id: goals.length + 1,
      text: newGoal.trim(),
      completed: false,
    };
    setGoals((prev) => [...prev, newTask]);
    setNewGoal('');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-5 w-full max-w-md">
      <h2 className="text-lg font-semibold text-purple-800 mb-3">
        ✅ Goals & Tasks
      </h2>

      {/* List */}
      <ul className="space-y-2 text-sm text-gray-800 mb-4">
        {goals.map((goal) => (
          <li key={goal.id} className="flex items-start gap-2">
            <input
              type="checkbox"
              checked={goal.completed}
              onChange={() => toggleGoal(goal.id)}
              className="mt-1 accent-purple-700"
            />
            <span className={goal.completed ? 'line-through text-gray-500' : ''}>
              {goal.text}
            </span>
          </li>
        ))}
      </ul>

      {/* Add new goal */}
      <div className="flex gap-2">
        <input
          type="text"
          value={newGoal}
          onChange={(e) => setNewGoal(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addGoal()}
          placeholder="Add a new goal..."
          className="flex-1 border px-3 py-2 text-sm rounded focus:outline-none focus:ring-2 focus:ring-purple-600"
        />
        <button
          onClick={addGoal}
          className="bg-purple-700 text-white px-4 py-2 rounded text-sm hover:bg-purple-900"
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default GoalsTasksCard;
