import React from 'react';
import { useNavigate } from 'react-router-dom';

const CounselorProfile = () => {
  const navigate = useNavigate();

  return (
    <div className="overflow-auto mx-auto shadow-lg rounded-lg font-sans px-4 sm:px-6 lg:px-8 py-8 w-full bg-white">
      {/* Avatar + Info */}
      <div className="flex items-center space-x-6">
        <img
          src="https://ui-avatars.com/api/?name=Olayemi+Smith&background=4F46E5&color=fff&size=128"
          alt="Dr. Olayemi Smith"
          className="w-28 h-28 rounded-full object-cover shadow-md"
        />
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">Dr. Olayemi Smith</h2>
          <p className="text-sm text-gray-600">Licensed Clinical Psychologist (Ph.D.)</p>
          <p className="text-sm text-gray-500">New York, NY • 10+ years experience</p>
        </div>
      </div>

      {/* Bio */}
      <div className="mt-6">
        <h3 className="text-lg font-medium text-gray-700">About</h3>
        <p className="text-gray-600 mt-1 text-sm">
          Dr. Smith specializes in cognitive behavioral therapy (CBT) for anxiety, depression, and trauma.
          She has over a decade of experience helping individuals improve emotional well-being.
        </p>
      </div>

      {/* Specializations */}
      <div className="mt-4">
        <h3 className="text-lg font-medium text-gray-700">Specializations</h3>
        <div className="flex flex-wrap gap-2 mt-2">
          {["Anxiety & Depression", "Trauma & PTSD", "Adolescent Counseling", "Grief & Loss"].map((item, i) => (
            <span key={i} className="bg-purple-100 text-purple-600 text-sm px-3 py-1 rounded-full">
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Statistics */}
      <div className="mt-6">
        <h3 className="text-lg font-medium text-gray-700">Statistics</h3>
        <div className="grid grid-cols-3 gap-4 mt-2">
          <div className="bg-gray-50 p-3 rounded-l-lg text-center shadow-sm">
            <h4 className="text-sm font-semibold text-gray-700">Clients</h4>
            <p className="text-gray-600 text-base">34 Active</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg text-center shadow-sm">
            <h4 className="text-sm font-semibold text-gray-700">Sessions</h4>
            <p className="text-gray-600 text-base">87 this month</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg text-center shadow-sm">
            <h4 className="text-sm font-semibold text-gray-700">Rating</h4>
            <p className="text-yellow-500 text-base">4.9 ★</p>
          </div>
        </div>
      </div>

      {/* Availability */}
      <div className="mt-4">
        <h3 className="text-lg font-medium text-gray-700">Availability</h3>
        <p className="text-sm text-gray-600 mt-1">Mon - Fri: 9 AM – 5 PM</p>
      </div>

      {/* Footer Actions */}
      <div className="flex justify-between mt-6 gap-3">
        <button
          className="flex-1 bg-blue-500 text-white text-sm font-semibold py-2 px-4 rounded hover:bg-blue-700"
          onClick={() => navigate('/chat')}
        >
          Message
        </button>
        <button
          className="flex-1 bg-green-600 text-white text-sm font-semibold py-2 px-4 rounded hover:bg-green-700"
          onClick={() => navigate('/calendar')}
        >
          Schedule
        </button>
      </div>
    </div>
  );
};

export default CounselorProfile;
