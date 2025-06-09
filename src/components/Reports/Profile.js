// components/ProfileComponent.jsx
import React, { useState, useEffect } from 'react';

const ProfileComponent = () => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    role: '',
    avatar: null
  });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setTimeout(() => {
          setProfile({
            name: 'John Doe',
            email: 'john.doe@example.com',
            phone: '+1 (555) 123-4567',
            company: 'Tech Corp',
            role: 'Senior Developer',
            avatar: null
          });
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error('Failed to load profile:', error);
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleInputChange = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      setTimeout(() => {
        setSaving(false);
        setEditing(false);
      }, 1000);
    } catch (error) {
      console.error('Failed to save profile:', error);
      setSaving(false);
    }
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfile(prev => ({ ...prev, avatar: e.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="flex justify-between items-center mb-6">
            <div className="h-6 bg-gray-200 rounded w-32"></div>
            <div className="h-8 bg-gray-200 rounded w-16"></div>
          </div>
          <div className="flex flex-col items-center space-y-4">
            <div className="w-24 h-24 bg-gray-200 rounded-full"></div>
            <div className="space-y-3 w-full">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded w-full"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">User Profile</h3>
          <p className="text-sm text-gray-500 mt-1">Manage your personal information</p>
        </div>
        <button 
          onClick={() => setEditing(!editing)}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
            editing 
              ? 'text-gray-700 bg-gray-100 hover:bg-gray-200' 
              : 'text-blue-700 bg-blue-100 hover:bg-blue-200'
          }`}
        >
          {editing ? 'Cancel' : 'Edit'}
        </button>
      </div>

      <div className="space-y-6">
        {/* Avatar Section */}
        <div className="flex flex-col items-center">
          <div className="relative">
            {profile.avatar ? (
              <img 
                src={profile.avatar} 
                alt="Profile" 
                className="w-24 h-24 rounded-full object-cover border-4 border-gray-100"
              />
            ) : (
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center text-3xl border-4 border-gray-100">
                👤
              </div>
            )}
            {editing && (
              <div className="absolute -bottom-2 -right-2">
                <input
                  type="file"
                  id="avatar-upload"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
                <label 
                  htmlFor="avatar-upload"
                  className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full cursor-pointer transition-colors duration-200 shadow-lg"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </label>
              </div>
            )}
          </div>
          {editing && (
            <p className="text-xs text-gray-500 mt-2">Click camera icon to change photo</p>
          )}
        </div>

        {/* Profile Fields */}
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            {editing ? (
              <input
                type="text"
                value={profile.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            ) : (
              <p className="text-gray-900 py-2 px-3 bg-gray-50 rounded-lg">{profile.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            {editing ? (
              <input
                type="email"
                value={profile.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            ) : (
              <p className="text-gray-900 py-2 px-3 bg-gray-50 rounded-lg">{profile.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
            {editing ? (
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            ) : (
              <p className="text-gray-900 py-2 px-3 bg-gray-50 rounded-lg">{profile.phone}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
              {editing ? (
                <input
                  type="text"
                  value={profile.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <p className="text-gray-900 py-2 px-3 bg-gray-50 rounded-lg">{profile.company}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
              {editing ? (
                <input
                  type="text"
                  value={profile.role}
                  onChange={(e) => handleInputChange('role', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <p className="text-gray-900 py-2 px-3 bg-gray-50 rounded-lg">{profile.role}</p>
              )}
            </div>
          </div>
        </div>

        {/* Save Button */}
        {editing && (
          <div className="pt-4 border-t border-gray-200">
            <button 
              onClick={handleSave}
              disabled={saving}
              className="w-full inline-flex items-center justify-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {saving ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving Changes...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileComponent;
