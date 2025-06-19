import React, { useEffect, useState } from 'react';

function StudentList() {
  const [students, setStudents] = useState([]);

  // Simulate fetching from backend
  useEffect(() => {
    // Replace this later with fetch('/api/students')
    const dummyData = [
      {
        id: 1,
        fullName: 'Jane Doe',
        role: 'Student',
        status: 'Active',
        profileImage: 'https://randomuser.me/api/portraits/women/44.jpg',
      },
      {
        id: 2,
        fullName: 'John Smith',
        role: 'Student',
        status: 'Offline',
        profileImage: 'https://randomuser.me/api/portraits/men/36.jpg',
      },
      {
        id: 3,
        fullName: 'Angela Moses',
        role: 'Student',
        status: 'Active',
        profileImage: 'https://randomuser.me/api/portraits/women/48.jpg',
      },
    ];

    setStudents(dummyData);
  }, []);

  return (
    <div className="overflow-x-auto bg-white shadow rounded-lg p-4">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Student List</h2>
      <table className="min-w-full table-auto text-left text-sm">
        <thead className="border-b bg-gray-100">
          <tr>
            <th className="px-4 py-2">Profile</th>
            <th className="px-4 py-2">Full Name</th>
            <th className="px-4 py-2">Role</th>
            <th className="px-4 py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {students.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center py-4 text-gray-500">
                No student data available.
              </td>
            </tr>
          ) : (
            students.map((student) => (
              <tr
                key={student.id}
                className="border-b hover:bg-gray-50 transition duration-200"
              >
                <td className="px-4 py-2">
                  <img
                    src={student.profileImage}
                    alt={student.fullName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </td>
                <td className="px-4 py-2 font-medium text-gray-800">{student.fullName}</td>
                <td className="px-4 py-2 text-gray-600">{student.role}</td>
                <td className="px-4 py-2">
                  <span
                    className={`inline-block h-2 w-2 rounded-full mr-2 ${
                      student.status === 'Active' ? 'bg-green-500' : 'bg-red-500'
                    }`}
                  ></span>
                  {student.status}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default StudentList;
