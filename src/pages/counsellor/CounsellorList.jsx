import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Avatar from 'react-avatar';
import { useStateValue } from "../../Context/UseStateValue";
import axiosClient from "../../utils/axios-client-analytics";

function CounselorList() {
  const [{ student, counsellor }] = useStateValue();
  const user = student || counsellor;
  const userType = user?.user_type;

  const [counselors, setCounselors] = useState([]);

  useEffect(() => {
    const fetchCounselors = async () => {
      try {
        const res = await axiosClient.get("/vpc/get-counselors/");
        const formatted = res.data.map((counselor) => ({
          id: counselor.item_id,
          fullName: counselor.fullname,
          profileImage: counselor.avatar,
          status: counselor.onlineStatus ? "Active" : "Offline",
          role: "Counselor",
        }));
        setCounselors(formatted);
      } catch (err) {
        console.error("Failed to fetch counselors", err);
      }
    };

    fetchCounselors();
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
            <th className="px-4 py-2">Actions</th>
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
            counselors.map((counselor) => (
              <tr
                key={counselor.id}
                className="border-b hover:bg-gray-50 transition duration-200"
              >
                <td className="px-4 py-2">
                  {counselor.profileImage ? (
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
                <td className="px-4 py-2">
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
  );
}

export default CounselorList;

