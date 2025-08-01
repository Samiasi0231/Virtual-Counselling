import React, { useState, useEffect,useMemo} from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../../utils/axios-client-analytics';
import { toast } from 'react-toastify';
import { useStateValue } from '../../Context/UseStateValue';

const CounselorAvailability = () => {
  const [availability, setAvailability] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [newTimeSlot, setNewTimeSlot] = useState('');
  const navigate =useNavigate()
  const [startTime, setStartTime] = useState('');
const [endTime, setEndTime] = useState('');
  const [message, setMessage] = useState('');
  const [tooltip, setTooltip] = useState('');
  const [{ mentor_id: contextMentorId }] = useStateValue();
const isValidTime = (time) => {
  // Matches HH:mm where HH is 00–23 and mm is 00–59
  const regex = /^([01]\d|2[0-3]):([0-5]\d)$/;
  return regex.test(time);
};

// const userData = JSON.parse(localStorage.getItem("USER_INFO"));
// const mentor_id = userData?.item_id || null;
const mentor_id = contextMentorId;



  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      setMessage('');
    }, 3000);

    return () => clearTimeout(timer);
  }, [message]);

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

    data.forEach(({ date, meeting_periods = [] }) => {
      const slotDate = new Date(date);
      slotDate.setHours(0, 0, 0, 0);

      if (slotDate >= today) {
        formatted[date] = meeting_periods;
      }
    });

    setAvailability(formatted);
  } catch (error) {
    console.error('Failed to load availability:', error);
    toast.error('Failed to load availability.');
  }
};



  useEffect(() => {
    fetchAvailability();
  }, []);

 const handleAddTimeSlot = () => {
  if (!selectedDate || !startTime || !endTime) return;

  if (startTime >= endTime) {
    toast.error('Start time must be before end time.');
    return;
  }

  const key = getFormattedDate(selectedDate);
  const existing = availability[key] || [];
  const newSlot = { start_time: startTime, end_time: endTime };

  // Check for exact duplicate
  const isDuplicate = existing.some(
    (slot) => slot.start_time === newSlot.start_time && slot.end_time === newSlot.end_time
  );

  if (isDuplicate) {
    toast.error('Slot already added.');
    return;
  }

  const overlaps = existing.some((slot) => {
    return !(
      newSlot.end_time <= slot.start_time || newSlot.start_time >= slot.end_time
    );
  });

  if (overlaps) {
    toast.error('This slot overlaps with an existing one.');
    return;
  }


  const updated = {
    ...availability,
    [key]: [...existing, newSlot],
  };

  setAvailability(updated);
  setStartTime('');
  setEndTime('');
  toast.success(' Slot added.');
};



  const handleRemoveSlot = (slotToRemove) => {
  const key = getFormattedDate(selectedDate);
  const updated = {
    ...availability,
    [key]: availability[key].filter(
      (slot) =>
        slot.start_time !== slotToRemove.start_time ||
        slot.end_time !== slotToRemove.end_time
    ),
  };
  setAvailability(updated);
  toast.warn('🗑️ Slot removed.');
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

    toast.success('✅ Availability saved.');
  } catch (error) {
    console.error('Failed to save availability:', error);
    toast.error('❌ Failed to save availability.');
  }
};



  const selectedDateKey = getFormattedDate(selectedDate);
  const slots = availability[selectedDateKey] || [];

const modifiers = useMemo(() => ({
  hasSlots: Object.entries(availability)
    .filter(([_, slots]) => slots.length > 0)
    .map(([date]) => new Date(date)),
}), [availability]);


  const modifiersClassNames = {
    hasSlots: 'bg-blue-200 text-blue-900 font-semibold',
  };

  return (
    <div className="sm:p-6 lg:px-10 py-6 border border-gray-200 overflow-auto mx-auto p-4 bg-white rounded-xl shadow">
       <div className="mb-6">
  <button
    onClick={() => navigate(-1)}
    className="flex items-center text-purple-600 hover:text-purple-800 font-medium"
  >
    ← Back
  </button>
</div>
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
      toast.error('You can only add future dates');
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

      {selectedDate && (
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-700 mb-2">
            Set availability for {selectedDate.toDateString()}
          </h3>

          <div className="mb-3">
            <p className="text-sm text-gray-600 mb-1">Current slots:</p>
            {slots.length > 0 ? (
              <ul className="list-disc list-inside space-y-1">
  {slots.map((slot, index) => (
    <li key={`${slot.start_time}-${slot.end_time}-${index}`} className="flex justify-between items-center">
      <span>{slot.start_time} - {slot.end_time}</span>
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

    <div className="flex items-end space-x-4">
  {/* Start Time */}
  <div className="flex flex-col">
    <label className="text-sm text-gray-700 mb-1">Start Time</label>
    <input
      type="time"
      value={startTime}
      onChange={(e) => setStartTime(e.target.value)}
      step="60"
      className="border border-gray-300 px-3 py-2 rounded w-32"
    />
  </div>

  {/* End Time */}
  <div className="flex flex-col">
    <label className="text-sm text-gray-700 mb-1">End Time</label>
    <input
      type="time"
      value={endTime}
      onChange={(e) => setEndTime(e.target.value)}
      step="60"
      className="border border-gray-300 px-3 py-2 rounded w-32"
    />
  </div>

  {/* Add Slot Button */}
  <div className="flex flex-col">
    <label className="text-sm text-transparent mb-1">Add</label> {/* invisible label for alignment */}
    <button
      className="px-3 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
      onClick={handleAddTimeSlot}
      disabled={
        !selectedDate ||
        new Date(getFormattedDate(selectedDate)) < new Date(new Date().setHours(0, 0, 0, 0)) ||
        !startTime ||
        !endTime ||
        startTime >= endTime
      }
    >
      Add Slot
    </button>
  </div>
</div>



          {message && <p className="mt-2 text-sm text-green-600">{message}</p>}
        </div>
      )}

   
<div className="text-right">
  <button
    className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
    onClick={handleSave}
  >
    Save Changes
  </button>
</div>


{message && (
  <div className="mt-4 text-green-600 font-medium bg-green-100 border border-green-300 px-4 py-2 rounded">
    {message}
  </div>
)}

    </div>
  );
};

export default CounselorAvailability;
