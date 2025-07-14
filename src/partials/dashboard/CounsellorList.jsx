import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Avatar from 'react-avatar';
import axiosClient from '../../utils/axios-client-analytics';

function CounselorList() {
  const [counselors, setCounselors] = useState([]);
  const [userType, setUserType] = useState(null);

useEffect(() => {
  const storedUserType = localStorage.getItem("user_type");
  const allowedUserTypes = ["student", "counsellor"];
  const resolvedUserType = allowedUserTypes.includes(storedUserType)
    ? storedUserType
    : null;
  setUserType(resolvedUserType);

  const fetchCounselors = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axiosClient.get('/vpc/get-counselors/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response.data;
      const formatted = Array.isArray(data)
        ? data.map((counsellor) => ({
            id: counsellor.item_id,
            fullName: counsellor.fullname,
            role: counsellor.isCounsellor ? 'Counselor' : 'User',
            status: counsellor.onlineStatus ? 'Active' : 'Offline',
            profileImage: counsellor.profilePhoto?.best || '',
          }))
        : [];

      setCounselors(formatted);
    } catch (error) {
      console.error('Error fetching counselors:', {
        status: error?.response?.status,
        data: error?.response?.data,
        message: error.message,
      });
    }
  };

  fetchCounselors();
}, []);
  const handleImageUpload = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const newImageUrl = URL.createObjectURL(file);
      const updated = [...counselors];
      updated[index].profileImage = newImageUrl;
      setCounselors(updated);
    }
  };

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 p-4 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">👥 Counselor List</h3>

      <div className="overflow-x-auto w-full">
        <table className="min-w-[600px] w-full table-auto text-left text-sm">
          <thead className="border-b bg-purple-300">
            <tr>
              <th className="px-4 py-2">Profile</th>
              <th className="px-4 py-2">Full Name</th>
              <th className="px-4 py-2">Role</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2 whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody>
            {counselors.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500">
                  No counselor data available.
                </td>
              </tr>
            ) : (
              counselors.map((counselor, index) => (
                <tr
                  key={counselor.id}
                  className="border-b hover:bg-gray-50 transition duration-200"
                >
                  <td className="px-4 py-2">
                    <label htmlFor={`upload-${index}`} className="cursor-pointer group relative">
                      {counselor.profileImage?.trim() ? (
                        <img
                          src={counselor.profileImage}
                          alt={counselor.fullName}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <Avatar
                          name={counselor.fullName}
                          size="40"
                          round={true}
                          className="inline-block"
                        />
                      )}
                      <input
                        id={`upload-${index}`}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageUpload(e, index)}
                      />
                    </label>
                  </td>
                  <td className="px-4 py-2 font-medium text-gray-800">{counselor.fullName}</td>
                  <td className="px-4 py-2 text-gray-600">{counselor.role}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`inline-block h-2 w-2 rounded-full mr-2 ${
                        counselor.status === 'Active' ? 'bg-green-500' : 'bg-red-500'
                      }`}
                    ></span>
                    {counselor.status === 'Active' ? 'Online' : 'Offline'}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <Link
                      to={userType ? `/${userType}/counsellor/card` : "/unauthorized"}
                      className="text-purple-600 hover:underline text-sm"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CounselorList;
