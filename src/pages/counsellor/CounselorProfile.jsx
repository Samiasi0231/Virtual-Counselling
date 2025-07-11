import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosClient from "../../utils/axios-client-analytics";

const CounselorProfile = () => {
  const { id } = useParams(); // get mentor_id from URL
  const navigate = useNavigate();
  const [counselor, setCounselor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounselor = async () => {
      try {
        const res = await axiosClient.get(`/vpc/get-counselor/${id}/`, {
          headers: {
            Authorization: `Bearer YOUR_TOKEN_HERE`, 
          },
        });
        setCounselor(res.data);
      } catch (err) {
        console.error('Error fetching counselor:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCounselor();
  }, [id]);

  if (loading) return <div className="text-center py-10">Loading profile...</div>;
  if (!counselor) return <div className="text-center text-red-500">Counselor not found.</div>;

  return (
    <div className="overflow-auto mx-auto shadow-lg rounded-lg font-sans px-4 sm:px-6 lg:px-8 py-8 w-full bg-white">
      {/* Avatar + Info */}
      <div className="flex items-center space-x-6">
        <img
          src={
            counselor.profilePhoto?.best ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(
              counselor.fullname
            )}&background=4F46E5&color=fff&size=128`
          }
          alt={counselor.fullname}
          className="w-28 h-28 rounded-full object-cover shadow-md"
        />
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">{counselor.fullname}</h2>
          <p className="text-sm text-gray-600">
            {counselor.professional_summary || "Certified Counselor"}
          </p>
          <p className="text-sm text-gray-500">
            {counselor.city || "No city provided"}
          </p>
        </div>
      </div>

      {/* Bio */}
      <div className="mt-6">
        <h3 className="text-lg font-medium text-gray-700">About</h3>
        <p className="text-gray-600 mt-1 text-sm">
          {counselor.bio || "No bio available."}
        </p>
      </div>

      {/* Specializations */}
      <div className="mt-4">
        <h3 className="text-lg font-medium text-gray-700">Specializations</h3>
        <div className="flex flex-wrap gap-2 mt-2">
          {counselor.specializations?.length > 0 ? (
            counselor.specializations.map((item, i) => (
              <span
                key={i}
                className="bg-purple-100 text-purple-600 text-sm px-3 py-1 rounded-full"
              >
                {item}
              </span>
            ))
          ) : (
            <span className="text-sm text-gray-500">Not provided</span>
          )}
        </div>
      </div>

      {/* Statistics (Optional Placeholder Data) */}
      <div className="mt-6">
        <h3 className="text-lg font-medium text-gray-700">Statistics</h3>
        <div className="grid grid-cols-3 gap-4 mt-2">
          <div className="bg-gray-50 p-3 rounded text-center shadow-sm">
            <h4 className="text-sm font-semibold text-gray-700">Clients</h4>
            <p className="text-gray-600 text-base">34 Active</p>
          </div>
          <div className="bg-gray-50 p-3 rounded text-center shadow-sm">
            <h4 className="text-sm font-semibold text-gray-700">Sessions</h4>
            <p className="text-gray-600 text-base">87 this month</p>
          </div>
          <div className="bg-gray-50 p-3 rounded text-center shadow-sm">
            <h4 className="text-sm font-semibold text-gray-700">Rating</h4>
            <p className="text-yellow-500 text-base">4.9 ★</p>
          </div>
        </div>
      </div>

      {/* Availability */}
      <div className="mt-4">
        <h3 className="text-lg font-medium text-gray-700">Availability</h3>
        <p className="text-sm text-gray-600 mt-1">
          {counselor.availability_information || "Not specified"}
        </p>
      </div>

      {/* Footer Actions */}
      <div className="flex justify-between mt-6 gap-3">
       <button
          className="flex-1 bg-blue-500 text-white text-sm font-semibold py-2 px-4 rounded hover:bg-blue-700"
          onClick={() => navigate('/student/chat')}
       >
          Message
        </button>
      <button
          className="flex-1 bg-green-600 text-white text-sm font-semibold py-2 px-4 rounded hover:bg-green-700"
        onClick={() => navigate('/student/calendar')}
        >
         Schedule
        </button>
       </div> 
    </div>
  );
};

export default CounselorProfile;
