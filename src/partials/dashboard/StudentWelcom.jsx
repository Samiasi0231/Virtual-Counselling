import React, { useEffect, useState } from 'react';
import axiosClient from '../../utils/axios-client-analytics';

function StudentWelocome() {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('USER_ACCESS_TOKEN');

    if (!token) return;

    const fetchUser = async () => {
      try {
        const res = await axiosClient.get('vpc/me/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('User data:', res.data);
        setUser(res.data || {}); 
      } catch (err) {
        console.error('Error fetching user:', err);
        setUser({ lastname: 'User' }); 
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
      <div className="px-5 pt-5">
        <header className="flex justify-between items-start mb-2">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
            {loading ? 'Loading...' : `Hi, ${user?.lastname || 'User'}`}
          </h2>
        </header>
        <h3>
          We're glad you're here. Whether you're looking for support, guidance, or just someone to talk to
          you're not alone. Take your time, explore at your own pace, and reach out when you're ready.
          Your journey to healing starts here. 💬
        </h3>
      </div>
    </div>
  );
}

export default StudentWelocome;
