import React, { useState } from 'react';
import Avatar from 'react-avatar'; // Fallback avatar component
import { Link } from 'react-router-dom'; // For client-side navigation

const CounsellorProfileCard = () => {
  // Get user type from localStorage (either 'student' or 'counsellor')
  const storedUserType = localStorage.getItem("user_type");
  const allowedUserTypes = ["student", "counsellor"];
  const userType = allowedUserTypes.includes(storedUserType) ? storedUserType : null;

  // Dummy data for 6 counselors
  const [counselors, setCounselors] = useState(
    Array.from({ length: 6 }).map((_, i) => ({
      id: i,
      name: 'Ini Johnson',
      experience: '7 Years',
      specialties: ['Anxiety', 'Depression', 'Mental Health', 'Trauma'],
      languages: ['English', 'Yoruba'],
      image: '', 
      profileUrl: `/profile/toluse-${i + 1}` 
    }))
  );

  // Handle uploading an image to override the avatar
  const handleImageUpload = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const newImageURL = URL.createObjectURL(file); 
      const updatedCounselors = [...counselors];
      updatedCounselors[index].image = newImageURL;
      setCounselors(updatedCounselors); 
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
        {counselors.map((counselor, index) => (
          <div key={counselor.id} className="bg-white shadow-md rounded-xl p-6 space-y-4 w-full">
            {/* Avatar and Top Info */}
           <div className="flex items-center justify-between">
  <div className="flex items-center gap-4">
    {/* Counselor Image or Avatar */}
    <label htmlFor={`image-upload-${index}`} className="cursor-pointer relative">
      {counselor.image ? (
        <img
          src={counselor.image}
          alt={counselor.name}
          className="w-12 h-12 rounded-full object-cover border border-gray-300"
        />
      ) : (
        <Avatar
          name={counselor.name}
          size="48"
          round={true}
          className="w-12 h-12"
        />
      )}
      <input
        type="file"
        id={`image-upload-${index}`}
        accept="image/*"
        onChange={(e) => handleImageUpload(e, index)}
        className="hidden"
      />
    </label>

    {/* Name and Experience */}
    <div>
      <h2 className="text-base font-semibold text-gray-800">{counselor.name}</h2>
      <p className="text-sm text-gray-500">Experience: {counselor.experience}</p>
    </div>
  </div>
</div>

            {/* Specialties */}
            <div>
              <p className="text-sm font-medium text-gray-800 mb-2">Specialties:</p>
              <div className="flex flex-wrap gap-2">
                {counselor.specialties.map((tag, i) => (
                  <span
                    key={i}
                    className="text-xs px-3  rounded-full bg-purple-100 text-purple-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Languages */}
            <div>
              <p className="text-sm font-medium text-gray-800 mb-2">Languages:</p>
              <div className="flex gap-3 text-xs text-purple-600">
                {counselor.languages.map((lang, i) => (
                  <span key={i}>{lang}</span>
                ))}
              </div>
            </div>

            {/* Status Button */}
            <div className="pt-2">
              <button className="w-full bg-purple-500 hover:bg-purple-700 text-white text-sm font-semibold py-2 rounded-lg">
                  <Link
                to={userType ? `/${userType}/profile` : "/unauthorized"}
              >
                View profile <span>→</span>
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
