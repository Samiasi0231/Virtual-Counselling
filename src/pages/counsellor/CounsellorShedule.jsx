import React, { useEffect, useState } from 'react';

const CounselorDashboard = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('bookings')) || [];
    setBookings(saved);
  }, []);

  const BookingReminderCard = ({ booking }) => {
    return (
      <div className="bg-white border border-gray-200 shadow-sm rounded-lg p-4 space-y-1">
        <h3 className="text-lg font-semibold text-blue-800">📅 Upcoming Session</h3>
        <p><strong>Counselor:</strong> {booking.counselor}</p>
        <p><strong>Date:</strong> {booking.date}</p>
        <p><strong>Time:</strong> {booking.time}</p>
        <p><strong>Duration:</strong> {booking.duration}</p>
        <p className="text-green-600 text-sm font-medium">Status: {booking.status}</p>
      </div>
    );
  };

  return (
       <div className="flex p-4 flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-800 mb-2">Counsellor Shedule</h2>
      {bookings.length === 0 ? (
        <p className="text-gray-500">No sessions booked yet.</p>
      ) : (
        bookings.map((booking, index) => (
          <BookingReminderCard key={index} booking={booking} />
        ))
      )}
    </div>
    </div>
  );
};

export default CounselorDashboard;
