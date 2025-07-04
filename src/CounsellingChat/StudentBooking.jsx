
import React, { useState, useEffect } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

// ✅ Generate random availability
const generateMockAvailability = () => {
  const timeOptions = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'
  ];

  const availability = {};
  const today = new Date();

  for (let i = 0; i < 10; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    const isoDate = date.toISOString().split('T')[0];

    const numSlots = Math.floor(Math.random() * 4) + 1;
    const shuffled = timeOptions.sort(() => 0.5 - Math.random());
    availability[isoDate] = shuffled.slice(0, numSlots);
  }

  return availability;
};

const StudentBooking = () => {
  const [mockAvailability] = useState(generateMockAvailability);
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableDates, setAvailableDates] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedTime, setSelectedTime] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  // Load available dates
  useEffect(() => {
    const dates = Object.keys(mockAvailability).map(date => new Date(date));
    setAvailableDates(dates);
  }, [mockAvailability]);

  // Load time slots when date selected
  useEffect(() => {
    if (!selectedDate) return;
    const key = selectedDate.toISOString().split('T')[0];
    setTimeSlots(mockAvailability[key] || []);
    setSelectedTime('');
  }, [selectedDate, mockAvailability]);

 const handleConfirm = () => {
  const booking = {
    counselor: 'Dr. Olayemi Smith',
    date: formattedDate,
    time: selectedTime,
    duration: '50 minutes',
    status: 'Booked',
  };

  const existingBookings = JSON.parse(localStorage.getItem('bookings')) || [];
  localStorage.setItem('bookings', JSON.stringify([...existingBookings, booking]));

  setConfirmed(true);
};


  const modifiers = { available: availableDates };
  const modifiersClassNames = {
    available: 'bg-green-100 text-green-800 font-semibold rounded-full',
  };

  const formattedDate = selectedDate?.toDateString();

  if (confirmed) {
    return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md border border-gray-200 space-y-6">

        <h2 className="text-2xl font-bold text-gray-800 mb-2">✅ Booking Confirmed!</h2>
        <p className="text-purple-600 mb-1">You’ll receive an email confirmation shortly.</p>
        <p className="text-purple-600 text-sm">A secure video session link will be shared with you.</p>
      </div>
    );
  }

  return (
<div className="mx-auto p-4  bg-white rounded-lg shadow-md border border-gray-200 ">
  <div className="w-full p-6 space-y-6">
      <div className="flex items-center space-x-4">
        <img
          src="/dr-olayemi.jpg"
          alt="Dr. Olayemi Smith"
          className="w-16 h-16 rounded-full object-cover border border-gray-300"
        />
        <div>
          <p className="text-sm text-gray-500">You're booking with</p>
          <h2 className="text-xl font-bold text-gray-800">Dr. Olayemi Smith</h2>
          <p className="text-sm text-gray-400">Counseling Psychology</p>
        </div>
      </div>

      {/* Date Picker */}
      <div>
        <h3 className="font-medium text-gray-700 mb-1">📅 Select a Date</h3>
        <DayPicker
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          modifiers={modifiers}
          modifiersClassNames={modifiersClassNames}
        />
        <p className="text-xs text-gray-500 mt-2">
          Only green-highlighted dates are available
        </p>
      </div>

      {/* Available Time Slots */}
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
                    onClick={() => setSelectedTime(slot)}
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

      {/* Time Summary & Confirmation */}
      {selectedDate && selectedTime && (
        <div className="bg-gray-50 border border-gray-200 p-4 rounded space-y-1">
          <h3 className="font-semibold text-purple-700 mb-1">Confirm Your Booking</h3>
          <p><strong>Date:</strong> {formattedDate}</p>
          <p><strong>Time:</strong> {selectedTime}</p>
          <p><strong>Duration:</strong>50 minutes</p>
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
          className="px-4 py-2 text-sm  bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
        >
          Confirm Booking
        </button>
      </div>
    </div>
    </div>
  );
};

export default StudentBooking;
