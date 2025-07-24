import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { FaLink, FaPlus, FaExternalLinkAlt, FaEdit, FaTrash } from "react-icons/fa";
import axiosClient from "../../utils/axios-client-analytics";
import { toast } from 'react-toastify';
const ShareMeetingLink = () => {
  const navigate = useNavigate();
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
  const [editMeetingId, setEditMeetingId] = useState(null);
  const [previousRecipients, setPreviousRecipients] = useState([]); 

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axiosClient.get("/vpc/get-users/", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setUsers(Array.isArray(res.data) ? res.data : res.data.users || []);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
    fetchUsers();
  }, []);

useEffect(() => {
  const fetchCounsellorMeetings = async () => {
    try {
      const page = 0;
const isPast = false;
      const res = await axiosClient.get(`/vpc/get-user-meetings/${page}/${isPast}/`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      const meetings = Array.isArray(res.data?.results) ? res.data.results : res.data || [];

      const formatted = meetings.map(link => {
        const dateObj = new Date(link.date_and_time);
        return {
          id: link.id || link._id,
          title: link.title,
          url: link.link,
          date: dateObj.toISOString().split("T")[0],
          time: dateObj.toTimeString().slice(0, 5),
          recipients: link.invitees || [],
        };
      });

      setSharedLinks(formatted);
    } catch (err) {
      console.error("Failed to load counsellor meetings:", err);
    }
  };

  fetchCounsellorMeetings();
}, []);
  useEffect(() => {
    if (!search.trim()) return setSearchResults([]);
    const filtered = users.filter(user =>
      `${user.firstname} ${user.lastname}`.toLowerCase().includes(search.toLowerCase())
    );
    setSearchResults(filtered);
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

  const resetForm = () => {
    setMeetingTitle("");
    setMeetingLink("");
    setMeetingDate("");
    setMeetingTime("");
    setSelectedUsers([]);
    setEditMeetingId(null);
    setPreviousRecipients([]);
  };

  const getSchemeArray = (prev, curr) => {
    const scheme = [];

    const prevIDs = prev.map(u => u.item_id);
    const currIDs = curr.map(u => u.item_id);

    const added = curr.filter(u => !prevIDs.includes(u.item_id));
    const removed = prev.filter(u => !currIDs.includes(u.item_id));

    added.forEach(u => scheme.push({ user_id: u.item_id, add: true }));
    removed.forEach(u => scheme.push({ user_id: u.item_id, add: false }));

    return scheme;
  };

  const handleSubmit = async () => {
    setError("");
    setSuccessMsg("");

    if (!meetingTitle.trim()) return setError("Meeting title is required.");
    if (!meetingLink.trim() || !meetingLink.includes("meet.google.com")) return setError("Valid Google Meet link required.");
    if (!meetingDate || !meetingTime) return setError("Date and time required.");
    if (!editMeetingId && selectedUsers.length === 0) return setError("Select at least one recipient.");

    const dateTimeISO = new Date(`${meetingDate}T${meetingTime}`).toISOString();

    try {
     if (editMeetingId) {
  const payload = {
    title: meetingTitle,
    link: meetingLink,
    date_and_time: dateTimeISO,
    invitees: selectedUsers.map(u => u.item_id),
  };

 await axiosClient.put(`/vpc/edit-meeting/${editMeetingId}/`, payload, {
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

  setSharedLinks(prev =>
    prev.map(link =>
      link.id === editMeetingId
        ? {
            ...link,
            title: meetingTitle,
            url: meetingLink,
            date: meetingDate,
            time: meetingTime,
            recipients: selectedUsers,
          }
        : link
    )
  );

  setSuccessMsg("Meeting updated successfully!");

      } else {
    
        const payload = {
          title: meetingTitle,
          link: meetingLink,
          date_and_time: dateTimeISO,
          invitees: selectedUsers.map(u => u.item_id),
        };

        const res = await axiosClient.post("/vpc/schedule-meeting/", payload, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        const newLink = {
          id: res.data?.id || res.data?._id,
          title: meetingTitle,
          url: meetingLink,
          date: meetingDate,
          time: meetingTime,
          recipients: selectedUsers,
        };

        setSharedLinks(prev => [newLink, ...prev]);
         toast.success("Meeting link shared successfully!");
      }

      resetForm();
    } catch (err) {
      console.error("Submit failed:", err.response?.data || err.message);
      setError("Failed to submit meeting.");
    }
  };

  const handleEdit = (link) => {
    setMeetingTitle(link.title);
    setMeetingLink(link.url);
    setMeetingDate(link.date);
    setMeetingTime(link.time);
    setSelectedUsers(link.recipients || []);
    setPreviousRecipients(link.recipients || []);
    setEditMeetingId(link.id);
    setSuccessMsg("");
    setError("");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this meeting?")) return;
    try {
      await axiosClient.delete(`/vpc/delete-meeting/${id}/`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setSharedLinks(prev => prev.filter(link => link.id !== id));
      if (editMeetingId === id) resetForm();
     toast.success("meeting delete Successful!");
    } catch (err) {
      console.error("Failed to delete meeting:", err.response?.data || err.message);
      toast.error("Failed to delete meeting.");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-4 mx-auto overflow-x-auto">
      <div className="mb-6">
        <button onClick={() => navigate(-1)} className="text-purple-600 hover:text-purple-800 font-medium">
          ← Back
        </button>
      </div>

      <h2 className="text-2xl font-semibold text-purple-700 flex items-center gap-2 mb-4">
        <FaLink /> {editMeetingId ? "Edit Meeting" : "Share Meeting Link"}
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

        {/* Invitees */}
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

        {selectedUsers.length > 0 && (
          <div>
            <p className="font-semibold text-gray-700">Recipients:</p>
            <ul className="space-y-1 mt-2">
              {selectedUsers.map(user => (
                <li key={user.item_id} className="flex justify-between items-center bg-gray-100 p-2 rounded">
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

        <button
          onClick={handleSubmit}
          disabled={!meetingLink || !meetingTitle || (!editMeetingId && selectedUsers.length === 0)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <FaPlus /> {editMeetingId ? "Update Meeting" : "Share Link"}
        </button>

        {error && <p className="text-red-600">{error}</p>}
        {successMsg && <p className="text-green-600">{successMsg}</p>}
      </div>

      {sharedLinks.length > 0 && (
        <div>
          <h3 className="font-semibold text-lg mb-2 text-gray-700">Shared Links</h3>
          <ul className="space-y-4">
            {sharedLinks.map(link => (
          <li className="bg-gray-50 p-4 rounded-lg shadow-sm border flex flex-col md:flex-row justify-between md:items-center gap-4">
  <div className="flex-1">
    <h4 className="font-medium text-gray-800">{link.title}</h4>
    <p className="text-sm text-gray-600">📅 {link.date} ⏰ {link.time}</p>
    <p className="text-sm text-gray-500 truncate max-w-full mt-1">{link.url}</p>
  </div>

  <div className="flex flex-wrap gap-2">
    <a
      href={link.url}
      target="_blank"
      rel="noreferrer"
      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded text-sm flex items-center gap-1"
    >
      Join <FaExternalLinkAlt size={12} />
    </a>
    <button
      onClick={() => handleEdit(link)}
      className="text-sm text-blue-600 hover:underline flex items-center gap-1"
    >
      <FaEdit /> Edit
    </button>
    <button
      onClick={() => handleDelete(link.id)}
      className="text-sm text-red-600 hover:underline flex items-center gap-1"
    >
      <FaTrash /> Delete
    </button>
  </div>
</li>
 ))}
 </ul>
  </div>
      )}
    </div>
  );
};

export default ShareMeetingLink;
