// import React, { useState, useEffect } from 'react';
// import { DayPicker } from 'react-day-picker';
// import 'react-day-picker/dist/style.css';


// const MOCK_AVAILABILITY = {
//   '2025-07-03': ['09:00 AM', '11:00 AM'],
//   '2025-07-05': ['10:00 AM'],
// };

// const CounselorAvailability = () => {
//   const [availability, setAvailability] = useState({});
//   const [selectedDate, setSelectedDate] = useState(null);
//   const [newTimeSlot, setNewTimeSlot] = useState('');
//   const [message, setMessage] = useState('');

//   // Load mock availability on mount
//   useEffect(() => {
//     setAvailability(MOCK_AVAILABILITY);
//   }, []);

//   const getFormattedDate = (date) =>
//     date ? date.toISOString().split('T')[0] : null;

//   const handleAddTimeSlot = () => {
//     if (!selectedDate || !newTimeSlot) return;

//     const key = getFormattedDate(selectedDate);
//     const existing = availability[key] || [];
//     if (existing.includes(newTimeSlot)) {
//       setMessage(' Slot already added.');
//       return;
//     }

//     const updated = {
//       ...availability,
//       [key]: [...existing, newTimeSlot],
//     };
//     setAvailability(updated);
//     setNewTimeSlot('');
//     setMessage('✅ Slot added.');
//   };

//   const handleRemoveSlot = (slot) => {
//     const key = getFormattedDate(selectedDate);
//     const updated = {
//       ...availability,
//       [key]: availability[key].filter((t) => t !== slot),
//     };
//     setAvailability(updated);
//     setMessage('Slot removed.');
//   };

//   const selectedDateKey = getFormattedDate(selectedDate);
//   const slots = availability[selectedDateKey] || [];

//   const modifiers = {
//     hasSlots: Object.keys(availability).map((date) => new Date(date)),
//   };

//   const modifiersClassNames = {
//     hasSlots: 'bg-blue-200 text-blue-900 font-semibold',
//   };

//   return (
// <div className=" sm:p-6 lg:px-10 py-6 border border-gray-200   overflow-auto mx-auto p-4 bg-white rounded-xl shadow">
//   <h2 className="text-2xl font-bold text-gray-800 mb-4">📅 Manage Availability</h2>

//   {/* Calendar */}
//   <div className="mb-6">
//     <DayPicker
//       mode="single"
//       selected={selectedDate}
//       onSelect={setSelectedDate}
//       modifiers={modifiers}
//       modifiersClassNames={modifiersClassNames}
//     />
//     <p className="text-sm text-gray-500 mt-2">
//       🔵 Dates in blue already have time slots
//     </p>
//   </div>

//   {/* Time Slot Editor */}
//   {selectedDate && (
//     <div className="mb-6">
//       <h3 className="text-lg font-medium text-gray-700 mb-2">
//         Set availability for {selectedDate.toDateString()}
//       </h3>

//       {/* Existing Slots */}
//       <div className="mb-3">
//         <p className="text-sm text-gray-600 mb-1">Current slots:</p>
//         {slots.length > 0 ? (
//           <ul className="list-disc list-inside space-y-1">
//             {slots.map((slot) => (
//               <li key={slot} className="flex justify-between items-center">
//                 <span>{slot}</span>
//                 <button
//                   className="text-red-500 text-sm hover:underline"
//                   onClick={() => handleRemoveSlot(slot)}
//                 >
//                   Remove
//                 </button>
//               </li>
//             ))}
//           </ul>
//         ) : (
//           <p className="text-sm text-gray-400">No slots set yet.</p>
//         )}
//       </div>

//       {/* Add New Slot */}
//       <div className="flex items-center space-x-2">
//         <input
//           type="text"
//           value={newTimeSlot}
//           onChange={(e) => setNewTimeSlot(e.target.value)}
//           placeholder="e.g. 02:00 PM"
//           className="border border-gray-300 px-3 py-2 rounded w-40"
//         />
//         <button
//           className="px-3 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
//           onClick={handleAddTimeSlot}
//         >
//           Add Slot
//         </button>
//       </div>

//       {message && <p className="mt-2 text-sm text-green-600">{message}</p>}
//     </div>
//   )}

//   {/* Save Button */}
//   <div className="text-right">
//     <button
//       className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
//       onClick={() => alert('Availability saved (mocked)')}
//     >
//       Save Changes
//     </button>
//   </div>
// </div>

// };

// export default CounselorAvailability;


// import React, { useState, useEffect } from 'react';
// import { FaLink, FaPlus, FaExternalLinkAlt } from 'react-icons/fa';
// import axiosClient from '../../utils/axios-client-analytics'; // your axios setup

// function CounselorMeetLinkManager() {
//   const [meetingTitle, setMeetingTitle] = useState('');
//   const [meetUrl, setMeetUrl] = useState('');
//   const [meetingDate, setMeetingDate] = useState('');
//   const [meetingTime, setMeetingTime] = useState('');
//   const [selectedStudents, setSelectedStudents] = useState([]);
//   const [links, setLinks] = useState([]);
//   const [error, setError] = useState('');
//   const [successMsg, setSuccessMsg] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const linksPerPage = 3;

//   const [searchQuery, setSearchQuery] = useState('');
//   const [allUsers, setAllUsers] = useState([]);
//   const [filteredUsers, setFilteredUsers] = useState([]);

//   // Fetch users from backend
//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const res = await axiosClient.get('/api/users'); // ⬅️ replace with your actual endpoint
//         setAllUsers(res.data);
//         setFilteredUsers(res.data);
//       } catch (err) {
//         console.error('Failed to fetch users:', err);
//       }
//     };

//     fetchUsers();
//   }, []);

//   // Dynamic select all logic
//   const allStudentIds = filteredUsers.map((u) => u.id);
//   const isAllSelected = selectedStudents.length === allStudentIds.length;

//   const handleToggleStudent = (id) => {
//     setSelectedStudents((prev) =>
//       prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
//     );
//   };

//   const handleToggleAll = () => {
//     setSelectedStudents((prev) =>
//       isAllSelected ? [] : [...new Set([...prev, ...allStudentIds])]
//     );
//   };

//   const handleShareLink = () => {
//     setError('');
//     setSuccessMsg('');

//     if (!meetingTitle.trim()) {
//       setError('Please enter a meeting title.');
//       return;
//     }

//     if (!meetUrl.trim() || !meetUrl.includes('meet.google.com')) {
//       setError('Please enter a valid Google Meet URL.');
//       return;
//     }

//     if (!meetingDate || !meetingTime) {
//       setError('Please select both date and time.');
//       return;
//     }

//     if (selectedStudents.length === 0) {
//       setError('Please select at least one student.');
//       return;
//     }

//     const newLink = {
//       id: Date.now().toString(),
//       title: meetingTitle.trim(),
//       url: meetUrl.trim(),
//       date: meetingDate,
//       time: meetingTime,
//       recipients: selectedStudents,
//     };

//     setLinks((prev) => [newLink, ...prev]);
//     setMeetUrl('');
//     setMeetingTitle('');
//     setMeetingDate('');
//     setMeetingTime('');
//     setSelectedStudents([]);
//     setSuccessMsg('Meeting link shared successfully!');
//   };

//   const handleSearchChange = (e) => {
//     const value = e.target.value;
//     setSearchQuery(value);

//     const filtered = allUsers.filter((user) =>
//       user.name.toLowerCase().includes(value.toLowerCase())
//     );
//     setFilteredUsers(filtered);
//   };

//   const totalPages = Math.ceil(links.length / linksPerPage);
//   const paginatedLinks = links.slice(
//     (currentPage - 1) * linksPerPage,
//     currentPage * linksPerPage
//   );

//   return (
//     <div className="overflow-auto mx-auto p-4 bg-white rounded-xl shadow">
//       <h2 className="text-2xl font-semibold text-purple-700 flex items-center gap-2 mb-4">
//         <FaLink /> Counselor Meeting Links
//       </h2>

//       {/* Form Section */}
//       <div className="space-y-4 mb-4">
//         <input
//           type="text"
//           placeholder="Enter meeting title or topic"
//           value={meetingTitle}
//           onChange={(e) => setMeetingTitle(e.target.value)}
//           className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
//         />

//         <input
//           type="url"
//           placeholder="Enter Google Meet link"
//           value={meetUrl}
//           onChange={(e) => setMeetUrl(e.target.value)}
//           className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
//         />

//         <div className="grid grid-cols-2 gap-4">
//           <input
//             type="date"
//             value={meetingDate}
//             onChange={(e) => setMeetingDate(e.target.value)}
//             className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
//           />
//           <input
//             type="time"
//             value={meetingTime}
//             onChange={(e) => setMeetingTime(e.target.value)}
//             className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
//           />
//         </div>

//         {/* Student Search & Selection */}
//         <div>
//           <p className="font-medium text-gray-700 mb-1">Select Students:</p>

//           <input
//             type="text"
//             placeholder="Search by name..."
//             value={searchQuery}
//             onChange={handleSearchChange}
//             className="w-full mb-3 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm"
//           />

//           <div className="mb-3">
//             <button
//               onClick={handleToggleAll}
//               className="text-sm text-purple-600 font-medium hover:underline"
//             >
//               {isAllSelected ? 'Deselect All' : 'Select All'}
//             </button>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
//             {filteredUsers.map((user) => {
//               const isSelected = selectedStudents.includes(user.id);
//               return (
//                 <div
//                   key={user.id}
//                   className="flex justify-between items-center bg-gray-50 px-3 py-2 border rounded"
//                 >
//                   <span className="text-sm text-gray-700">{user.name}</span>
//                   <button
//                     onClick={() => handleToggleStudent(user.id)}
//                     disabled={isSelected}
//                     className={`text-sm px-2 py-1 rounded ${
//                       isSelected
//                         ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
//                         : 'bg-purple-600 text-white hover:bg-purple-700'
//                     }`}
//                   >
//                     {isSelected ? 'Added' : 'Add'}
//                   </button>
//                 </div>
//               );
//             })}
//           </div>

//           {selectedStudents.length > 0 && (
//             <div className="mt-4">
//               <p className="text-sm text-gray-600 mb-2">Selected Students:</p>
//               <div className="flex flex-wrap gap-2">
//                 {selectedStudents.map((id) => {
//                   const student = allUsers.find((u) => u.id === id);
//                   return (
//                     <div
//                       key={id}
//                       className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm flex items-center gap-2"
//                     >
//                       {student?.name || id}
//                       <button
//                         onClick={() =>
//                           setSelectedStudents((prev) =>
//                             prev.filter((s) => s !== id)
//                           )
//                         }
//                         className="ml-1 text-purple-500 hover:text-purple-700"
//                       >
//                         ✕
//                       </button>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//           )}
//         </div>

//         <button
//           onClick={handleShareLink}
//           className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
//         >
//           <FaPlus /> Share Link
//         </button>

//         {error && <p className="text-red-600">{error}</p>}
//         {successMsg && <p className="text-green-600">{successMsg}</p>}
//       </div>

//       {/* Shared Links */}
//       <h3 className="font-semibold text-lg mb-3 text-gray-700">Shared Links</h3>
//       {paginatedLinks.length === 0 ? (
//         <p className="text-gray-500">No links to display.</p>
//       ) : (
//         <ul className="space-y-4">
//           {paginatedLinks.map((link) => {
//             const recipientNames = allUsers
//               .filter((s) => link.recipients.includes(s.id))
//               .map((s) => s.name)
//               .join(', ');

//             return (
//               <li
//                 key={link.id}
//                 className="bg-gray-50 p-4 rounded-lg shadow-sm border flex justify-between items-start gap-4"
//               >
//                 <div>
//                   <h4 className="font-medium text-gray-800">{link.title}</h4>
//                   <p className="text-sm text-gray-600">
//                     📅 {link.date} ⏰ {link.time}
//                   </p>
//                   <p className="text-sm text-gray-500 mt-1">
//                     👥 Sent to: {recipientNames || 'N/A'}
//                   </p>
//                   <p className="text-sm text-gray-500 truncate max-w-sm mt-1">
//                     {link.url}
//                   </p>
//                 </div>
//                 <a
//                   href={link.url}
//                   target="_blank"
//                   rel="noreferrer"
//                   className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2"
//                 >
//                   Use Link <FaExternalLinkAlt size={12} />
//                 </a>
//               </li>
//             );
//           })}
//         </ul>
//       )}

//       {/* Pagination */}
//       {totalPages > 1 && (
//         <div className="mt-6 flex justify-center items-center gap-4">
//           <button
//             onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
//             disabled={currentPage === 1}
//             className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
//           >
//             Prev
//           </button>
//           <span className="text-sm">
//             Page {currentPage} of {totalPages}
//           </span>
//           <button
//             onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
//             disabled={currentPage === totalPages}
//             className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
//           >
//             Next
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }

// export default CounselorMeetLinkManager;

import React, { useEffect, useState } from "react";
import { FaLink, FaPlus, FaExternalLinkAlt } from "react-icons/fa";
import axiosClient from "../../utils/axios-client-analytics";

const ShareMeetingLink = () => {
  const [meetingTitle, setMeetingTitle] = useState("");
  const [meetingLink, setMeetingLink] = useState("");
  const [meetingDate, setMeetingDate] = useState("");
  const [meetingTime, setMeetingTime] = useState("");
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [sharedLinks, setSharedLinks] = useState([]);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axiosClient.get("/vpc/get-users/");
        const fetched = Array.isArray(res.data) ? res.data : res.data.users || [];
           console.log(fetched)
        setUsers(fetched);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
    fetchUsers();
  }, []);

  // Search user by name
  useEffect(() => {
    if (search.trim() === "") {
      setSearchResults([]);
    } else {
      const filtered = users.filter(user =>
        `${user.firstname} ${user.lastname}`.toLowerCase().includes(search.toLowerCase())
      );
      setSearchResults(filtered);
    }
  }, [search, users]);

  const handleAddUser = (user) => {
    if (!selectedUsers.find(u => u.item_id === user.item_id)) {
      setSelectedUsers(prev => [...prev, user]);
    }
    setSearch("");
  };

  const handleRemoveUser = (id) => {
    setSelectedUsers(prev => prev.filter(user => user.item_id !== id));
  };

  const handleSubmit = async () => {
    setError("");
    setSuccessMsg("");

    if (!meetingTitle.trim()) {
      setError("Meeting title is required.");
      return;
    }
    if (!meetingLink.trim() || !meetingLink.includes("meet.google.com")) {
      setError("A valid Google Meet link is required.");
      return;
    }
    if (!meetingDate || !meetingTime) {
      setError("Date and time are required.");
      return;
    }
    if (selectedUsers.length === 0) {
      setError("Select at least one recipient.");
      return;
    }

    try {
      await axiosClient.post("/api/share-link", {
        meetingLink,
        meetingTitle,
        meetingDate,
        meetingTime,
        recipients: selectedUsers.map(u => u.item_id),
      });

      const newLink = {
        id: Date.now(),
        title: meetingTitle,
        url: meetingLink,
        date: meetingDate,
        time: meetingTime,
        recipients: selectedUsers,
      };

      setSharedLinks(prev => [newLink, ...prev]);
      setMeetingTitle("");
      setMeetingLink("");
      setMeetingDate("");
      setMeetingTime("");
      setSelectedUsers([]);
      setSuccessMsg("Meeting link shared successfully!");
    } catch (err) {
      console.error("Error sharing link:", err);
      setError("Failed to share meeting link.");
    }
  };

  return (
   <div className="bg-white rounded-xl shadow p-4  mx-auto overflow-x-auto">
      <h2 className="text-2xl font-semibold text-purple-700 flex items-center gap-2 mb-4">
        <FaLink /> Share Meeting Link
      </h2>

      <div className="space-y-4 mb-6">
        <input
          type="text"
          placeholder="Meeting Title"
          value={meetingTitle}
          onChange={(e) => setMeetingTitle(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
        />
        <input
          type="url"
          placeholder="Google Meet URL"
          value={meetingLink}
          onChange={(e) => setMeetingLink(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
        />
        <div className="grid grid-cols-2 gap-4">
          <input
            type="date"
            value={meetingDate}
            onChange={(e) => setMeetingDate(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          />
          <input
            type="time"
            value={meetingTime}
            onChange={(e) => setMeetingTime(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          />
        </div>

        {/* Search and Add Students */}
        <div>
          <p className="font-medium text-gray-700 mb-1">Add Students</p>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name"
            className="w-full border rounded px-3 py-2 mb-2"
          />
          {searchResults.length > 0 && (
            <div className="border rounded p-2 bg-gray-50 space-y-2">
              {searchResults.map(user => (
                <div key={user.item_id} className="flex justify-between items-center">
                  <span>{user.firstname} {user.lastname}</span>
                  <button
                    type="button"
                    onClick={() => handleAddUser(user)}
                    className="text-blue-600 text-sm hover:underline flex items-center gap-1"
                  >
                    <FaPlus /> Add
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Selected Users */}
        {selectedUsers.length > 0 && (
          <div>
            <p className="font-semibold text-gray-700">Recipients:</p>
            <ul className="space-y-1 mt-2">
              {selectedUsers.map(user => (
                <li
                  key={user.item_id}
                  className="flex justify-between items-center bg-gray-100 p-2 rounded"
                >
                  <span>{user.lastname}</span>
                  <button
                    onClick={() => handleRemoveUser(user.item_id)}
                    className="text-red-600 text-sm hover:underline"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Share Button */}
        <button
          onClick={handleSubmit}
          disabled={!meetingLink || !meetingTitle || selectedUsers.length === 0}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <FaPlus /> Share Link
        </button>

        {error && <p className="text-red-600">{error}</p>}
        {successMsg && <p className="text-green-600">{successMsg}</p>}
      </div>

      {/* Display Shared Links */}
      {sharedLinks.length > 0 && (
        <div>
          <h3 className="font-semibold text-lg mb-2 text-gray-700">Shared Links</h3>
          <ul className="space-y-4">
            {sharedLinks.map(link => (
              <li
                key={link.id}
                className="bg-gray-50 p-4 rounded-lg shadow-sm border flex justify-between items-start"
              >
                <div>
                  <h4 className="font-medium text-gray-800">{link.title}</h4>
                  <p className="text-sm text-gray-600">📅 {link.date} ⏰ {link.time}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    👥 Sent to: {link.recipients.map(u => u.lastname).join(", ")}
                  </p>
                  <p className="text-sm text-gray-500 truncate max-w-sm mt-1">{link.url}</p>
                </div>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded text-sm flex items-center gap-2"
                >
                  Open <FaExternalLinkAlt size={12} />
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ShareMeetingLink;