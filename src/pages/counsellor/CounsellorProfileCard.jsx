import React, { useState, useEffect } from 'react';
import axiosClient from "../../utils/axios-client-analytics";
import { Link, useNavigate } from 'react-router-dom';
import Avatar from 'react-avatar';


const CounsellorProfileCard = () => {
  const storedUserType = localStorage.getItem("user_type");
  const allowedUserTypes = ["student", "counsellor"];
  const userType = allowedUserTypes.includes(storedUserType) ? storedUserType : null;
const navigate = useNavigate();
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
  <div className="mb-6">
  <button
    onClick={() => navigate(-1)}
    className="flex items-center text-purple-600 hover:text-purple-800 font-medium"
  >
    ← Back
  </button>
</div>
 <div className="flex flex-col gap-2">
    {counselors.map((counselor, index) => (
      <div
        key={counselor.item_id}
        className="bg-white shadow-md rounded-xl p-6 flex flex-col justify-between h-full"
      >
        <div className="space-y-4">
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
              <h2 className="text-base font-semibold text-gray-800">
                {counselor.fullname}
              </h2>
              <p className="text-sm text-gray-500">{counselor.city}</p>
            </div>
          </div>

          <p className="text-sm text-gray-700">{counselor.bio}</p>

          <div>
            <p className="text-sm font-medium text-gray-800 mb-2">Specializations:</p>
            <div className="flex flex-wrap gap-2">
              {counselor.specializations.length > 0 ? (
                counselor.specializations.map((tag, i) => (
                  <span
                    key={i}
                    className="text-xs px-3 py-1 rounded-full bg-purple-100 text-purple-600"
                  >
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
        </div>

      <div className="pt-4 mt-auto">
  <Link
    to={userType ? `/${userType}/counsellor/profile/${counselor.item_id}` : "/unauthorized"}
    className="inline-block bg-purple-500 hover:bg-purple-700 text-white text-sm font-semibold py-2 px-4 rounded-lg"
  >
    View profile →
  </Link>
</div>

      </div>
    ))}
  </div>
    
    </div>
  );
};

export default CounsellorProfileCard;
