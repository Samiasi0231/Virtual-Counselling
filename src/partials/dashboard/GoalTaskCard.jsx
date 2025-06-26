













import React, { useState, useEffect } from 'react';
import axiosClient from '../../utils/axios-client-analytics';
import dayjs from 'dayjs';

const categoryColors = {
  Emotional: 'bg-pink-100 text-pink-800',
  Academic: 'bg-blue-100 text-blue-800',
  Physical: 'bg-green-100 text-green-800',
};

const GoalsTasksCard = () => {
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState('');
  const [category, setCategory] = useState('Emotional');
  const [filterCategory, setFilterCategory] = useState('All');
  const [editingGoalId, setEditingGoalId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const res = await axiosClient.get('/vpc/goals');
        const data = Array.isArray(res.data) ? res.data : res.data.goals || [];
        setGoals(data);
      } catch (err) {
        console.error('Error fetching goals:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGoals();
  }, []);

  const addGoal = async () => {
    if (newGoal.trim() === '') return;
    try {
      const res = await axiosClient.post('/vpc/goals', {
        text: newGoal.trim(),
        category,
        createdAt: new Date().toISOString(),
      });
      setGoals((prev) => [...prev, res.data]);
      setNewGoal('');
    } catch (err) {
      console.error('Error adding goal:', err);
    }
  };

  const toggleGoal = async (id, completed) => {
    try {
      await axiosClient.put(`/vpc/goals/${id}`, { completed: !completed });
      setGoals((prev) =>
        prev.map((goal) =>
          goal.id === id ? { ...goal, completed: !goal.completed } : goal
        )
      );
    } catch (err) {
      console.error('Error updating goal:', err);
    }
  };

  const deleteGoal = async (id) => {
    try {
      await axiosClient.delete(`/vpc/goals/${id}`);
      setGoals((prev) => prev.filter((goal) => goal.id !== id));
    } catch (err) {
      console.error('Error deleting goal:', err);
    }
  };

  const saveEditedGoal = async () => {
    try {
      await axiosClient.put(`/vpc/goals/${editingGoalId}`, { text: editingText });
      setGoals((prev) =>
        prev.map((goal) =>
          goal.id === editingGoalId ? { ...goal, text: editingText } : goal
        )
      );
      setEditingGoalId(null);
      setEditingText('');
    } catch (err) {
      console.error('Error saving goal:', err);
    }
  };

  const filteredGoals = goals
    .filter((goal) => filterCategory === 'All' || goal.category === filterCategory)
    .sort((a, b) => a.completed - b.completed);

  const completedCount = filteredGoals.filter((goal) => goal.completed).length;
  const totalCount = filteredGoals.length;

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-xs rounded-xl p-5">
      <h2 className="text-xl font-semibold text-purple-800 mb-2">🎯 Personal Goals Tracker</h2>

      {/* Filter and Progress */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2">
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="border px-2 py-1 rounded text-sm"
        >
          <option value="All">All Categories</option>
          <option value="Emotional">Emotional</option>
          <option value="Academic">Academic</option>
          <option value="Physical">Physical</option>
        </select>
        <span className="text-xs text-gray-600 dark:text-gray-300">
          {completedCount} of {totalCount} completed
        </span>
      </div>

      {/* Goal List */}
      {loading ? (
        <p className="text-sm text-gray-500">Loading goals...</p>
      ) : filteredGoals.length === 0 ? (
        <p className="text-sm text-gray-500">No goals available.</p>
      ) : (
        <ul className="space-y-3 text-sm text-gray-800 dark:text-gray-200 mb-4">
          {filteredGoals.map((goal) => (
            <li key={goal.id} className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg shadow-sm">
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    checked={goal.completed}
                    onChange={() => toggleGoal(goal.id, goal.completed)}
                    className="mt-1 accent-purple-700"
                  />
                  {editingGoalId === goal.id ? (
                    <input
                      type="text"
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && saveEditedGoal()}
                      className="border px-2 py-1 text-sm rounded"
                    />
                  ) : (
                    <span className={goal.completed ? 'line-through text-gray-500' : ''}>
                      {goal.text}
                    </span>
                  )}
                </div>
                <div className="text-xs text-gray-500">
                  {goal.createdAt && dayjs(goal.createdAt).format('MMM D')}
                </div>
              </div>
              <div className="flex justify-between items-center mt-2 text-xs">
                <span
                  className={`px-2 py-1 rounded-full font-medium ${categoryColors[goal.category] || 'bg-gray-200'}`}
                >
                  {goal.category}
                </span>
                <div className="flex gap-2">
                  {editingGoalId === goal.id ? (
                    <>
                      <button onClick={saveEditedGoal} className="text-green-600 hover:underline">Save</button>
                      <button onClick={() => setEditingGoalId(null)} className="text-gray-500 hover:underline">Cancel</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => { setEditingGoalId(goal.id); setEditingText(goal.text); }} className="hover:underline text-purple-600">Edit</button>
                      <button onClick={() => deleteGoal(goal.id)} className="hover:underline text-red-600">Delete</button>
                    </>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Add Goal */}
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={newGoal}
          onChange={(e) => setNewGoal(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addGoal()}
          placeholder="Describe your goal..."
          className="flex-1 border px-3 py-2 text-sm rounded focus:outline-none focus:ring-2 focus:ring-purple-600"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border px-2 py-2 rounded text-sm"
        >
          <option value="Emotional">Emotional</option>
          <option value="Academic">Academic</option>
          <option value="Physical">Physical</option>
        </select>
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
