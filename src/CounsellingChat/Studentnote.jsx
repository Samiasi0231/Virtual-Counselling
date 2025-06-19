import React, { useEffect, useState } from 'react';
import { FaDownload, FaFileAlt, FaUserTie } from 'react-icons/fa';

function groupNotesByDate(notes) {
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();

  return notes.reduce((groups, note) => {
    const dateStr = new Date(note.uploadedAt).toDateString();
    let group = 'Older';

    if (dateStr === today) group = 'Today';
    else if (dateStr === yesterday) group = 'Yesterday';

    if (!groups[group]) groups[group] = [];
    groups[group].push(note);

    return groups;
  }, {});
}

function StudentReceivedNotes({ studentId }) {
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Simulated backend fetch
  useEffect(() => {
    const dummyNotes = [
      {
        id: 1,
        counselorName: 'Mr. James Oladele',
        noteText: 'Please review this before our next session.',
        fileName: 'Session_Overview.pdf',
        fileUrl: '#',
        uploadedAt: new Date().toISOString(),
        read: false,
      },
      {
        id: 2,
        counselorName: 'Mrs. Linda Okoro',
        noteText: 'Stress management handout.',
        fileName: 'stress_handout.docx',
        fileUrl: '#',
        uploadedAt: new Date(Date.now() - 86400000).toISOString(),
        read: true,
      },
      {
        id: 3,
        counselorName: 'Dr. Yusuf Ibrahim',
        noteText: 'Mindfulness technique steps.',
        fileName: 'mindfulness.pdf',
        fileUrl: '#',
        uploadedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
        read: false,
      },
    ];

    setTimeout(() => {
      setNotes(dummyNotes);
      setLoading(false);
    }, 400);
  }, [studentId]);

  const handleMarkAsRead = (noteId) => {
    setNotes(prev =>
      prev.map(note => note.id === noteId ? { ...note, read: true } : note)
    );
  };

  const filteredNotes = notes.filter(note =>
    note.counselorName.toLowerCase().includes(search.toLowerCase()) ||
    note.fileName.toLowerCase().includes(search.toLowerCase()) ||
    note.noteText.toLowerCase().includes(search.toLowerCase())
  );

  const grouped = groupNotesByDate(filteredNotes);

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-semibold text-purple-700 mb-4">Your Counselor Notes</h2>

      {/* 🔍 Search Bar */}
      <input
        type="text"
        placeholder="Search by counselor or file..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full mb-6 px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
      />

      {loading ? (
        <p className="text-gray-500">Loading notes...</p>
      ) : filteredNotes.length === 0 ? (
        <p className="text-gray-500">No matching notes found.</p>
      ) : (
        Object.keys(grouped).map(group => (
          <div key={group} className="mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">{group}</h3>
            <ul className="space-y-4">
              {grouped[group].map(note => (
                <li
                  key={note.id}
                  className={`border p-4 rounded-lg shadow-sm bg-gray-50 flex justify-between items-start`}
                >
                  <div onClick={() => handleMarkAsRead(note.id)}>
                    <p className="text-sm text-gray-600 flex items-center gap-2 mb-1">
                      <FaUserTie className="text-purple-600" /> {note.counselorName}
                    </p>
                    <p className="text-gray-800 font-medium">{note.noteText}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Uploaded: {new Date(note.uploadedAt).toLocaleString()}
                    </p>
                    {!note.read && (
                      <span className="inline-block mt-1 text-xs text-red-600 font-semibold">
                        🔔 Unread
                      </span>
                    )}
                  </div>
                  <a
                    href={note.fileUrl}
                    download={note.fileName}
                    onClick={() => handleMarkAsRead(note.id)}
                    className="bg-purple-600 text-white text-sm px-3 py-2 rounded-md flex items-center gap-2 hover:bg-purple-700"
                  >
                    <FaFileAlt /> {note.fileName}
                    <FaDownload size={12} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
}

export default StudentReceivedNotes;
