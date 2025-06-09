// components/AnalyticsComponent.jsx
import React, { useState, useEffect } from 'react';
/**
 * @param {int} trackingId
 */
const AnalyticsComponent = ({ trackingId }) => {
  const [chartData, setChartData] = useState([]);
  const [timeRange, setTimeRange] = useState('7d');
  const [loading, setLoading] = useState(true);

  const timeRanges = [
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '90d', label: '90 Days' },
    { value: '1y', label: '1 Year' }
  ];

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      setLoading(true);
      try {
        // Simulate API call
        setTimeout(() => {
          const mockData = [
            { label: 'Mon', value: 60 },
            { label: 'Tue', value: 80 },
            { label: 'Wed', value: 45 },
            { label: 'Thu', value: 90 },
            { label: 'Fri', value: 75 },
            { label: 'Sat', value: 65 },
            { label: 'Sun', value: 85 }
          ];
          setChartData(mockData);
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error('Failed to fetch analytics data:', error);
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [timeRange]);

  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
  };

  const calculateAverage = () => {
    if (chartData.length === 0) return 0;
    const sum = chartData.reduce((acc, item) => acc + item.value, 0);
    return Math.round(sum / chartData.length);
  };

  const getPeakValue = () => {
    if (chartData.length === 0) return 0;
    return Math.max(...chartData.map(item => item.value));
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 col-span-full lg:col-span-2">
        <div className="animate-pulse">
          <div className="flex justify-between items-center mb-6">
            <div className="h-6 bg-gray-200 rounded w-24"></div>
            <div className="flex space-x-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-8 bg-gray-200 rounded w-16"></div>
              ))}
            </div>
          </div>
          <div className="h-64 bg-gray-100 rounded-lg mb-4"></div>
          <div className="grid grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="text-center">
                <div className="h-4 bg-gray-200 rounded w-16 mx-auto mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-12 mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200 col-span-full lg:col-span-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div className="mb-4 sm:mb-0">
          <h3 className="text-lg font-semibold text-gray-900">Analytics</h3>
          <p className="text-sm text-gray-500 mt-1">Tracking ID :- {trackingId}</p>
        </div>
        
        {/* Time Range Selector */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          {timeRanges.map(range => (
            <button
              key={range.value}
              onClick={() => handleTimeRangeChange(range.value)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${
                timeRange === range.value
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>
      
      {/* Chart Container */}
      <div className="mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg p-6">
          <div className="flex items-end justify-center space-x-2 sm:space-x-4 h-48">
            {chartData.map((item, index) => (
              <div key={index} className="flex flex-col items-center space-y-2 group">
                <div className="relative">
                  <div 
                    className="w-8 sm:w-12 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-md transition-all duration-300 group-hover:from-blue-600 group-hover:to-blue-500 cursor-pointer shadow-sm"
                    style={{height: `${(item.value / 100) * 160}px`}}
                    title={`${item.label}: ${item.value}%`}
                  ></div>
                  {/* Value tooltip on hover */}
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                    {item.value}%
                  </div>
                </div>
                <span className="text-xs font-medium text-gray-600">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Analytics Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-center mb-2">
            <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span className="text-sm font-medium text-gray-600">Average</span>
          </div>
          <span className="text-2xl font-bold text-gray-900">{calculateAverage()}%</span>
        </div>
        
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-center mb-2">
            <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <span className="text-sm font-medium text-gray-600">Peak</span>
          </div>
          <span className="text-2xl font-bold text-gray-900">{getPeakValue()}%</span>
        </div>
        
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-center mb-2">
            <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <span className="text-sm font-medium text-gray-600">Trend</span>
          </div>
          <div className="flex items-center justify-center">
            <span className="text-2xl font-bold text-green-600 flex items-center">
              <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              +15%
            </span>
          </div>
        </div>
      </div>

      {/* Additional Insights */}
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="text-sm font-medium text-blue-800">Performance Insight</p>
            <p className="text-sm text-blue-700 mt-1">
              {timeRange === '7d' && "Weekly performance shows strong growth with Thursday being the peak day."}
              {timeRange === '30d' && "Monthly trends indicate consistent improvement in key metrics."}
              {timeRange === '90d' && "Quarterly analysis reveals sustained growth patterns."}
              {timeRange === '1y' && "Annual overview demonstrates significant year-over-year improvements."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsComponent;
