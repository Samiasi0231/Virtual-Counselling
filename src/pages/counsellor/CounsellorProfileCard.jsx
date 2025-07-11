import React, { useState, useEffect } from 'react';
import axiosClient from "../../utils/axios-client-analytics";
import Avatar from 'react-avatar';
import { Link } from 'react-router-dom';

const CounsellorProfileCard = () => {
  const storedUserType = localStorage.getItem("user_type");
  const allowedUserTypes = ["student", "counsellor"];
  const userType = allowedUserTypes.includes(storedUserType) ? storedUserType : null;

  const [counselors, setCounselors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosClient.get('/vpc/get-counselors/') 
      .then((res) => {
        setCounselors(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching counselors:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
        {counselors.map((counselor, index) => (
          <div key={counselor.item_id} className="bg-white shadow-md rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-4">
              {counselor.profilePhoto?.best ? (
                <img
                  src={counselor.profilePhoto.best}
                  alt={counselor.fullname}
                  className="w-12 h-12 rounded-full object-cover border border-gray-300"
                />
              ) : (
                <Avatar
                  name={counselor.fullname}
                  size="48"
                  round={true}
                  className="w-12 h-12"
                />
              )}
              <div>
                <h2 className="text-base font-semibold text-gray-800">{counselor.fullname}</h2>
                <p className="text-sm text-gray-500">{counselor.city}</p>
              </div>
            </div>

            <p className="text-sm text-gray-700">{counselor.bio}</p>

            <div>
              <p className="text-sm font-medium text-gray-800 mb-2">Specializations:</p>
              <div className="flex flex-wrap gap-2">
                {counselor.specializations.length > 0 ? (
                  counselor.specializations.map((tag, i) => (
                    <span key={i} className="text-xs px-3 py-1 rounded-full bg-purple-100 text-purple-600">
                      {tag}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-gray-400">None listed</span>
                )}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-800 mb-2">Languages:</p>
              <div className="flex flex-wrap gap-2">
                {counselor.languages.length > 0 ? (
                  counselor.languages.map((lang, i) => (
                    <span key={i} className="text-xs text-purple-600">{lang}</span>
                  ))
                ) : (
                  <span className="text-xs text-gray-400">None listed</span>
                )}
              </div>
            </div>

            <div className="pt-2">
              <button className="w-full bg-purple-500 hover:bg-purple-700 text-white text-sm font-semibold py-2 rounded-lg">
                <Link to={userType ? `/${userType}/counsellor/profile/${counselor.item_id}` : "/unauthorized"}>
                  View profile →
                </Link>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CounsellorProfileCard;
