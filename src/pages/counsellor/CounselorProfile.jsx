import React, { useEffect, useState } from 'react';
import { useNavigate, useParams,Link,} from 'react-router-dom';
import axiosClient from '../../utils/axios-client-analytics';

const CounselorProfile = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [counselor, setCounselor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [startingChat, setStartingChat] = useState(false);

  useEffect(() => {
    const fetchCounselor = async () => {
      try {
        const res = await axiosClient.get(`/vpc/get-counselor/${id}/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
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

  const handleStartChat = async () => {
    setStartingChat(true);
    try {
      const token = localStorage.getItem('auth_token');
      const res = await axiosClient.post(`/vpc/start-chat/${id}/`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const chatId = res.data?.item_id;
      if (chatId) {
        navigate(`/student/chat?chatId=${chatId}`);
      } else {
        alert('Unable to start chat. Please try again.');
      }
    } catch (err) {
      console.error("Start chat error:", err);
      alert("An error occurred while starting chat.");
    } finally {
      setStartingChat(false);
    }
  };

  if (loading) return <div className="text-center py-10">Loading profile...</div>;
  if (!counselor) return <div className="text-center text-red-500">Counselor not found.</div>;

  return (
    <div className="overflow-auto mx-auto shadow-lg rounded-lg font-sans px-4 sm:px-6 lg:px-8 py-8 w-full bg-white">
 <div className="mb-6">
  <button
    onClick={() => navigate(-1)}
    className="flex items-center text-purple-600 hover:text-purple-800 font-medium"
  >
    ← Back
  </button>
</div>
      {/* Avatar + Basic Info */}
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
          <p className="text-sm text-gray-600">{counselor.professional_summary || "Certified Counselor"}</p>
          <p className="text-sm text-gray-500">{counselor.city || "No city provided"}</p>
        </div>
      </div>

      {/* About */}
      <div className="mt-6">
        <h3 className="text-lg font-medium text-gray-700">About</h3>
        <p className="text-gray-600 mt-1 text-sm">{counselor.bio || "No bio available."}</p>
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

      {/* Statistics */}
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

      {/* Action Buttons */}
      <div className="flex justify-between mt-6 gap-3">
        <button
          className={`flex-1 bg-blue-500 text-white text-sm font-semibold py-2 px-4 rounded hover:bg-blue-700 ${
            startingChat ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          onClick={handleStartChat}
          disabled={startingChat}
        >
          {startingChat ? 'Starting...' : 'Message'}
        </button>
      <button
  className="flex-1 bg-green-600 text-white text-sm font-semibold py-2 px-4 rounded hover:bg-green-700"
 onClick={() =>
  navigate(`/student/calendar/${id}`, {
    state: {
      fullname: counselor.fullname,
      profilePhoto:
        counselor.profilePhoto?.best ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(
          counselor.fullname
        )}&background=4F46E5&color=fff&size=128`
    }
  })
}

>
  Schedule
</button>
      </div>
    </div>
  );
};

export default CounselorProfile;
