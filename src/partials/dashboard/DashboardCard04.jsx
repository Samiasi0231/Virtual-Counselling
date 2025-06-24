import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LastSessionCard = () => {
  const [sessionDate, setSessionDate] = useState('');
  const [counselor, setCounselor] = useState('');
  const [notes, setNotes] = useState('');
  const [goals, setGoals] = useState(['']);

  const [students, setStudents] = useState([]);         // list of student options
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [sendToAll, setSendToAll] = useState(false);     // toggle

  // Fetch students from backend (you can replace with actual API)
  useEffect(() => {
    async function fetchStudents() {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/students', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStudents(res.data);
      } catch (err) {
        console.error('Failed to fetch students', err);
      }
    }

    fetchStudents();
  }, []);

  const handleGoalChange = (index, value) => {
    const updatedGoals = [...goals];
    updatedGoals[index] = value;
    setGoals(updatedGoals);
  };

  const addGoalField = () => setGoals([...goals, '']);

  const handleSendSummary = async () => {
    if (!sessionDate || !counselor || !notes || goals.some((g) => !g.trim())) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const payload = {
        summary: { sessionDate, counselor, notes, goals },
        studentId: sendToAll ? null : selectedStudentId,
        sendToAll,
      };

      const token = localStorage.getItem('token');

      await axios.post('http://localhost:5000/api/summary/send', payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert('Summary sent successfully!');
    } catch (err) {
      console.error('Error sending summary:', err);
      alert('Failed to send summary');
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
      <h2 className="text-lg font-semibold text-purple-800">
        📝 Last Session Summary
      </h2>

      {/* Select recipient */}
      <div>
        <label className="block font-medium mb-1">Send To</label>
        <div className="flex items-center gap-2 mb-2">
          <input
            type="checkbox"
            checked={sendToAll}
            onChange={() => setSendToAll(!sendToAll)}
          />
          <span className="text-sm">Send to all students</span>
        </div>
        {!sendToAll && (
          <select
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">-- Select a student --</option>
            {students.map((student) => (
              <option key={student._id} value={student._id}>
                {student.name} ({student.email})
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Form fields */}
      <div>
        <label className="block font-medium">Date</label>
        <input
          type="date"
          value={sessionDate}
          onChange={(e) => setSessionDate(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label className="block font-medium">Counselor</label>
        <input
          type="text"
          value={counselor}
          onChange={(e) => setCounselor(e.target.value)}
          placeholder="CounselorIni "
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label className="block font-medium">Session Notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full p-2 border rounded"
          rows={3}
        />
      </div>

     <div>
  <label className="block font-medium">Goals & Actions</label>
  {goals.map((goal, idx) => (
    <div key={idx} className="flex items-center gap-2 mb-2">
      <input
        type="text"
        value={goal}
        onChange={(e) => handleGoalChange(idx, e.target.value)}
        placeholder={`Goal ${idx + 1}`}
        className="flex-1 p-2 border rounded"
      />
      <button
        type="button"
        onClick={() => {
          const updatedGoals = goals.filter((_, i) => i !== idx);
          setGoals(updatedGoals);
        }}
        className="text-red-500 font-bold text-lg px-2 hover:text-red-700"
        title="Remove goal"
      >
        ×
      </button>
    </div>
  ))}

  <button
    type="button"
    onClick={addGoalField}
    className="text-sm text-blue-600 hover:underline"
  >
    + Add another goal
  </button>
</div>


      {/* Submit */}
      <button
        onClick={handleSendSummary}
        className="bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700"
      >
        Send Summary {sendToAll ? 'to All Students' : ''}
      </button>
    </div>
  );
};

export default LastSessionCard;
