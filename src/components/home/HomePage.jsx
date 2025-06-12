import React from 'react';
import { useNavigate } from 'react-router-dom';
import background from '../../images/counsellor.jpeg';

const HomePage = () => {
  const navigate = useNavigate();

return (
    <div className="min-h-screen grid bg-purple-600 grid-cols-1 lg:grid-cols-2">
    
      <div
        className="hidden lg:block bg-cover bg-center"
        style={{ backgroundImage: `url(${background})`}}

      />
      <div className=" flex items-center justify-center p-6">
        <div className="border border-white/20 rounded-2xl p-10 text-center text-white max-w-xl w-full shadow-xl">
          <h1 className="text-4xl font-bold mb-4">Welcome to GuidanceConnect</h1>
          <p className="text-lg text-gray-200 mb-8">
            A platform that connects students with counselors for support, guidance, and growth.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button
              onClick={() => navigate('/register?role=student')}
              className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl text-lg font-semibold transition"
            >
              I’m a Student
            </button>

            <button
              onClick={() => navigate('/register?role=counselor')}
              className="bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl text-lg font-semibold transition"
            >
              I’m a Counselor
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
