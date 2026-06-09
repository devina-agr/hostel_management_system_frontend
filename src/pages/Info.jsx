import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../lib/api';

const initialProfile = {
  name: '',
  email: '',
  contactNo: '',
  branch: '',
  year: '',
  gender: '',
  hostelType: '',
  parentContactNo: '',
  roomNo: '',
  rollNo: '',
  address: ''
};

export default function Profile() {
  const [profile, setProfile] = useState(initialProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const completion = useMemo(() => {
    const values = Object.values(profile);
    const filled = values.filter((value) => String(value || '').trim() !== '').length;
    return Math.round((filled / values.length) * 100);
  }, [profile]);

  useEffect(() => {
    let cancelled = false;

    const loadProfile = async () => {
      try {
        const response = await apiFetch('/student/profile', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to load profile');
        }

        const data = await response.json();
        if (!cancelled && data) {
          setProfile((prev) => ({ ...prev, ...data }));
        }
      } catch (profileError) {
        if (!cancelled) {
          setError(profileError.message || 'Unable to load profile');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');

    try {
      const response = await apiFetch('/student/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(profile)
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || 'Failed to save profile');
      }

      const updated = await response.json().catch(() => profile);
      setProfile((prev) => ({ ...prev, ...updated }));
      alert('Profile updated successfully!');
    } catch (saveError) {
      setError(saveError.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-orange-500 font-semibold">Student Profile</p>
              <h1 className="text-3xl font-bold text-gray-900 mt-1">Complete your profile</h1>
              <p className="text-gray-600 mt-2">Keep your hostel details current and unlock roommate matching.</p>
            </div>
            <div className="rounded-2xl bg-orange-50 px-5 py-4 border border-orange-100">
              <div className="text-sm text-orange-700 font-medium">Profile completion</div>
              <div className="text-3xl font-bold text-orange-600">{completion}%</div>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/StudentDashboard" className="px-4 py-2 rounded-full bg-gray-900 text-white text-sm font-medium">Back to Dashboard</Link>
            <Link to="/preferences" className="px-4 py-2 rounded-full bg-blue-600 text-white text-sm font-medium">Open Preference Form</Link>
          </div>
          {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
        </div>

        <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8 space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Personal details</h2>
              <p className="text-sm text-gray-500">These fields are used across your hostel account.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {[
                ['name', 'Full name'],
                ['email', 'Email address'],
                ['contactNo', 'Contact number'],
                ['rollNo', 'Roll number'],
                ['branch', 'Branch'],
                ['year', 'Year'],
                ['gender', 'Gender'],
                ['hostelType', 'Hostel type'],
                ['parentContactNo', 'Parent contact number'],
                ['roomNo', 'Room number']
              ].map(([field, label]) => (
                <label key={field} className="space-y-2">
                  <span className="block text-sm font-medium text-gray-700">{label}</span>
                  <input
                    name={field}
                    value={profile[field] || ''}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
                  />
                </label>
              ))}
            </div>

            <label className="space-y-2 block">
              <span className="block text-sm font-medium text-gray-700">Address</span>
              <textarea
                name="address"
                value={profile.address || ''}
                onChange={handleChange}
                rows={4}
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
              />
            </label>

            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-[#1B3C53] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#234C6A] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
          </div>

          <aside className="space-y-6">
            <div className="bg-gradient-to-br from-blue-50 to-white rounded-3xl shadow-sm border border-blue-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900">Roommate matching</h3>
              <p className="text-sm text-gray-600 mt-2">Your roommate preferences are managed separately. Open the preference form after saving your details.</p>
              <Link to="/preferences" className="inline-flex mt-4 rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white">Complete preferences</Link>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900">Profile checklist</h3>
              <ul className="mt-4 space-y-3 text-sm text-gray-600">
                <li>Basic identity and contact details</li>
                <li>Hostel assignment and year information</li>
                <li>Parent contact for emergency use</li>
                <li>Roommate preferences from the separate form</li>
              </ul>
            </div>
          </aside>
        </form>
      </div>
    </div>
  );
}