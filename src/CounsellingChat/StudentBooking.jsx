import React, { useState, useEffect } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import axiosClient from '../utils/axios-client-analytics';
import { toast } from 'react-toastify';
import { useLocation,useParams, useNavigate} from 'react-router-dom';
const StudentBooking = () => {
  const { mentor_id } = useParams();
  const navigate = useNavigate();
  const [availability, setAvailability] = useState({});
  const[pastAvailableDates, setPastAvailableDates]=useState([])
  const [availableDates, setAvailableDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedTime, setSelectedTime] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const location = useLocation();
  const { fullname, profilePhoto } = location.state || {};


  const today = new Date();
today.setHours(0, 0, 0, 0);

const fetchAvailability = async () => {
  const now = new Date();
  const payload = {
    month: now.getMonth() + 1,
    year: now.getFullYear(),
    mentor_id,
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
    const formatted = {};

    data.forEach(({ date, time_slots }) => {
    const iso = date instanceof Date ? date.toLocaleDateString('en-CA') : date;

      if (time_slots.length > 0) {
        const sortedSlots = time_slots.sort((a, b) => {
          return new Date(`1970-01-01T${a}:00`) - new Date(`1970-01-01T${b}:00`);
        });
        formatted[iso] = sortedSlots;
      }
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // const key = selectedDate.toLocaleDateString('en-CA');
const allDates = Object.keys(formatted);
    const pastAvailable = allDates.filter((d) => new Date(d) < today);
    const futureAvailable = allDates.filter((d) => new Date(d) >= today);

    setAvailability(formatted);
    setAvailableDates(futureAvailable); 
    setPastAvailableDates(pastAvailable);

    console.log('Formatted Availability:', formatted);
    console.log('Future Dates:', futureAvailable);
    console.log('Past Dates:', pastAvailable);
  } catch (error) {
    console.error('Failed to load availability:', error);
  }
};


  useEffect(() => {
    fetchAvailability();
  }, [mentor_id]);

  useEffect(() => {
    if (!selectedDate) return;
  const key = selectedDate.toLocaleDateString('en-CA'); 
    setTimeSlots(availability[key] || []);
    setSelectedTime('');
  }, [selectedDate, availability]);

const handleDateSelect = (date) => {
  if (!date) return;

  const dateStr = date.toLocaleDateString('en-CA');


  if (!availability[dateStr]) {
    toast.error('No available time slots for this date.');
    return;
  }

  setSelectedDate(date);
};
const handleConfirm = async () => {


  if (!selectedDate || !selectedTime) return;

 console.log("Selected Date:", selectedDate);
  console.log("Selected Time:", selectedTime);
  const dateString = selectedDate.toLocaleDateString('en-CA'); 
  const bookingTime = new Date(`${dateString}T${selectedTime}:00Z`).toISOString(); 

  const payload = {
    booking_time: bookingTime,
    duration_minutes: 50,
    mentor_id

  };

  try {
    await axiosClient.post(`/vpc/create-booking/${mentor_id}/`, payload, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });
toast.success('✅ Booking confirmed!');
    setConfirmed(true);
  } catch (error) {
    console.error('Booking failed:', error);
    toast.error(' Booking failed. Please try again.');
  }
};


const modifiers = {
available: (date) => availableDates.includes(date.toLocaleDateString('en-CA')),
pastAvailable: (date) => pastAvailableDates.includes(date.toLocaleDateString('en-CA')),

};


const modifiersClassNames = {
  available: 'bg-green-100 text-green-800 font-semibold rounded-full',
  selected: 'bg-purple-600 text-white',
  today: 'text-blue-800 font-bold border border-blue-500',
  pastAvailable: 'bg-red-500 text-white font-semibold rounded-full'
};


  const formattedDate = selectedDate?.toDateString();

  if (confirmed) {
    return (
      <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md border border-gray-200 space-y-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">✅ Booking Confirmed!</h2>

         <button
        onClick={() => navigate('/student/dashboard')}
        className="px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
      >
        OK
      </button>
      </div>
    );
  }

  return (
    <div className="border border-gray-200 overflow-auto mx-auto p-4 bg-white rounded-xl shadow">
       <div className="mb-6">
  <button
    onClick={() => navigate(-1)}
    className="flex items-center text-purple-600 hover:text-purple-800 font-medium"
  >
    ← Back
  </button>
</div>
      <div className="w-full p-6 space-y-6">
        {/* Counselor Info */}
        <div className="flex items-center space-x-4">
         <img
  src={profilePhoto}
  alt={fullname}
  className="w-20 h-20 rounded-full"
/>
          <div>
            <h2 className="text-xl text-gray-500">You're booking with</h2>
            <h2 className="text-xl font-bold text-gray-800">{fullname}</h2>
            <p className="text-sm text-gray-400">Counseling Psychology</p>
          </div>
        </div>

        {/* Date Picker */}
        <div>
          <h3 className="font-medium text-gray-700 mb-1">📅 Select a Date</h3>
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            modifiers={modifiers}
            modifiersClassNames={modifiersClassNames}
   disabled={(date) => {
  const iso = date.toLocaleDateString('en-CA');
  return date < today || !availability[iso];
}}

            className="!text-sm"
          />
          <p className="text-xs text-gray-500 mt-2">
            Only green-highlighted dates are available
          </p>
        </div>

        {/* Time Slots */}
        {selectedDate && (
          <div>
            <h3 className="font-medium text-gray-700 mb-2">
              Time slots on {formattedDate}:
            </h3>
            {timeSlots.length > 0 ? (
              <ul className="grid grid-cols-2 gap-2 text-sm">
                {timeSlots.map((slot) => (
                  <li key={slot}>
                    <button
                    onClick={() => {
  setSelectedTime(slot);
  toast.info(`🕒 Selected time: ${slot}`);
}}
                      className={`w-full py-2 px-3 rounded border text-center ${
                        selectedTime === slot
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      {slot}
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-blue-500">No slots available for this day.</p>
            )}
          </div>
        )}

        {/* Summary & Confirm */}
        {selectedDate && selectedTime && (
          <div className="bg-gray-50 border border-gray-200 p-4 rounded space-y-1">
            <h3 className="font-semibold text-purple-700 mb-1">Confirm Your Booking</h3>
            <p><strong>Date:</strong> {formattedDate}</p>
            <p><strong>Time:</strong> {selectedTime}</p>
            <p><strong>Duration:</strong> 50 minutes</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-2">
          <button
            onClick={() => {
              setSelectedDate(null);
              setSelectedTime('');
            }}
            className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            disabled={!selectedDate || !selectedTime}
            onClick={handleConfirm}
            className="px-4 py-2 text-sm bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
          >
            Confirm Booking
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentBooking;
