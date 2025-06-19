import React, { useEffect, useState } from 'react';
import { FaVideo, FaExternalLinkAlt } from 'react-icons/fa';

function StudentMeetLinks({ studentId }) {
  const [links, setLinks] = useState([]);
  const [filter, setFilter] = useState('upcoming');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API delay with dummy data
    const dummyData = [
      {
        id: '1',
        title: 'Math Session with Mr. A',
        url: 'https://meet.google.com/abc-1234-def',
        startTime: new Date(Date.now() + 1000 * 60 * 60 * 1).toISOString(), 
      },
      {
        id: '2',
        title: 'Career Counseling',
        url: 'https://meet.google.com/xyz-5678-hij',
        startTime: new Date(Date.now() + 1000 * 60 * 60 * 5).toISOString(), 
      },
      {
        id: '3',
        title: 'Science Q&A',
        url: 'https://meet.google.com/science-class',
        startTime: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2hr ago
      },
      {
        id: '4',
        title: 'Past English Session',
        url: 'https://meet.google.com/eng-session',
        startTime: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
      },
    ];

    // Simulate async fetch
    setTimeout(() => {
      setLinks(dummyData);
      setLoading(false);
    }, 1000);
  }, [studentId]);

  const now = new Date();

  const filteredLinks = links.filter(link => {
    const sessionTime = new Date(link.startTime);
    return filter === 'upcoming' ? sessionTime >= now : sessionTime < now;
  });

  const totalPages = Math.ceil(filteredLinks.length / itemsPerPage);
  const paginatedLinks = filteredLinks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getCountdown = (startTime) => {
    const diff = new Date(startTime) - new Date();
    if (diff <= 0) return 'Started';

    const mins = Math.floor(diff / 1000 / 60) % 60;
    const hours = Math.floor(diff / 1000 / 60 / 60) % 24;
    const days = Math.floor(diff / 1000 / 60 / 60 / 24);

    return `${days}d ${hours}h ${mins}m`;
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 max-w-3xl mx-auto">
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
      ) : filteredLinks.length === 0 ? (
        <p className="text-gray-500">No {filter} sessions found.</p>
      ) : (
        <ul className="space-y-4">
          {paginatedLinks.map(link => (
            <li
              key={link.id}
              className="bg-gray-50 p-4 rounded-lg shadow-sm border flex justify-between items-center"
            >
              <div>
                <h4 className="font-medium text-lg text-gray-800">{link.title}</h4>
                <p className="text-sm text-gray-600">
                  📅 {new Date(link.startTime).toLocaleString()}
                </p>
                {filter === 'upcoming' && (
                  <p className="text-green-600 text-sm">
                    ⏳ {getCountdown(link.startTime)}
                  </p>
                )}
              </div>
              <a
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="bg-green-600 hover:bg-green-200 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2"
              >
                Join <FaExternalLinkAlt size={12} />
              </a>
            </li>
          ))}
        </ul>
      )}

      {/* Pagination Controls */}
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

export default StudentMeetLinks;



[
  {
    "id": "abc123",
    "title": "Session with Mr. James",
    "url": "https://meet.google.com/abc-defg-hij",
    "startTime": "2025-06-21T14:00:00Z"
  }
]
