import React, { useState } from 'react';

const moods = [
  { emoji: '😄', label: 'Happy' },
  { emoji: '🙂', label: 'Okay' },
  { emoji: '😐', label: 'Neutral' },
  { emoji: '😕', label: 'Stressed' },
  { emoji: '😢', label: 'Sad' },
];

const MoodCheckIn = () => {
  const [selectedMood, setSelectedMood] = useState(null);

  const handleMoodClick = (mood) => {
    setSelectedMood(mood.label);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-5 w-full max-w-md">
      <h2 className="text-lg font-semibold text-purple-800 mb-3">
        😊 Today's Mood Check-in
      </h2>

      <p className="text-sm text-gray-600 mb-4">
        How are you feeling today? Choose the emoji that best represents your mood.
      </p>

      <div className="flex justify-between items-center gap-3 mb-4">
        {moods.map((mood) => (
          <button
            key={mood.label}
            onClick={() => handleMoodClick(mood)}
            className={`text-2xl transition transform hover:scale-110 ${
              selectedMood === mood.label
                ? 'ring-2 ring-purple-600 rounded-full'
                : ''
            }`}
            title={mood.label}
          >
            {mood.emoji}
          </button>
        ))}
      </div>

      {selectedMood && (
        <div className="text-sm text-gray-700">
          You selected: <span className="font-medium">{selectedMood}</span>
        </div>
      )}
    </div>
  );
};

export default MoodCheckIn;
