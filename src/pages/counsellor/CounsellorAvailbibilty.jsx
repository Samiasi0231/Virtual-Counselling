import React, { useState, useEffect } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';


const MOCK_AVAILABILITY = {
  '2025-07-03': ['09:00 AM', '11:00 AM'],
  '2025-07-05': ['10:00 AM'],
};

const CounselorAvailability = () => {
  const [availability, setAvailability] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [newTimeSlot, setNewTimeSlot] = useState('');
  const [message, setMessage] = useState('');

  // Load mock availability on mount
  useEffect(() => {
    setAvailability(MOCK_AVAILABILITY);
  }, []);

  const getFormattedDate = (date) =>
    date ? date.toISOString().split('T')[0] : null;

  const handleAddTimeSlot = () => {
    if (!selectedDate || !newTimeSlot) return;

    const key = getFormattedDate(selectedDate);
    const existing = availability[key] || [];
    if (existing.includes(newTimeSlot)) {
      setMessage(' Slot already added.');
      return;
    }

    const updated = {
      ...availability,
      [key]: [...existing, newTimeSlot],
    };
    setAvailability(updated);
    setNewTimeSlot('');
    setMessage('✅ Slot added.');
  };

  const handleRemoveSlot = (slot) => {
    const key = getFormattedDate(selectedDate);
    const updated = {
      ...availability,
      [key]: availability[key].filter((t) => t !== slot),
    };
    setAvailability(updated);
    setMessage('Slot removed.');
  };

  const selectedDateKey = getFormattedDate(selectedDate);
  const slots = availability[selectedDateKey] || [];

  const modifiers = {
    hasSlots: Object.keys(availability).map((date) => new Date(date)),
  };

  const modifiersClassNames = {
    hasSlots: 'bg-blue-200 text-blue-900 font-semibold',
  };

  return (
   <div className="w-full max-w-5xl mx-auto p-6 bg-white shadow-md border border-gray-200 rounded-xl">
  <h2 className="text-2xl font-bold text-gray-800 mb-4">📅 Manage Availability</h2>

  {/* Calendar */}
  <div className="mb-6">
    <DayPicker
      mode="single"
      selected={selectedDate}
      onSelect={setSelectedDate}
      modifiers={modifiers}
      modifiersClassNames={modifiersClassNames}
    />
    <p className="text-sm text-gray-500 mt-2">
      🔵 Dates in blue already have time slots
    </p>
  </div>

  {/* Time Slot Editor */}
  {selectedDate && (
    <div className="mb-6">
      <h3 className="text-lg font-medium text-gray-700 mb-2">
        Set availability for {selectedDate.toDateString()}
      </h3>

      {/* Existing Slots */}
      <div className="mb-3">
        <p className="text-sm text-gray-600 mb-1">Current slots:</p>
        {slots.length > 0 ? (
          <ul className="list-disc list-inside space-y-1">
            {slots.map((slot) => (
              <li key={slot} className="flex justify-between items-center">
                <span>{slot}</span>
                <button
                  className="text-red-500 text-sm hover:underline"
                  onClick={() => handleRemoveSlot(slot)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-400">No slots set yet.</p>
        )}
      </div>

      {/* Add New Slot */}
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={newTimeSlot}
          onChange={(e) => setNewTimeSlot(e.target.value)}
          placeholder="e.g. 02:00 PM"
          className="border border-gray-300 px-3 py-2 rounded w-40"
        />
        <button
          className="px-3 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          onClick={handleAddTimeSlot}
        >
          Add Slot
        </button>
      </div>

      {message && <p className="mt-2 text-sm text-green-600">{message}</p>}
    </div>
  )}

  {/* Save Button */}
  <div className="text-right">
    <button
      className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
      onClick={() => alert('Availability saved (mocked)')}
    >
      Save Changes
    </button>
  </div>
</div>
  );
};

export default CounselorAvailability;



