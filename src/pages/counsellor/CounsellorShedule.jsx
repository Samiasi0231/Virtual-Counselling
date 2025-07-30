import React, { useEffect, useState } from 'react';
import axiosClient from '../../utils/axios-client-analytics';

const ALERT_THRESHOLD_MINUTES = 5;

const CounselorSchedule = () => {
  const [bookings, setBookings] = useState([]);

  const fetchBookings = async () => {
    try {
      const res = await axiosClient.get('/vpc/get-bookings/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const data = res.data || [];

      const parsed = data.map((item) => {
        const dateObj = new Date(item.booking_time);
        return {
          id: item.item_id,
          counselor: item.counsellor.fullname,
          dateObj,
          date: dateObj.toLocaleDateString('en-CA'),
          time: dateObj.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
          duration: `${item.duration_minutes} minutes`,
          status: 'Booked',
          alerted: false,
        };
      });

      setBookings(parsed.filter((b) => b.dateObj > new Date()));
    } catch (err) {
      console.error('Error fetching bookings:', err);
     toast.error(' Error fetching bookings.');
    }
  };

  const deleteBooking = async (id) => {
    const confirmed = window.confirm('Are you sure you want to remove this booking?');
    if (!confirmed) return;

    try {
      await axiosClient.delete(`/vpc/remove-bookings/${id}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      setBookings((prev) => prev.filter((b) => b.id !== id));
        toast.success('✅ Booking removed successfully.');
    } catch (err) {
      console.error('Delete failed:', err);
     toast.error('Failed to delete booking.');
    }
  };

  useEffect(() => {
    fetchBookings();
    const interval = setInterval(fetchBookings, 30000); 
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();

      setBookings((prev) =>
        prev
          .filter((b) => b.dateObj > now)
          .map((b) => {
            const diff = b.dateObj - now;
            const shouldNotify = diff < ALERT_THRESHOLD_MINUTES * 60 * 1000 && !b.alerted;

            return shouldNotify ? { ...b, alerted: true } : b;
          })
      );
    }, 10000);

    return () => clearInterval(interval);
  }, [bookings]);

  const BookingReminderCard = ({ booking }) => {
    const [countdown, setCountdown] = useState('');

    useEffect(() => {
      const updateCountdown = () => {
        const now = new Date();
        const timeRemaining = booking.dateObj - now;

        if (timeRemaining <= 0) {
          setCountdown('Now');
          return;
        }

        const totalSeconds = Math.floor(timeRemaining / 1000);
        const days = Math.floor(totalSeconds / (60 * 60 * 24));
        const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);

        setCountdown(`${days}d ${hours}h ${minutes}m`);
      };

      updateCountdown();
      const interval = setInterval(updateCountdown, 60000); 
      return () => clearInterval(interval);
    }, [booking.dateObj]);

    return (
      <div className="bg-purple-100 text-purple-900 border border-purple-300 shadow-sm rounded-md p-3 text-sm relative">
        <div className="font-semibold text-purple-800">📌 {booking.counselor}</div>
        <div>{booking.date} • {booking.time}</div>
        <div className="text-xs text-purple-700">⏳ {countdown}</div>
        <button
          onClick={() => deleteBooking(booking.id)}
          className="absolute bottom-1 right-2 text-xs text-red-600 hover:text-red-800"
        >
          ✖ Remove
        </button>
      </div>
    );
  };

  return (
    <div className="flex p-4 flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Counsellor Schedule</h2>
        {bookings.length === 0 ? (
          <p className="text-gray-500 text-sm">No sessions booked yet.</p>
        ) : (
          bookings.map((booking) => (
            <BookingReminderCard key={booking.id} booking={booking} />
          ))
        )}
      </div>
    </div>
  );
};

export default CounselorSchedule;
