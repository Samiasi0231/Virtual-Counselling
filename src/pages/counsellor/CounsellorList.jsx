import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Avatar from 'react-avatar';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../../utils/axios-client-analytics';

function CounselorList() {
  const [counselors, setCounselors] = useState([]);
  const [userType, setUserType] = useState(null);
    const navigate =useNavigate()

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
   <div className="mt-4">
  <button
    onClick={() => navigate(-1)}
    className="flex items-center text-purple-600 hover:text-purple-800 mb-2 font-medium"
  >
    ← Back
  </button>
</div>
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
                  to={userType ? `/${userType}/counsellor/card` : "/unauthorized"}
                   className="text-purple-600 hover:underline text-sm"> 
                 View Details
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default CounselorList;























// import React, { useEffect, useState } from 'react';
// import { Link,useNavigate } from 'react-router-dom';
// import Avatar from 'react-avatar';
// import { useStateValue } from "../../Context/UseStateValue";
// import axiosClient from "../../utils/axios-client-analytics";

// function CounselorList() {
//   const navigate=useNavigate()
//   const [{ student, counsellor }] = useStateValue();
//   const user = student || counsellor;
//   const userType = user?.user_type;

//   const [counselors, setCounselors] = useState([]);

// useEffect(() => {
//   const fetchCounselors = async () => {
//     try {
//       const res = await axiosClient.get("/vpc/get-counselors/");
//       const formatted = res.data.map((counselor) => ({
//         id: counselor.item_id,
//         fullName: counselor.fullname,
//         profileImage:
//           counselor.profilePhoto?.best ||
//           counselor.profilePhoto?.medium ||
//           counselor.avatar ||
//           null,
//         status: counselor.onlineStatus ? "Active" : "Offline",
//         role: "Counselor",
//       }));
//       setCounselors(formatted);
//     } catch (err) {
//       console.error("Failed to fetch counselors", err);
//     }
//   };

//   fetchCounselors();
// }, []);


//   return (
//     <div className="overflow-x-auto bg-white shadow rounded-lg p-4">
//            <div className="mb-6">
//   <button
//     onClick={() => navigate(-1)}
//     className="flex items-center text-purple-600 hover:text-purple-800 font-medium"
//   >
//     ← Back
//   </button>
// </div>
//       <h2 className="text-xl font-bold mb-4 text-gray-800">Counselor List</h2>
//       <table className="min-w-full table-auto text-left text-sm">
//         <thead className="border-b bg-gray-100">
//           <tr>
//             <th className="px-4 py-2">Profile</th>
//             <th className="px-4 py-2">Full Name</th>
//             <th className="px-4 py-2">Role</th>
//             <th className="px-4 py-2">Status</th>
//             <th className="px-4 py-2">Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {counselors.length === 0 ? (
//             <tr>
//               <td colSpan="5" className="text-center py-4 text-gray-500">
//                 No counselor data available.
//               </td>
//             </tr>
//           ) : (
//             counselors.map((counselor) => (
//               <tr
//                 key={counselor.id}
//                 className="border-b hover:bg-gray-50 transition duration-200"
//               >
//                 <td className="px-4 py-2">
//                   {counselor.profileImage ? (
//                     <img
//                       src={counselor.profileImage}
//                       alt={counselor.fullName}
//                       className="w-10 h-10 rounded-full object-cover"
//                     />
//                   ) : (
//                     <Avatar
//                       name={counselor.fullName}
//                       size="40"
//                       round={true}
//                       className="inline-block"
//                     />
//                   )}
//                 </td>
//                 <td className="px-4 py-2 font-medium text-gray-800">{counselor.fullName}</td>
//                 <td className="px-4 py-2 text-gray-600">{counselor.role}</td>
//                 <td className="px-4 py-2">
//                   <span
//                     className={`inline-block h-2 w-2 rounded-full mr-2 ${
//                       counselor.status === 'Active' ? 'bg-green-500' : 'bg-red-500'
//                     }`}
//                   ></span>
//                   {counselor.status === 'Active' ? 'Online' : 'Offline'}
//                 </td>
//                 <td className="px-4 py-2">
//                   <Link
//                     to={userType ? `/${userType}/counsellor/card` : "/unauthorized"}
//                     className="text-purple-600 hover:underline text-sm"
//                   >
//                     View Details
//                   </Link>
//                 </td>
//               </tr>
//             ))
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// export default CounselorList;

