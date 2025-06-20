import React, { useState } from 'react';
import { FaLink, FaPlus, FaExternalLinkAlt } from 'react-icons/fa';

// Dummy student data
const dummyStudents = [
  { id: 's1', name: 'John Doe' },
  { id: 's2', name: 'Mary Johnson' },
  { id: 's3', name: 'Ahmed Bello' },
  { id: 's4', name: 'Chinwe Okeke' },
];

function CounselorMeetLinkManager() {
  const [meetingTitle, setMeetingTitle] = useState('');
  const [meetUrl, setMeetUrl] = useState('');
  const [meetingDate, setMeetingDate] = useState('');
  const [meetingTime, setMeetingTime] = useState('');
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [links, setLinks] = useState([]);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const linksPerPage = 3;

  const allStudentIds = dummyStudents.map(s => s.id);
  const isAllSelected = selectedStudents.length === allStudentIds.length;

  const handleToggleStudent = (id) => {
    setSelectedStudents(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleToggleAll = () => {
    setSelectedStudents(prev =>
      isAllSelected ? [] : allStudentIds
    );
  };

  const handleShareLink = () => {
    setError('');
    setSuccessMsg('');

    if (!meetingTitle.trim()) {
      setError('Please enter a meeting title.');
      return;
    }

    if (!meetUrl.trim() || !meetUrl.includes('meet.google.com')) {
      setError('Please enter a valid Google Meet URL.');
      return;
    }

    if (!meetingDate || !meetingTime) {
      setError('Please select both date and time.');
      return;
    }

    if (selectedStudents.length === 0) {
      setError('Please select at least one student.');
      return;
    }

    const newLink = {
      id: Date.now().toString(),
      title: meetingTitle.trim(),
      url: meetUrl.trim(),
      date: meetingDate,
      time: meetingTime,
      recipients: selectedStudents,
    };

    setLinks(prev => [newLink, ...prev]);
    setMeetUrl('');
    setMeetingTitle('');
    setMeetingDate('');
    setMeetingTime('');
    setSelectedStudents([]);
    setSuccessMsg('Meeting link shared successfully!');
  };

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

      {/* Form Section */}
      <div className="space-y-4 mb-4">
        <input
          type="text"
          placeholder="Enter meeting title or topic"
          value={meetingTitle}
          onChange={e => setMeetingTitle(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

        <input
          type="url"
          placeholder="Enter Google Meet link"
          value={meetUrl}
          onChange={e => setMeetUrl(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

        <div className="grid grid-cols-2 gap-4">
          <input
            type="date"
            value={meetingDate}
            onChange={e => setMeetingDate(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <input
            type="time"
            value={meetingTime}
            onChange={e => setMeetingTime(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Student Selection */}
        <div>
          <p className="font-medium text-gray-700 mb-1">Select Students:</p>
          <div className="flex items-center gap-2 mb-2">
            <input
              type="checkbox"
              checked={isAllSelected}
              onChange={handleToggleAll}
              className="accent-purple-600"
            />
            <span className="text-sm text-purple-700 font-medium">Select All</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {dummyStudents.map(student => (
              <label key={student.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedStudents.includes(student.id)}
                  onChange={() => handleToggleStudent(student.id)}
                  className="accent-purple-600"
                />
                <span className="text-sm text-gray-700">{student.name}</span>
              </label>
            ))}
          </div>
        </div>

        <button
          onClick={handleShareLink}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <FaPlus /> Share Link
        </button>

        {error && <p className="text-red-600">{error}</p>}
        {successMsg && <p className="text-green-600">{successMsg}</p>}
      </div>

      {/* Shared Links */}
      <h3 className="font-semibold text-lg mb-3 text-gray-700">Shared Links</h3>
      {paginatedLinks.length === 0 ? (
        <p className="text-gray-500">No links to display.</p>
      ) : (
        <ul className="space-y-4">
          {paginatedLinks.map(link => {
            const recipientNames = dummyStudents
              .filter(s => link.recipients.includes(s.id))
              .map(s => s.name)
              .join(', ');

            return (
              <li
                key={link.id}
                className="bg-gray-50 p-4 rounded-lg shadow-sm border flex justify-between items-start gap-4"
              >
                <div>
                  <h4 className="font-medium text-gray-800">{link.title}</h4>
                  <p className="text-sm text-gray-600">📅 {link.date} ⏰ {link.time}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    👥 Sent to: {recipientNames || 'N/A'}
                  </p>
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

      {/* Pagination */}
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
