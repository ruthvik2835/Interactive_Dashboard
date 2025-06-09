// components/NotificationsComponent.jsx
import React, { useState, useEffect } from 'react';

const NotificationsComponent = () => {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const filterOptions = [
    { value: 'all', label: 'All' },
    { value: 'unread', label: 'Unread' },
    { value: 'important', label: 'Important' }
  ];

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        setTimeout(() => {
          const mockNotifications = [
            {
              id: 1,
              type: 'message',
              icon: '🔔',
              title: 'New message received',
              description: 'You have a new message from Sarah Johnson',
              timestamp: new Date(Date.now() - 5 * 60000),
              read: false,
              important: true
            },
            {
              id: 2,
              type: 'report',
              icon: '📊',
              title: 'Report generated',
              description: 'Your monthly analytics report is ready',
              timestamp: new Date(Date.now() - 30 * 60000),
              read: false,
              important: false
            },
            {
              id: 3,
              type: 'system',
              icon: '⚙️',
              title: 'System maintenance',
              description: 'Scheduled maintenance will occur tonight',
              timestamp: new Date(Date.now() - 2 * 60 * 60000),
              read: true,
              important: true
            },
            {
              id: 4,
              type: 'security',
              icon: '🔒',
              title: 'Security alert',
              description: 'New login detected from unknown device',
              timestamp: new Date(Date.now() - 24 * 60 * 60000),
              read: true,
              important: true
            }
          ];
          setNotifications(mockNotifications);
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error('Failed to load notifications:', error);
        setLoading(false);
      }
    };

    loadNotifications();
  }, []);

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const getFilteredNotifications = () => {
    switch (filter) {
      case 'unread':
        return notifications.filter(notif => !notif.read);
      case 'important':
        return notifications.filter(notif => notif.important);
      default:
        return notifications;
    }
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const filteredNotifications = getFilteredNotifications();
  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="flex justify-between items-center mb-4">
            <div className="h-6 bg-gray-200 rounded w-32"></div>
            <div className="h-8 bg-gray-200 rounded w-24"></div>
          </div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex space-x-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-3">
          <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
          {unreadCount > 0 && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
              {unreadCount} new
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-3">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {filterOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          
          {unreadCount > 0 && (
            <button 
              onClick={markAllAsRead}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Mark all read
            </button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5-5-5h5v-12h0z" />
              </svg>
            </div>
            <p className="text-gray-500">No notifications to display</p>
          </div>
        ) : (
          filteredNotifications.map(notification => (
            <div
              key={notification.id}
              className={`flex items-start space-x-3 p-3 rounded-lg border transition-colors duration-200 ${
                !notification.read 
                  ? 'bg-blue-50 border-blue-200 hover:bg-blue-100' 
                  : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                notification.important ? 'bg-red-100' : 'bg-gray-100'
              }`}>
                {notification.icon}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <p className={`text-sm font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                        {notification.title}
                      </p>
                      {notification.important && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          !
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{notification.description}</p>
                    <p className="text-xs text-gray-500 mt-2">{formatTimestamp(notification.timestamp)}</p>
                  </div>
                  
                  <div className="flex items-center space-x-1 ml-4">
                    {!notification.read && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="p-1 text-gray-400 hover:text-green-600 transition-colors duration-200"
                        title="Mark as read"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(notification.id)}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors duration-200"
                      title="Delete notification"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationsComponent;
