import React, { useEffect, useState } from 'react';
import axiosClient from '../../utils/axios-client-analytics';

const ALERT_THRESHOLD_MINUTES = 5;

const StudentShedule = () => {
  const [bookings, setBookings] = useState([]);

  // Format duration as h:m
  const formatDuration = (minutes) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hrs > 0 && mins > 0) return `${hrs}h ${mins}m`;
    if (hrs > 0) return `${hrs}h`;
    return `${mins}m`;
  };

  const fetchBookings = async () => {
    try {
      const res = await axiosClient.get('/vpc/get-bookings/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const data = res.data || [];

      // Parse API data
      const parsed = data.map((item) => {
        const availDate = item.availability_period?.availability_date?.split('T')[0] || '';
        const startTime = item.availability_period?.start_time || '00:00';
        const endTime = item.availability_period?.end_time || '00:00';

        const dateObj = new Date(`${availDate}T${startTime}`);

        return {
          id: item.item_id,
          counselor: item.counsellor?.fullname || 'Unknown Counselor',
          dateObj,
          date: dateObj.toLocaleDateString('en-CA'),
          time: `${startTime} - ${endTime}`,
          duration: formatDuration(item.duration_minutes),
          status: item.availability_period?.booked ? 'Booked' : 'Available',
          alerted: false,
        };
      });

      // Remove duplicate bookings with same date & time
      const uniqueBookings = parsed.filter((booking, index, self) =>
        index === self.findIndex(
          (b) => b.date === booking.date && b.time === booking.time
        )
      );

      // Keep only future valid dates
      setBookings(
        uniqueBookings.filter((b) => !isNaN(b.dateObj) && b.dateObj > new Date())
      );
    } catch (err) {
      console.error('Error fetching bookings:', err);
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
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  useEffect(() => {
    fetchBookings();
    const interval = setInterval(fetchBookings, 30000); // refresh every 30s
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
            const shouldNotify =
              diff < ALERT_THRESHOLD_MINUTES * 60 * 1000 && !b.alerted;

            if (shouldNotify) {
              alert(`⏰ Reminder: You have a session with ${b.counselor} soon!`);
            }

            return shouldNotify ? { ...b, alerted: true } : b;
          })
      );
    }, 10000); // check every 10s

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
        <div className="text-xs text-purple-700">⏳ {countdown} • {booking.duration}</div>
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
      <div className="px-5 pt-5">
        <header className="flex justify-between items-start mb-2">
          <h2 className="text-base font-serif sm:text-lg font-light text-gray-500 dark:text-gray-100 mb-2">
            Counsellor Schedule
          </h2>
        </header>
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

export default StudentShedule;
