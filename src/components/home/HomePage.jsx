import React from 'react';
import { useNavigate } from 'react-router-dom';
import background from '../../images/counsellor.jpeg';

const HomePage = () => {
  const navigate = useNavigate();

return (
    <div className="min-h-screen grid  grid-cols-1 lg:grid-cols-2"  style={{ backgroundColor: "#651adf" }}>
    
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
        </div>
      </div>
    </div>
  );
};

export default HomePage;
