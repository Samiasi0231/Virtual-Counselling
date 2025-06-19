import React, { useState, useEffect } from 'react';
import { FaLink, FaPlus, FaExternalLinkAlt, FaClock } from 'react-icons/fa';

function CounselorMeetLinkManager({ counselorId }) {
  const [meetUrl, setMeetUrl] = useState('');
  const [links, setLinks] = useState([]);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [, forceUpdate] = useState(0); // for countdown rerender

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const linksPerPage = 3;

  useEffect(() => {
    const dummyLinks = [
      {
        id: '1',
        title: 'Career Session - June 20',
        url: 'https://meet.google.com/abc-1234-xyz',
        createdAt: new Date().toISOString(),
        startTime: new Date(Date.now() + 1000 * 60 * 60 * 2).toISOString(), // 2 hrs later
      },
      {
        id: '2',
        title: 'Academic Review',
        url: 'https://meet.google.com/review-session',
        createdAt: new Date().toISOString(),
        startTime: new Date(Date.now() + 1000 * 60 * 30).toISOString(), // 30 mins later
      },
      {
        id: '3',
        title: 'Past Counseling',
        url: 'https://meet.google.com/past-1',
        createdAt: new Date().toISOString(),
        startTime: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString(),
      },
      {
        id: '4',
        title: 'Team Planning',
        url: 'https://meet.google.com/team-plan',
        createdAt: new Date().toISOString(),
        startTime: new Date(Date.now() + 1000 * 60 * 60 * 5).toISOString(),
      },
      {
        id: '5',
        title: 'Parent Meeting',
        url: 'https://meet.google.com/parent-1',
        createdAt: new Date().toISOString(),
        startTime: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
      },
    ];
    setLinks(dummyLinks);

    const interval = setInterval(() => forceUpdate(n => n + 1), 1000);
    return () => clearInterval(interval);
  }, [counselorId]);

  const handleShareLink = () => {
    setError('');
    setSuccessMsg('');

    if (!meetUrl.trim() || !meetUrl.includes('meet.google.com')) {
      setError('Please enter a valid Google Meet URL.');
      return;
    }

    const newLink = {
      id: Date.now().toString(),
      title: `Session - ${new Date().toLocaleString()}`,
      url: meetUrl,
      createdAt: new Date().toISOString(),
      startTime: new Date(Date.now() + 1000 * 60 * 45).toISOString(), // default 45 mins later
    };

    setLinks(prev => [newLink, ...prev]);
    setMeetUrl('');
    setSuccessMsg('Link shared successfully!');
  };

  const getCountdown = (startTime) => {
    const diff = new Date(startTime) - new Date();
    if (diff <= 0) return 'Started';

    const seconds = Math.floor(diff / 1000) % 60;
    const mins = Math.floor(diff / 1000 / 60) % 60;
    const hours = Math.floor(diff / 1000 / 60 / 60) % 24;
    const days = Math.floor(diff / 1000 / 60 / 60 / 24);

    return `${days}d ${hours}h ${mins}m ${seconds}s`;
  };

  // Pagination logic
  const totalPages = Math.ceil(links.length / linksPerPage);
  const paginatedLinks = links.slice(
    (currentPage - 1) * linksPerPage,
    currentPage * linksPerPage
  );

  return (
    <div className="bg-white rounded-xl shadow p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold text-purple-700 flex items-center gap-2 mb-4">
        <FaLink /> Counselor Meeting Links
      </h2>

      {/* Input */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-3 mb-4">
        <input
          type="url"
          placeholder="Enter Google Meet link"
          value={meetUrl}
          onChange={e => setMeetUrl(e.target.value)}
          className="w-full md:flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button
          onClick={handleShareLink}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <FaPlus /> Share Link
        </button>
      </div>

      {/* Messages */}
      {error && <p className="text-red-600 mb-2">{error}</p>}
      {successMsg && <p className="text-green-600 mb-2">{successMsg}</p>}

      {/* Links */}
      <h3 className="font-semibold text-lg mb-3 text-gray-700">Shared Links</h3>
      {paginatedLinks.length === 0 ? (
        <p className="text-gray-500">No links to display.</p>
      ) : (
        <ul className="space-y-4">
          {paginatedLinks.map(link => {
            const isUpcoming = new Date(link.startTime) > new Date();
            return (
              <li
                key={link.id}
                className="bg-gray-50 p-4 rounded-lg shadow-sm border flex justify-between items-center"
              >
                <div>
                  <h4 className="font-medium text-gray-800">{link.title}</h4>
                  <p className="text-sm text-gray-600">
                    📅 Starts at: {new Date(link.startTime).toLocaleString()}
                  </p>
                  {isUpcoming && (
                    <p className="text-sm text-purple-600 flex items-center gap-1 mt-1">
                      <FaClock className="text-purple-600" /> Countdown: {getCountdown(link.startTime)}
                    </p>
                  )}
                  <p className="text-sm text-gray-500 truncate max-w-sm mt-1">{link.url}</p>
                </div>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2"
                >
                  Use Link <FaExternalLinkAlt size={12} />
                </a>
              </li>
            );
          })}
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

export default CounselorMeetLinkManager;
