
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

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axiosClient.get("/vpc/get-users/");
        const fetched = Array.isArray(res.data) ? res.data : res.data.users || [];
        setUsers(fetched);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
    fetchUsers();
  }, []);

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

    const dateTimeISO = new Date(`${meetingDate}T${meetingTime}`).toISOString();

    const payload = {
      title: meetingTitle,
      link: meetingLink,
      date_and_time: dateTimeISO,
      invitees: selectedUsers.map(u => u.item_id),
    };

    console.log("🔍 Sending payload:", payload);

    try {
      await axiosClient.post("/vpc/schedule-meeting/", payload);

      const newLink = {
        id: Date.now(),
        title: meetingTitle,
        url: meetingLink,
        date: meetingDate,
        time: meetingTime,
        recipients: selectedUsers,
      };
 console(newLink)
      setSharedLinks(prev => [newLink, ...prev]);
      setMeetingTitle("");
      setMeetingLink("");
      setMeetingDate("");
      setMeetingTime("");
      setSelectedUsers([]);
      setSuccessMsg("Meeting link shared successfully!");
    } catch (err) {
      console.error("Error sharing link:", err.response?.data || err.message);
      setError("Failed to share meeting link.");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-4 mx-auto overflow-x-auto">
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
