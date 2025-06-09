// components/SettingsComponent.jsx
import React, { useState, useEffect } from 'react';

const SettingsComponent = () => {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    darkMode: false,
    autoSave: true,
    language: 'en',
    timezone: 'UTC'
  });
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const languages = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Spanish' },
    { value: 'fr', label: 'French' },
    { value: 'de', label: 'German' }
  ];

  const timezones = [
    { value: 'UTC', label: 'UTC' },
    { value: 'EST', label: 'Eastern Time' },
    { value: 'PST', label: 'Pacific Time' },
    { value: 'IST', label: 'India Standard Time' }
  ];

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedSettings = localStorage.getItem('userSettings');
        if (savedSettings) {
          setSettings(JSON.parse(savedSettings));
        }
      } catch (error) {
        console.error('Failed to load settings:', error);
      }
    };

    loadSettings();
  }, []);

  const handleSettingChange = async (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    
    if (settings.autoSave) {
      await saveSettings(newSettings);
    }
  };

  const saveSettings = async (settingsToSave = settings) => {
    setSaving(true);
    try {
      localStorage.setItem('userSettings', JSON.stringify(settingsToSave));
      
      setTimeout(() => {
        setSaving(false);
        setSaveMessage('Settings saved successfully!');
        setTimeout(() => setSaveMessage(''), 3000);
      }, 500);
    } catch (error) {
      console.error('Failed to save settings:', error);
      setSaving(false);
      setSaveMessage('Failed to save settings');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Settings</h3>
          <p className="text-sm text-gray-500 mt-1">Manage your preferences and account settings</p>
        </div>
        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
      </div>
      
      {/* Save Message */}
      {saveMessage && (
        <div className={`mb-4 p-3 rounded-lg text-sm ${
          saveMessage.includes('Failed') 
            ? 'bg-red-50 text-red-700 border border-red-200' 
            : 'bg-green-50 text-green-700 border border-green-200'
        }`}>
          {saveMessage}
        </div>
      )}
      
      {/* Settings Sections */}
      <div className="space-y-6">
        {/* Notifications Section */}
        <div className="border-b border-gray-200 pb-6">
          <h4 className="text-md font-medium text-gray-900 mb-4">Notifications</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-700">Email Notifications</label>
                <p className="text-sm text-gray-500">Receive email updates about your account</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.emailNotifications}
                  onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Appearance Section */}
        <div className="border-b border-gray-200 pb-6">
          <h4 className="text-md font-medium text-gray-900 mb-4">Appearance</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-700">Dark Mode</label>
                <p className="text-sm text-gray-500">Switch to dark theme</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.darkMode}
                  onChange={(e) => handleSettingChange('darkMode', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Preferences Section */}
        <div className="space-y-4">
          <h4 className="text-md font-medium text-gray-900">Preferences</h4>
          
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700">Auto Save</label>
              <p className="text-sm text-gray-500">Automatically save changes</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.autoSave}
                onChange={(e) => handleSettingChange('autoSave', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
              <select
                value={settings.language}
                onChange={(e) => handleSettingChange('language', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {languages.map(lang => (
                  <option key={lang.value} value={lang.value}>
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
              <select
                value={settings.timezone}
                onChange={(e) => handleSettingChange('timezone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {timezones.map(tz => (
                  <option key={tz.value} value={tz.value}>
                    {tz.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-6 border-t border-gray-200">
        <button 
          onClick={() => saveSettings()}
          disabled={saving}
          className="flex-1 inline-flex items-center justify-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {saving ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </>
          ) : (
            'Save Settings'
          )}
        </button>
        <button 
          onClick={() => setSettings({
            emailNotifications: true,
            darkMode: false,
            autoSave: true,
            language: 'en',
            timezone: 'UTC'
          })}
          className="flex-1 inline-flex items-center justify-center px-4 py-2.5 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
        >
          Reset to Default
        </button>
      </div>
    </div>
  );
};

export default SettingsComponent;
