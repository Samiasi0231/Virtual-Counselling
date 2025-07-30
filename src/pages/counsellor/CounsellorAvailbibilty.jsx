import React, { useState, useEffect,useMemo} from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../../utils/axios-client-analytics';
import { useStateValue } from '../../Context/UseStateValue';

const CounselorAvailability = () => {
  const [availability, setAvailability] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [newTimeSlot, setNewTimeSlot] = useState('');
  const navigate =useNavigate()
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
    console.log(data)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const formatted = {};
    const ids = {};

    data.forEach(({ _id, date, time_slots }) => {
      const slotDate = new Date(date);
      slotDate.setHours(0, 0, 0, 0);

      if (slotDate >= today) {
        formatted[date] = time_slots.map((t) => {
          const [hour, minute] = t.split(':');
          return `${hour}:${minute}`;
        });

        ids[date] = _id;
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

  if (!isValidTime(newTimeSlot)) {
    setMessage('Please enter time in HH:mm format (e.g. 14:30)');
    return;
  }

  const key = getFormattedDate(selectedDate);
  const existing = availability[key] || [];

  if (existing.includes(newTimeSlot)) {
    toast.error('Slot already added.');
    return;
  }

  const updated = {
    ...availability,
    [key]: [...existing, newTimeSlot],
  };
  setAvailability(updated);
  setNewTimeSlot('');
  toast.success('✅ Slot added.');
};

  const handleRemoveSlot = (slot) => {
    const key = getFormattedDate(selectedDate);
    const updated = {
      ...availability,
      [key]: availability[key].filter((t) => t !== slot),
    };
    setAvailability(updated);
     toast.warn('🗑️ Slot removed.');
  };

const handleSave = async () => {
  const prevSelected = selectedDate; 

  const payload = Object.entries(availability).map(([date, time_slots]) => ({
    date,
    time_slots: time_slots.map((slot) => {
      return slot.length === 5 ? `${slot}:00` : slot;
    }),
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
   toast.success('✅ Availability saved.');

    // await fetchAvailability();       
    // setSelectedDate(prevSelected);     
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

      {selectedDate && (
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-700 mb-2">
            Set availability for {selectedDate.toDateString()}
          </h3>

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

          <div className="flex items-center space-x-2">
           <input
  type="time"
  value={newTimeSlot}
  onChange={(e) => setNewTimeSlot(e.target.value)}
  step="60"
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
