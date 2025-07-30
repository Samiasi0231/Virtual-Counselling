import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
 import axiosClient from '../../utils/axios-client-analytics';
// import { showSuccessToast, showErrorToast } from '../../utils/toast';

const CounselorProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [counselor, setCounselor] = useState(null);
  const [isSelf, setIsSelf] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    fullname: '',
    bio: '',
    city: '',
    availability_information: '',
  });

  useEffect(() => {
    const checkIdentity = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const me = await axiosClient.get('/vpc/me/', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setIsSelf(me.data?.item_id === id);
      } catch (err) {
        console.warn('Could not determine identity');
      }
    };

    checkIdentity();
  }, [id]);

  useEffect(() => {
    const fetchCounselor = async () => {
      try {
        const res = await axiosClient.get(`/vpc/get-counselor/${id}/`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('auth_token')}` },
        });

        setCounselor(res.data);
        setForm({
          fullname: res.data.fullname || '',
          bio: res.data.bio || '',
          city: res.data.city || '',
          availability_information: res.data.availability_information || '',
        });
      } catch (err) {
        console.error('Error fetching counselor:', err);
      } finally {
        setLoading(false);
      }
    };sexeds

    fetchCounselor();
  }, [id]);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await axiosClient.put(`/vpc/update-profile/`, form, {
        headers: { Authorization: `Bearer ${localStorage.getItem('auth_token')}` },
      });

      showSuccessToast('Profile updated!');
      setEditing(false);
      setCounselor(prev => ({ ...prev, ...form }));
    } catch (err) {
      showErrorToast('Update failed');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-10">Loading profile...</div>;
  if (!counselor) return <div className="text-center text-red-500">Counselor not found.</div>;

  return (
    <div className="overflow-auto mx-auto shadow-lg rounded-lg font-sans px-4 sm:px-6 lg:px-8 py-8 w-full bg-white">
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-purple-600 hover:text-purple-800 font-medium"
        >
          ← Back
        </button>
      </div>

      {/* Avatar + Info */}
      <div className="flex items-center space-x-6">
        <img
          src={
            counselor.profilePhoto?.best ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(counselor.fullname)}&background=4F46E5&color=fff&size=128`
          }
          alt={counselor.fullname}
          className="w-28 h-28 rounded-full object-cover shadow-md"
        />
        <div className="flex-1">
          {editing ? (
            <input
              name="fullname"
              value={form.fullname}
              onChange={handleChange}
              className="text-xl font-semibold border px-2 py-1 rounded w-full"
            />
          ) : (
            <h2 className="text-2xl font-semibold text-gray-800">{counselor.fullname}</h2>
          )}
          <p className="text-sm text-gray-500">{counselor.city || 'No city provided'}</p>
        </div>
      </div>

      {/* Bio */}
      <div className="mt-6">
        <h3 className="text-lg font-medium text-gray-700">About</h3>
        {editing ? (
          <textarea
            name="bio"
            value={form.bio}
            onChange={handleChange}
            rows={4}
            className="border rounded px-3 py-2 mt-1 w-full"
          />
        ) : (
          <p className="text-gray-600 mt-1 text-sm">{counselor.bio || 'No bio available.'}</p>
        )}
      </div>

      {/* Availability */}
      <div className="mt-4">
        <h3 className="text-lg font-medium text-gray-700">Availability</h3>
        {editing ? (
          <input
            name="availability_information"
            value={form.availability_information}
            onChange={handleChange}
            className="border rounded px-3 py-2 mt-1 w-full"
          />
        ) : (
          <p className="text-sm text-gray-600 mt-1">
            {counselor.availability_information || 'Not specified'}
          </p>
        )}
      </div>

      {/* Edit & Save */}
      {isSelf && (
        <div className="mt-6 flex gap-3 flex-wrap">
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700"
            >
              Edit My Profile
            </button>
          ) : (
            <>
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                onClick={() => {
                  setEditing(false);
                  setForm({
                    fullname: counselor.fullname || '',
                    bio: counselor.bio || '',
                    city: counselor.city || '',
                    availability_information: counselor.availability_information || '',
                  });
                }}
                className="bg-gray-300 text-gray-800 py-2 px-4 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default CounselorProfile;
