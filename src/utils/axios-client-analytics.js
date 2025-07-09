import axios from "axios";

const axiosClient = axios.create ({baseURL: `${
        import.meta.env.VITE_ANALYTIC_API_BASE_URL }`});

// Create Interceptors
axiosClient.interceptors.request.use ( (config) => {
    const userToken = localStorage.getItem("USER_ACCESS_TOKEN");
    // Check which token is available and set the appropriate Authorization header
    if (userToken) {
        const cleanedToken = userToken.replace(/['"]+/g, '');
        config.headers.Authorization = `Bearer ${cleanedToken}`;
    }
    return config;
});
 
axiosClient.interceptors.response.use ( (response) => {
    return response;
}, (error) => {
    const {response} = error;
    // if (response && response.status >= 400 && response.status < 500) {
    //     localStorage.removeItem ("USER");
    //     localStorage.removeItem ("USER_ACCESS_TOKEN");
    // } 
    return Promise.reject (error);
});

export default axiosClient;



// import React, { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
// import Avatar from 'react-avatar';
// import { useStateValue } from "../../Context/UseStateValue";
// function CounselorList() {
//   const [{ student, counsellor }] = useStateValue();
//   const user = student || counsellor;
//   const userType = user?.user_type;

//   const [counselors, setCounselors] = useState([]);

//   useEffect(() => {
    
//     const dummyCounselors = [
//       {
//         id: 1,
//         fullName: 'Mr. James Oladele',
//         role: 'Counselor',
//         status: 'Active',
//         profileImage: '',
//       },
//       {
//         id: 2,
//         fullName: 'Mrs. Linda Okoro',
//         role: 'Counselor',
//         status: 'Offline',
//         profileImage: '',
//       },
//       {
//         id: 3,
//         fullName: 'Dr. Yusuf Ibrahim',
//         role: 'Counselor',
//         status: 'Active',
//         profileImage: '',
//       },
//     ];
//     setCounselors(dummyCounselors);
//   }, []);

//   const handleImageUpload = (e, index) => {
//     const file = e.target.files[0];
//     if (file) {
//       const newImageUrl = URL.createObjectURL(file);
//       const updated = [...counselors];
//       updated[index].profileImage = newImageUrl;
//       setCounselors(updated);
//     }
//   };

//   return (
//     <div className="overflow-x-auto bg-white shadow rounded-lg p-4">
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
//             counselors.map((counselor, index) => (
//               <tr
//                 key={counselor.id}
//                 className="border-b hover:bg-gray-50 transition duration-200"
//               >
//                 <td className="px-4 py-2">
//                   <label htmlFor={`upload-${index}`} className="cursor-pointer group relative">
//                     {counselor.profileImage?.trim() ? (
//                       <img
//                         src={counselor.profileImage}
//                         alt={counselor.fullName}
//                         className="w-10 h-10 rounded-full object-cover"
//                       />
//                     ) : (
//                       <Avatar
//                         name={counselor.fullName}
//                         size="40"
//                         round={true}
//                         className="inline-block"
//                       />
//                     )}
//                     <input
//                       id={`upload-${index}`}
//                       type="file"
//                       accept="image/*"
//                       className="hidden"
//                       onChange={(e) => handleImageUpload(e, index)}
//                     />
//                   </label>
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
//                <td className="px-4 py-2">
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