import React, { useEffect, useState } from 'react';
import { FaVideo, FaExternalLinkAlt, FaTrash } from 'react-icons/fa';
import axiosClient from '.././utils/axios-client-analytics';

function UserGoLive() {
  const [links, setLinks] = useState([]);
  const [filter, setFilter] = useState('upcoming');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

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

  // 🧹 Local delete without API call
  const deleteMeeting = (meeting_id) => {
    const confirmDelete = window.confirm('Are you sure you want to remove this session?');
    if (!confirmDelete) return;

    // Only update local state
    setLinks((prev) => prev.filter(link => (link.id || link._id) !== meeting_id));
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
