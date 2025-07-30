import React, { useEffect, useState } from 'react';
import { FaVideo, FaExternalLinkAlt, FaTrash } from 'react-icons/fa';
import axiosClient from '.././utils/axios-client-analytics';

function UserGoLive() {
  const [links, setLinks] = useState([]);
  const [filter, setFilter] = useState('upcoming');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [lastMeeting, setLastMeeting] = useState(null);

  const fetchMeetings = async () => {
    try {
      setLoading(true);
      const isPast = filter === 'past';

      const res = await axiosClient.get(`/vpc/get-user-meetings/${currentPage - 1}/${isPast}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const data = res.data?.results || res.data || [];
      setLinks(data);
      setTotalPages(res.data?.total_pages || 1);
    } catch (err) {
      console.error('Failed to fetch meetings:', err);
      setLinks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, [filter, currentPage]);

  useEffect(() => {
    const saved = localStorage.getItem('lastMeeting');
    if (saved) {
      const parsed = JSON.parse(saved);
      const meetingDate = new Date(parsed.date_and_time);
      if (meetingDate > new Date()) {
        setLastMeeting(parsed);
      } else {
        localStorage.removeItem('lastMeeting');
      }
    }
  }, []);

  const getCountdown = (startTime) => {
    const diff = new Date(startTime) - new Date();
    if (diff <= 0) return 'Started';

    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / (60 * 60 * 24));
    const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);

    const parts = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0 || days > 0) parts.push(`${hours}h`);
    parts.push(`${minutes}m`);

    return parts.join(' ');
  };

  const deleteMeeting = (meeting_id) => {
    const confirmDelete = window.confirm('Are you sure you want to remove this session?');
    if (!confirmDelete) return;

    setLinks((prev) => prev.filter(link => (link.id || link._id) !== meeting_id));

    // Also remove from localStorage if deleted
    if (lastMeeting && (lastMeeting.id === meeting_id || lastMeeting._id === meeting_id)) {
      localStorage.removeItem('lastMeeting');
      setLastMeeting(null);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-4 mx-auto overflow-x-auto">
      <h2 className="text-2xl font-semibold text-white-900 flex items-center gap-2 mb-4">
        <FaVideo /> Your Counseling Sessions
      </h2>

      <div className="flex items-center gap-4 mb-4">
        <button
          onClick={() => { setFilter('upcoming'); setCurrentPage(1); }}
          className={`px-4 py-1 rounded-full text-sm ${filter === 'upcoming' ? 'bg-purple-600 text-white' : 'hover:bg-purple-300'}`}
        >
          Upcoming
        </button>
        <button
          onClick={() => { setFilter('past'); setCurrentPage(1); }}
          className={`px-4 py-1 rounded-full text-sm ${filter === 'past' ? 'bg-purple-600 text-white' : 'hover:bg-purple-300'}`}
        >
          Past
        </button>
      </div>

      {lastMeeting && (
        <div className="bg-purple-50 border border-purple-300 rounded p-4 mb-6">
          <h3 className="text-purple-700 font-semibold mb-2">Last Sent Meeting</h3>
          <p className="text-sm"><strong>Title:</strong> {lastMeeting.title}</p>
          <p className="text-sm"><strong>Date:</strong> {new Date(lastMeeting.date_and_time).toLocaleString()}</p>
          <a
            href={lastMeeting.link}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-blue-600 underline text-sm mt-1"
          >
            Join <FaExternalLinkAlt size={12} />
          </a>
        </div>
      )}

      {loading ? (
        <p className="text-gray-500">Loading sessions...</p>
      ) : links.length === 0 ? (
        <p className="text-gray-500">No {filter} sessions found.</p>
      ) : (
        <ul className="space-y-4">
          {links.map((link) => (
            <li
              key={link.id || link._id}
              className="bg-gray-50 p-4 rounded-lg shadow-sm border flex justify-between items-center"
            >
              <div>
                <h4 className="font-medium text-lg text-gray-800">{link.title}</h4>
                <p className="text-sm text-gray-600">
                  📅 {new Date(link.date_and_time).toLocaleString()}
                </p>
                {filter === 'upcoming' && (
                  <p className="text-green-600 text-sm">
                    ⏳ {getCountdown(link.date_and_time)}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={link.link}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm flex items-center gap-2"
                >
                  Join <FaExternalLinkAlt size={12} />
                </a>
                <button
                  onClick={() => deleteMeeting(link.id || link._id)}
                  className="text-red-600 hover:text-red-800 text-sm"
                  title="Remove"
                >
                  <FaTrash />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {totalPages > 1 && (
        <div className="mt-6 flex justify-center items-center gap-4">
          <button
            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span className="text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default UserGoLive;
