// import React, { useState } from 'react';
// import Avatar from 'react-avatar'; 
// import { Link } from 'react-router-dom'; 

// const CounsellorProfileCard = () => {
  
//   const storedUserType = localStorage.getItem("user_type");
//   const allowedUserTypes = ["student", "counsellor"];
//   const userType = allowedUserTypes.includes(storedUserType) ? storedUserType : null;

//   const [counselors, setCounselors] = useState(
//     Array.from({ length: 6 }).map((_, i) => ({
//       id: i,
//       name: 'Ini Johnson',
//       experience: '7 Years',
//       specialties: ['Anxiety', 'Depression', 'Mental Health', 'Trauma'],
//       languages: ['English', 'Yoruba'],
//       image: '', 
//       profileUrl: `/profile/toluse-${i + 1}` 
//     }))
//   );

//   const handleImageUpload = (e, index) => {
//     const file = e.target.files[0];
//     if (file) {
//       const newImageURL = URL.createObjectURL(file); 
//       const updatedCounselors = [...counselors];
//       updatedCounselors[index].image = newImageURL;
//       setCounselors(updatedCounselors); 
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 py-10 px-4">
//       <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
//         {counselors.map((counselor, index) => (
//           <div key={counselor.id} className="bg-white shadow-md rounded-xl p-6 space-y-4 w-full">
//             {/* Avatar and Top Info */}
//            <div className="flex items-center justify-between">
//   <div className="flex items-center gap-4">
//     {/* Counselor Image or Avatar */}
//     <label htmlFor={`image-upload-${index}`} className="cursor-pointer relative">
//       {counselor.image ? (
//         <img
//           src={counselor.image}
//           alt={counselor.name}
//           className="w-12 h-12 rounded-full object-cover border border-gray-300"
//         />
//       ) : (
//         <Avatar
//           name={counselor.name}
//           size="48"
//           round={true}
//           className="w-12 h-12"
//         />
//       )}
//       <input
//         type="file"
//         id={`image-upload-${index}`}
//         accept="image/*"
//         onChange={(e) => handleImageUpload(e, index)}
//         className="hidden"
//       />
//     </label>

//     {/* Name and Experience */}
//     <div>
//       <h2 className="text-base font-semibold text-gray-800">{counselor.name}</h2>
//       <p className="text-sm text-gray-500">Experience: {counselor.experience}</p>
//     </div>
//   </div>
// </div>
//   {/* Specialties */}
//             <div>
//               <p className="text-sm font-medium text-gray-800 mb-2">Specialties:</p>
//               <div className="flex flex-wrap gap-2">
//                 {counselor.specialties.map((tag, i) => (
//                   <span
//                     key={i}
//                     className="text-xs px-3  rounded-full bg-purple-100 text-purple-600"
//                   >
//                     {tag}
//                   </span>
//                 ))}
//               </div>
//             </div>

//             {/* Languages */}
//             <div>
//               <p className="text-sm font-medium text-gray-800 mb-2">Languages:</p>
//               <div className="flex gap-3 text-xs text-purple-600">
//                 {counselor.languages.map((lang, i) => (
//                   <span key={i}>{lang}</span>
//                 ))}
//               </div>
//             </div>

//             {/* Status Button */}
//             <div className="pt-2">
//               <button className="w-full bg-purple-500 hover:bg-purple-700 text-white text-sm font-semibold py-2 rounded-lg">
//                   <Link
//                 to={userType ? `/${userType}/Counsellor/profile` : "/unauthorized"}
//               >
//                 View profile <span>→</span>
//               </Link>
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default CounsellorProfileCard;

// import React from 'react';
// import { useNavigate } from 'react-router-dom';

// const CounselorProfile = () => {
//   const navigate = useNavigate();

//   return (
//     <div className="overflow-auto mx-auto shadow-lg rounded-lg font-sans px-4 sm:px-6 lg:px-8 py-8 w-full bg-white">
//       {/* Avatar + Info */}
//       <div className="flex items-center space-x-6">
//         <img
//           src="https://ui-avatars.com/api/?name=Olayemi+Smith&background=4F46E5&color=fff&size=128"
//           alt="Dr. Olayemi Smith"
//           className="w-28 h-28 rounded-full object-cover shadow-md"
//         />
//         <div>
//           <h2 className="text-2xl font-semibold text-gray-800">Dr. Olayemi Smith</h2>
//           <p className="text-sm text-gray-600">Licensed Clinical Psychologist (Ph.D.)</p>
//           <p className="text-sm text-gray-500">New York, NY • 10+ years experience</p>
//         </div>
//       </div>

//       {/* Bio */}
//       <div className="mt-6">
//         <h3 className="text-lg font-medium text-gray-700">About</h3>
//         <p className="text-gray-600 mt-1 text-sm">
//           Dr. Smith specializes in cognitive behavioral therapy (CBT) for anxiety, depression, and trauma.
//           She has over a decade of experience helping individuals improve emotional well-being.
//         </p>
//       </div>

//       {/* Specializations */}
//       <div className="mt-4">
//         <h3 className="text-lg font-medium text-gray-700">Specializations</h3>
//         <div className="flex flex-wrap gap-2 mt-2">
//           {["Anxiety & Depression", "Trauma & PTSD", "Adolescent Counseling", "Grief & Loss"].map((item, i) => (
//             <span key={i} className="bg-purple-100 text-purple-600 text-sm px-3 py-1 rounded-full">
//               {item}
//             </span>
//           ))}
//         </div>
//       </div>

//       {/* Statistics */}
//       <div className="mt-6">
//         <h3 className="text-lg font-medium text-gray-700">Statistics</h3>
//         <div className="grid grid-cols-3 gap-4 mt-2">
//           <div className="bg-gray-50 p-3 rounded-l-lg text-center shadow-sm">
//             <h4 className="text-sm font-semibold text-gray-700">Clients</h4>
//             <p className="text-gray-600 text-base">34 Active</p>
//           </div>
//           <div className="bg-gray-50 p-3 rounded-lg text-center shadow-sm">
//             <h4 className="text-sm font-semibold text-gray-700">Sessions</h4>
//             <p className="text-gray-600 text-base">87 this month</p>
//           </div>
//           <div className="bg-gray-50 p-3 rounded-lg text-center shadow-sm">
//             <h4 className="text-sm font-semibold text-gray-700">Rating</h4>
//             <p className="text-yellow-500 text-base">4.9 ★</p>
//           </div>
//         </div>
//       </div>

//       {/* Availability */}
//       <div className="mt-4">
//         <h3 className="text-lg font-medium text-gray-700">Availability</h3>
//         <p className="text-sm text-gray-600 mt-1">Mon - Fri: 9 AM – 5 PM</p>
//       </div>

//       {/* Footer Actions */}
//       <div className="flex justify-between mt-6 gap-3">
//         <button
//           className="flex-1 bg-blue-500 text-white text-sm font-semibold py-2 px-4 rounded hover:bg-blue-700"
//           onClick={() => navigate('/chat')}
//         >
//           Message
//         </button>
//         <button
//           className="flex-1 bg-green-600 text-white text-sm font-semibold py-2 px-4 rounded hover:bg-green-700"
//           onClick={() => navigate('/calendar')}
//         >
//           Schedule
//         </button>
//       </div>
//     </div>
//   );
// };

// export default CounselorProfile;

