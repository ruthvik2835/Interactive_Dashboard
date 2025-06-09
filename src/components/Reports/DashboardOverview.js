// components/DashboardOverview.jsx
import React, { useState, useEffect } from 'react';

const DashboardOverview = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    revenue: 0,
    orders: 0,
    growth: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch dashboard stats
    const fetchStats = async () => {
      try {
        // Replace with actual API call
        setTimeout(() => {
          setStats({
            totalUsers: 1234,
            revenue: 45678,
            orders: 567,
            growth: 12.5
          });
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 col-span-full">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Dashboard Overview</h3>
          <div className="animate-pulse bg-gray-200 rounded-full h-4 w-20"></div>
        </div>
        <div className="space-y-4">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-gray-100 rounded-lg p-4 space-y-3">
                  <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200 col-span-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Dashboard Overview</h3>
          <p className="text-sm text-gray-500 mt-1">Key performance metrics at a glance</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-xs text-gray-500">Live</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Total Users Card */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200 hover:border-blue-300 transition-colors duration-200 group">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white text-sm group-hover:scale-110 transition-transform duration-200">
                  👥
                </div>
                <h4 className="text-sm font-medium text-gray-600">Total Users</h4>
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-1">
                {stats.totalUsers.toLocaleString()}
              </p>
              <div className="flex items-center space-x-1">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  +5.2%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Revenue Card */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200 hover:border-green-300 transition-colors duration-200 group">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center text-white text-sm group-hover:scale-110 transition-transform duration-200">
                  💰
                </div>
                <h4 className="text-sm font-medium text-gray-600">Revenue</h4>
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-1">
                ${stats.revenue.toLocaleString()}
              </p>
              <div className="flex items-center space-x-1">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  +{stats.growth}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Orders Card */}
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200 hover:border-orange-300 transition-colors duration-200 group">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white text-sm group-hover:scale-110 transition-transform duration-200">
                  📦
                </div>
                <h4 className="text-sm font-medium text-gray-600">Orders</h4>
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-1">
                {stats.orders}
              </p>
              <div className="flex items-center space-x-1">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  -2.1%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Conversion Card */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200 hover:border-purple-300 transition-colors duration-200 group">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center text-white text-sm group-hover:scale-110 transition-transform duration-200">
                  📈
                </div>
                <h4 className="text-sm font-medium text-gray-600">Conversion</h4>
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-1">3.2%</p>
              <div className="flex items-center space-x-1">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  +0.8%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
        <button className="flex-1 inline-flex items-center justify-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 shadow-sm">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          View Details
        </button>
        <button className="flex-1 inline-flex items-center justify-center px-4 py-2.5 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 shadow-sm">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export Data
        </button>
      </div>
    </div>
  );
};

export default DashboardOverview;
