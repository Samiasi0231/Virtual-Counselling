import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Avatar from 'react-avatar';
import {FiMoreHorizontal} from "react-icons/fi";
import axiosClient from '../../utils/axios-client-analytics';

function List() {
  const [counselors, setCounselors] = useState([]);
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    const storedUserType = localStorage.getItem("user_type");
    const allowedUserTypes = ["student", "counsellor"];
    setUserType(allowedUserTypes.includes(storedUserType) ? storedUserType : null);

    const fetchCounselors = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const res = await axiosClient.get('/vpc/get-counselors/', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = res.data;
        const formatted = Array.isArray(data)
          ? data.map(c => ({
              id: c.item_id,
              fullName: c.fullname,
              role: c.isCounsellor ? 'Counselor' : 'User',
              online: c.onlineStatus,
              avatar: c.profilePhoto?.best || '',
            }))
          : [];

        setCounselors(formatted);
      } catch (err) {
        console.error('Error fetching counselors:', err);
      }
    };

    fetchCounselors();
  }, []);

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
      <div className="px-5 pt-5 pb-3">
        <h2 className="text-base font-serif sm:text-lg font-light text-gray-600 dark:text-gray-100 mb-4">
          👥 Counselor List
        </h2>

        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
          {counselors.length === 0 ? (
            <p className="text-gray-500 text-sm">No counselor data available.</p>
          ) : (
            counselors.map((c, index) => (
              <div
                key={c.id}
                className="flex items-start gap-3 p-3 rounded-xl bg-white shadow-sm hover:shadow-md transition-all relative group"
              >
                {/* Avatar with status dot */}
                <div className="relative shrink-0">
                  {c.avatar ? (
                    <img
                      src={c.avatar}
                      alt={c.fullName}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <Avatar name={c.fullName} size="48" round className="inline-block" />
                  )}
                  <span
                    className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-white rounded-full ${
                      c.online ? 'bg-green-500' : 'bg-red-500'
                    }`}
                  />
                </div>

                {/* Name and role */}
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-800 leading-tight">{c.fullName}</div>
                  <div className="text-sm text-gray-500">
                    {c.role} 
                  </div>
                     <span className={`${c.online ?  'text-green-600' : 'text-red-500'} text-sm font-sans`}>
                      {c.online ? 'Online' : 'Offline'}
                    </span>
                </div>

                {/* View more */}
                <Link
                  to={userType ? `/${userType}/counsellor/card` : '/unauthorized'}
                  className="text-gray-400 hover:text-purple-600 p-1"
                  title="View More"
                >
               <FiMoreHorizontal size={18} />
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default List;
