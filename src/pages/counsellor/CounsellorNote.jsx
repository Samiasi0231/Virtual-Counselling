import React, { useState, useEffect } from 'react';
import { FaUpload, FaFileAlt, FaDownload } from 'react-icons/fa';

const dummyStudents = [
  { id: 1, name: 'Jane Doe' },
  { id: 2, name: 'John Smith' },
];

function CounselorNoteSharing() {
  const [selectedStudent, setSelectedStudent] = useState('');
  const [noteText, setNoteText] = useState('');
  const [file, setFile] = useState(null);
  const [notes, setNotes] = useState([]);

  // Simulate previously uploaded notes (from backend)
  useEffect(() => {
    const dummyNotes = [
      {
        id: 101,
        studentName: 'Jane Doe',
        note: 'Stress relief techniques',
        fileName: 'stress_tips.pdf',
        fileUrl: '#',
        uploadedAt: '2025-06-19T10:15:00',
      },
    ];
    setNotes(dummyNotes);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedStudent || !file) return alert('Select a student and a file.');

    const newNote = {
      id: Date.now(),
      studentName: dummyStudents.find(s => s.id === parseInt(selectedStudent)).name,
      note: noteText,
      fileName: file.name,
      fileUrl: '#', // Replace with actual file URL when integrated with backend
      uploadedAt: new Date().toISOString(),
    };

    setNotes(prev => [newNote, ...prev]);
    setNoteText('');
    setFile(null);
  };

  return (
    <div className=" border-gray-200  overflow-auto mx-auto p-4 bg-white rounded-xl shadow">

      <h2 className="text-2xl font-semibold text-purple-700 mb-4">Share Notes with Students</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Student Selection */}
        <div>
          <label className="block mb-1 text-sm font-medium">Select Student</label>
          <select
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
          >
            <option value="">-- Choose Student --</option>
            {dummyStudents.map((student) => (
              <option key={student.id} value={student.id}>{student.name}</option>
            ))}
          </select>
        </div>

        {/* Optional Note Text */}
        <div>
          <label className="block mb-1 text-sm font-medium">Note (optional)</label>
          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            rows={3}
            placeholder="Type a short message..."
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
          />
        </div>

        {/* File Input */}
        <div>
          <label className="block mb-1 text-sm font-medium">Upload File</label>
          <input
            type="file"
            accept=".pdf,.doc,.docx,.txt"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full text-sm"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm flex items-center gap-2"
        >
          <FaUpload /> Upload Note
        </button>
      </form>

      {/* Notes List */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">Uploaded Notes</h3>
        {notes.length === 0 ? (
          <p className="text-gray-500">No notes uploaded yet.</p>
        ) : (
          <ul className="space-y-4">
            {notes.map(note => (
              <li key={note.id} className="bg-gray-50 p-4 rounded-lg shadow-sm border">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-800 mb-1">{note.studentName}</p>
                    <p className="text-sm text-gray-600 italic">{note.note}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Uploaded: {new Date(note.uploadedAt).toLocaleString()}
                    </p>
                  </div>
                  <a
                    href={note.fileUrl}
                    download={note.fileName}
                    className="flex items-center text-sm text-purple-700 hover:underline"
                  >
                    <FaFileAlt className="mr-2" /> {note.fileName}
                    <FaDownload className="ml-2" />
                  </a>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default CounselorNoteSharing;
