
import React, { useEffect, useState } from 'react';

const StudentShedule = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('bookings')) || [];
    setBookings(saved);
  }, []);

  const BookingReminderCard = ({ booking }) => (
    <div className="bg-white border border-gray-200 shadow-sm rounded-lg p-4 space-y-1">
      <h3 className="text-lg font-semibold text-blue-800">📅 Upcoming Session</h3>
      <p><strong>Counselor:</strong> {booking.counselor}</p>
      <p><strong>Date:</strong> {booking.date}</p>
      <p><strong>Time:</strong> {booking.time}</p>
      <p><strong>Duration:</strong> {booking.duration}</p>
      <p className="text-green-600 text-sm font-medium">Status: {booking.status}</p>
    </div>
  );

  return (
     <div className="flex p-4 flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-800 mb-2">user Booking</h2>
      {bookings.length === 0 ? (
        <p className="text-gray-500">No upcoming sessions.</p>
      ) : (
        bookings.map((booking, index) => (
          <BookingReminderCard key={index} booking={booking} />
        ))
      )}
    </div>
    </div>
  );
};

export default StudentShedule;


// import React, { useState, useEffect } from 'react';
// import { DayPicker } from 'react-day-picker';
// import 'react-day-picker/dist/style.css';


// // Mock availability storage
// const MOCK_AVAILABILITY = {
//   '2025-07-03': ['09:00 AM', '11:00 AM'],
//   '2025-07-05': ['10:00 AM'],
// };

// const CounselorAvailabilityManager = () => {
//   const [availability, setAvailability] = useState({});
//   const [selectedDate, setSelectedDate] = useState(null);
//   const [newTimeSlot, setNewTimeSlot] = useState('');
//   const [message, setMessage] = useState('');

//   // Load mock availability on mount
//   useEffect(() => {
//     setAvailability(MOCK_AVAILABILITY);
//   }, []);

//   const getFormattedDate = (date) =>
//     date ? date.toISOString().split('T')[0] : null;

//   const handleAddTimeSlot = () => {
//     if (!selectedDate || !newTimeSlot) return;

//     const key = getFormattedDate(selectedDate);
//     const existing = availability[key] || [];
//     if (existing.includes(newTimeSlot)) {
//       setMessage('⛔ Slot already added.');
//       return;
//     }

//     const updated = {
//       ...availability,
//       [key]: [...existing, newTimeSlot],
//     };
//     setAvailability(updated);
//     setNewTimeSlot('');
//     setMessage('✅ Slot added.');
//   };

//   const handleRemoveSlot = (slot) => {
//     const key = getFormattedDate(selectedDate);
//     const updated = {
//       ...availability,
//       [key]: availability[key].filter((t) => t !== slot),
//     };
//     setAvailability(updated);
//     setMessage('🗑️ Slot removed.');
//   };

//   const selectedDateKey = getFormattedDate(selectedDate);
//   const slots = availability[selectedDateKey] || [];

//   const modifiers = {
//     hasSlots: Object.keys(availability).map((date) => new Date(date)),
//   };

//   const modifiersClassNames = {
//     hasSlots: 'bg-blue-200 text-blue-900 font-semibold',
//   };

//   return (
//     <div className="max-w-2xl mx-auto p-6 bg-white shadow-md border border-gray-200 rounded-lg">
//       <h2 className="text-2xl font-bold text-gray-800 mb-4">📅 Manage Availability</h2>

//       {/* Calendar */}
//       <div className="mb-6">
//         <DayPicker
//           mode="single"
//           selected={selectedDate}
//           onSelect={setSelectedDate}
//           modifiers={modifiers}
//           modifiersClassNames={modifiersClassNames}
//         />
//         <p className="text-sm text-gray-500 mt-2">
//           🔵 Dates in blue already have time slots
//         </p>
//       </div>

//       {/* Time Slot Editor */}
//       {selectedDate && (
//         <div className="mb-6">
//           <h3 className="text-lg font-medium text-gray-700 mb-2">
//             Set availability for {selectedDate.toDateString()}
//           </h3>

//           {/* Existing Slots */}
//           <div className="mb-3">
//             <p className="text-sm text-gray-600 mb-1">Current slots:</p>
//             {slots.length > 0 ? (
//               <ul className="list-disc list-inside space-y-1">
//                 {slots.map((slot) => (
//                   <li key={slot} className="flex justify-between items-center">
//                     <span>{slot}</span>
//                     <button
//                       className="text-red-500 text-sm hover:underline"
//                       onClick={() => handleRemoveSlot(slot)}
//                     >
//                       Remove
//                     </button>
//                   </li>
//                 ))}
//               </ul>
//             ) : (
//               <p className="text-sm text-gray-400">No slots set yet.</p>
//             )}
//           </div>

//           {/* Add New Slot */}
//           <div className="flex items-center space-x-2">
//             <input
//               type="text"
//               value={newTimeSlot}
//               onChange={(e) => setNewTimeSlot(e.target.value)}
//               placeholder="e.g. 02:00 PM"
//               className="border border-gray-300 px-3 py-2 rounded w-40"
//             />
//             <button
//               className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//               onClick={handleAddTimeSlot}
//             >
//               Add Slot
//             </button>
//           </div>

//           {message && <p className="mt-2 text-sm text-green-600">{message}</p>}
//         </div>
//       )}

//       {/* Save (Mocked) */}
//       <div className="text-right">
//         <button
//           className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
//           onClick={() => alert('✅ Availability saved (mocked)')}
//         >
//           Save Changes
//         </button>
//       </div>
//     </div>
//   );
// };

// export default CounselorAvailabilityManager;


























// import React, { useState, useEffect } from 'react';
// import { DayPicker } from 'react-day-picker';
// import 'react-day-picker/dist/style.css';

// // ✅ Generate random availability
// const generateMockAvailability = () => {
//   const timeOptions = [
//     '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
//     '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'
//   ];

//   const availability = {};
//   const today = new Date();

//   for (let i = 0; i < 10; i++) {
//     const date = new Date(today);
//     date.setDate(date.getDate() + i);
//     const isoDate = date.toISOString().split('T')[0];

//     const numSlots = Math.floor(Math.random() * 4) + 1;
//     const shuffled = timeOptions.sort(() => 0.5 - Math.random());
//     availability[isoDate] = shuffled.slice(0, numSlots);
//   }

//   return availability;
// };

// const BookingWithAvailability = () => {
//   const [mockAvailability] = useState(generateMockAvailability);
//   const [selectedDate, setSelectedDate] = useState(null);
//   const [availableDates, setAvailableDates] = useState([]);
//   const [timeSlots, setTimeSlots] = useState([]);
//   const [selectedTime, setSelectedTime] = useState('');
//   const [confirmed, setConfirmed] = useState(false);

//   // Load available dates
//   useEffect(() => {
//     const dates = Object.keys(mockAvailability).map(date => new Date(date));
//     setAvailableDates(dates);
//   }, [mockAvailability]);

//   // Load time slots when date selected
//   useEffect(() => {
//     if (!selectedDate) return;
//     const key = selectedDate.toISOString().split('T')[0];
//     setTimeSlots(mockAvailability[key] || []);
//     setSelectedTime('');
//   }, [selectedDate, mockAvailability]);

//   const handleConfirm = () => {
//     setConfirmed(true);
//   };

//   const modifiers = { available: availableDates };
//   const modifiersClassNames = {
//     available: 'bg-green-100 text-green-800 font-semibold rounded-full',
//   };

//   const formattedDate = selectedDate?.toDateString();

//   if (confirmed) {
//     return (
//     <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md border border-gray-200 space-y-6">

//         <h2 className="text-2xl font-bold text-green-700 mb-2">✅ Booking Confirmed!</h2>
//         <p className="text-green-600 mb-1">You’ll receive an email confirmation shortly.</p>
//         <p className="text-green-500 text-sm">A secure video session link will be shared with you.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md border border-gray-200 space-y-6">
//       {/* Counselor Header */}
//       <div className="flex items-center space-x-4">
//         <img
//           src="/dr-olayemi.jpg"
//           alt="Dr. Olayemi Smith"
//           className="w-16 h-16 rounded-full object-cover border border-gray-300"
//         />
//         <div>
//           <p className="text-sm text-gray-500">You're booking with</p>
//           <h2 className="text-xl font-bold text-gray-800">Dr. Olayemi Smith</h2>
//           <p className="text-sm text-gray-400">Counseling Psychology</p>
//         </div>
//       </div>

//       {/* Date Picker */}
//       <div>
//         <h3 className="font-medium text-gray-700 mb-1">📅 Select a Date</h3>
//         <DayPicker
//           mode="single"
//           selected={selectedDate}
//           onSelect={setSelectedDate}
//           modifiers={modifiers}
//           modifiersClassNames={modifiersClassNames}
//         />
//         <p className="text-xs text-gray-500 mt-2">
//           Only green-highlighted dates are available
//         </p>
//       </div>

//       {/* Available Time Slots */}
//       {selectedDate && (
//         <div>
//           <h3 className="font-medium text-gray-700 mb-2">
//             🕒 Time slots on {formattedDate}:
//           </h3>
//           {timeSlots.length > 0 ? (
//             <ul className="grid grid-cols-2 gap-2 text-sm">
//               {timeSlots.map((slot) => (
//                 <li key={slot}>
//                   <button
//                     onClick={() => setSelectedTime(slot)}
//                     className={`w-full py-2 px-3 rounded border text-center ${
//                       selectedTime === slot
//                         ? 'bg-blue-600 text-white'
//                         : 'bg-gray-100 hover:bg-gray-200'
//                     }`}
//                   >
//                     {slot}
//                   </button>
//                 </li>
//               ))}
//             </ul>
//           ) : (
//             <p className="text-sm text-blue-500">No slots available for this day.</p>
//           )}
//         </div>
//       )}

//       {/* Time Summary & Confirmation */}
//       {selectedDate && selectedTime && (
//         <div className="bg-gray-50 border border-gray-200 p-4 rounded space-y-1">
//           <h3 className="font-semibold text-gray-800 mb-1">✅ Confirm Your Booking</h3>
//           <p><strong>Date:</strong> {formattedDate}</p>
//           <p><strong>Time:</strong> {selectedTime}</p>
//           <p><strong>Duration:</strong> ~50 minutes</p>
//         </div>
//       )}

//       {/* Actions */}
//       <div className="flex justify-end space-x-3 pt-2">
//         <button
//           onClick={() => {
//             setSelectedDate(null);
//             setSelectedTime('');
//           }}
//           className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-100"
//         >
//           Cancel
//         </button>
//         <button
//           disabled={!selectedDate || !selectedTime}
//           onClick={handleConfirm}
//           className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
//         >
//           Confirm Booking
//         </button>
//       </div>
//     </div>
//   );
// };

// export default BookingWithAvailability;
