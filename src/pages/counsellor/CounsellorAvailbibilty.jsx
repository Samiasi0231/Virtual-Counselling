import React, { useState, useEffect,useMemo} from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import axiosClient from '../../utils/axios-client-analytics';

const CounselorAvailability = () => {
  const [availability, setAvailability] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [newTimeSlot, setNewTimeSlot] = useState('');
  const [message, setMessage] = useState('');
  const [tooltip, setTooltip] = useState('');

  const mentor_id = '641317483c47e297bedf065f'; 

   const getFormattedDate = (date) => {
   if (!date) return null;
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`; };

  const fetchAvailability = async () => {
    const now = new Date();
    const payload = {
      month: now.getMonth() + 1,
      year: now.getFullYear(),
    };

    try {
      const res = await axiosClient.post(
        `/vpc/get-availabilities/${mentor_id}/`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const data = res.data || [];
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const formatted = {};

      data.forEach(({ date, time_slots }) => {
        const slotDate = new Date(date);
        slotDate.setHours(0, 0, 0, 0);

        if (slotDate >= today) {
          formatted[date] = time_slots.map((t) => {
            const [hour, minute] = t.split(':');
            return `${hour}:${minute}`; 
          });
        }
      });

      setAvailability(formatted);
    } catch (error) {
      console.error('Failed to load availability:', error);
    }
  };

  useEffect(() => {
    fetchAvailability();
  }, []);

  const handleAddTimeSlot = () => {
    if (!selectedDate || !newTimeSlot) return;

    const key = getFormattedDate(selectedDate);
    const existing = availability[key] || [];

    if (existing.includes(newTimeSlot)) {
      setMessage('Slot already added.');
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
    setMessage('🗑️ Slot removed.');
  };

  const handleSave = async () => {
    const payload = Object.entries(availability).map(([date, time_slots]) => ({
      date,
      time_slots,
    }));

    try {
      const res = await axiosClient.post(
        '/vpc/add-availability/',
        { dates: payload },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('✅ Saved:', res.data);
      setMessage('✅ Availability saved.');
      fetchAvailability(); // Refresh after saving
    } catch (error) {
      console.error('Failed to save availability:', error);
      setMessage('Failed to save availability.');
    }
  };

  const selectedDateKey = getFormattedDate(selectedDate);
  const slots = availability[selectedDateKey] || [];

 const modifiers = useMemo(() => ({
 hasSlots: Object.keys(availability).map((date) => new Date(date)),
 }), [availability]);

  const modifiersClassNames = {
    hasSlots: 'bg-blue-200 text-blue-900 font-semibold',
  };

  return (
    <div className="sm:p-6 lg:px-10 py-6 border border-gray-200 overflow-auto mx-auto p-4 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">📅 Manage Availability</h2>

      {/* Calendar */}
      <div className="mb-6">
        <DayPicker
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          modifiers={modifiers}
          modifiersClassNames={modifiersClassNames}
          disabled={{ before: new Date() }} 
 onDayMouseEnter={(day) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (day < today) {
      setTooltip('You can only add future dates');
    } else {
      setTooltip('');
    }
  }}
  onDayMouseLeave={() => setTooltip('')}
        />
          {tooltip && (
    <div className="mt-2 text-sm text-red-500 italic">
      {tooltip}
    </div>
  )}
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
              placeholder="e.g. 14:30"
              className="border border-gray-300 px-3 py-2 rounded w-40"
            />
            <button
              className="px-3 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
              onClick={handleAddTimeSlot}
              disabled={
                !selectedDate ||
                new Date(getFormattedDate(selectedDate)) < new Date().setHours(0, 0, 0, 0)
              }
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
          onClick={handleSave}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default CounselorAvailability;
