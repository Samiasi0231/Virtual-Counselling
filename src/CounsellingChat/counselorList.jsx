import React, { useEffect, useState } from 'react';

function CounselorTable() {
  const [counselors, setCounselors] = useState([]);

  useEffect(() => {
    // Replace with fetch('/api/counselors') in real backend
    const dummyCounselors = [
      {
        id: 1,
        fullName: 'Mr. James Oladele',
        role: 'Counselor',
        status: 'Active',
        profileImage: 'https://randomuser.me/api/portraits/men/22.jpg',
      },
      {
        id: 2,
        fullName: 'Mrs. Linda Okoro',
        role: 'Counselor',
        status: 'Offline',
        profileImage: 'https://randomuser.me/api/portraits/women/25.jpg',
      },
      {
        id: 3,
        fullName: 'Dr. Yusuf Ibrahim',
        role: 'Counselor',
        status: 'Active',
        profileImage: 'https://randomuser.me/api/portraits/men/45.jpg',
      },
    ];

    setCounselors(dummyCounselors);
  }, []);

  return (
    <div className="overflow-x-auto bg-white shadow rounded-lg p-4">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Counselor List</h2>
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
          {counselors.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center py-4 text-gray-500">
                No counselor data available.
              </td>
            </tr>
          ) : (
            counselors.map((counselor) => (
              <tr
                key={counselor.id}
                className="border-b hover:bg-gray-50 transition duration-200"
              >
                <td className="px-4 py-2">
                  <img
                    src={counselor.profileImage}
                    alt={counselor.fullName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </td>
                <td className="px-4 py-2 font-medium text-gray-800">{counselor.fullName}</td>
                <td className="px-4 py-2 text-gray-600">{counselor.role}</td>
                <td className="px-4 py-2">
                  <span
                    className={`inline-block h-2 w-2 rounded-full mr-2 ${
                      counselor.status === 'Active' ? 'bg-green-500' : 'bg-red-500'
                    }`}
                  ></span>
                  {counselor.status}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default CounselorTable;
