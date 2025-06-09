// components/ReportsComponent.jsx
import React, { useState, useEffect } from 'react';

const ReportsComponent = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(null);

  useEffect(() => {
    const loadReports = async () => {
      try {
        setTimeout(() => {
          const mockReports = [
            {
              id: 1,
              name: 'Monthly Sales Report',
              type: 'sales',
              description: 'Comprehensive sales analysis for the current month',
              lastGenerated: new Date(Date.now() - 2 * 24 * 60 * 60000),
              size: '2.4 MB',
              format: 'PDF',
              status: 'ready'
            },
            {
              id: 2,
              name: 'User Activity Report',
              type: 'analytics',
              description: 'User engagement and activity metrics',
              lastGenerated: new Date(Date.now() - 5 * 24 * 60 * 60000),
              size: '1.8 MB',
              format: 'Excel',
              status: 'ready'
            },
            {
              id: 3,
              name: 'Financial Summary',
              type: 'finance',
              description: 'Quarterly financial performance overview',
              lastGenerated: new Date(Date.now() - 7 * 24 * 60 * 60000),
              size: '3.2 MB',
              format: 'PDF',
              status: 'ready'
            },
            {
              id: 4,
              name: 'Inventory Report',
              type: 'inventory',
              description: 'Current stock levels and inventory analysis',
              lastGenerated: new Date(Date.now() - 1 * 24 * 60 * 60000),
              size: '1.5 MB',
              format: 'CSV',
              status: 'ready'
            }
          ];
          setReports(mockReports);
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error('Failed to load reports:', error);
        setLoading(false);
      }
    };

    loadReports();
  }, []);

  const handleDownload = async (reportId) => {
    try {
      const report = reports.find(r => r.id === reportId);
      console.log(`Downloading ${report.name}...`);
      
      const link = document.createElement('a');
      link.href = '#';
      link.download = `${report.name}.${report.format.toLowerCase()}`;
      link.click();
    } catch (error) {
      console.error('Failed to download report:', error);
    }
  };

  const handleGenerate = async (reportId) => {
    setGenerating(reportId);
    try {
      setTimeout(() => {
        setReports(prev =>
          prev.map(report =>
            report.id === reportId
              ? { ...report, lastGenerated: new Date(), status: 'ready' }
              : report
          )
        );
        setGenerating(null);
      }, 3000);
    } catch (error) {
      console.error('Failed to generate report:', error);
      setGenerating(null);
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getReportIcon = (type) => {
    const icons = {
      sales: '💰',
      analytics: '📊',
      finance: '📈',
      inventory: '📦'
    };
    return icons[type] || '📋';
  };

  const getReportColor = (type) => {
    const colors = {
      sales: 'bg-green-100 text-green-700',
      analytics: 'bg-blue-100 text-blue-700',
      finance: 'bg-purple-100 text-purple-700',
      inventory: 'bg-orange-100 text-orange-700'
    };
    return colors[type] || 'bg-gray-100 text-gray-700';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="flex justify-between items-center mb-6">
            <div className="h-6 bg-gray-200 rounded w-24"></div>
            <div className="h-8 bg-gray-200 rounded w-28"></div>
          </div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-4">
                <div className="flex space-x-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                  </div>
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
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Reports</h3>
          <p className="text-sm text-gray-500 mt-1">Generate and download business reports</p>
        </div>
        <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          New Report
        </button>
      </div>

      {/* Reports List */}
      <div className="space-y-4 mb-6">
        {reports.map(report => (
          <div key={report.id} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors duration-200">
            <div className="flex items-start space-x-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-xl ${getReportColor(report.type)}`}>
                {getReportIcon(report.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900 mb-1">{report.name}</h4>
                    <p className="text-sm text-gray-600 mb-2">{report.description}</p>
                    
                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {formatDate(report.lastGenerated)}
                      </span>
                      <span className="flex items-center">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        {report.size}
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {report.format}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => handleGenerate(report.id)}
                      disabled={generating === report.id}
                      className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {generating === report.id ? (
                        <div className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-1 h-3 w-3" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Generating...
                        </div>
                      ) : (
                        'Generate'
                      )}
                    </button>
                    
                    <button
                      onClick={() => handleDownload(report.id)}
                      disabled={report.status !== 'ready'}
                      className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg className="w-3 h-3 mr-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Download
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-900">Total Reports</h4>
          <p className="text-2xl font-bold text-blue-600 mt-1">{reports.length}</p>
        </div>
        
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-900">This Month</h4>
          <p className="text-2xl font-bold text-green-600 mt-1">
            {reports.filter(r => {
              const monthAgo = new Date();
              monthAgo.setMonth(monthAgo.getMonth() - 1);
              return r.lastGenerated > monthAgo;
            }).length}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReportsComponent;
