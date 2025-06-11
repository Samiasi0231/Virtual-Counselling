import React from 'react';

const Logout = () => {
  const handleLogout = () => {
    alert('Logged out!');
    // Add real logout logic here
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Logout</h1>
      <button onClick={handleLogout} className="btn bg-red-500 hover:bg-red-600 text-white">
        Confirm Logout
      </button>
    </div>
  );
};

export default Logout;

