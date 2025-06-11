import React from 'react';

const ProfileSettings = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold mb-4">Profile & Settings</h1>
    <form className="space-y-4">
      <input type="text" placeholder="Full Name" className="input" />
      <input type="email" placeholder="Email" className="input" />
      <input type="password" placeholder="Password" className="input" />
      <select className="input">
        <option>Available</option>
        <option>Busy</option>
        <option>Offline</option>
      </select>
      <button className="btn">Save Changes</button>
    </form>
  </div>
);

export default ProfileSettings;
