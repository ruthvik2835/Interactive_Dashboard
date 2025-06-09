import React, { useState, useEffect } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import DashboardOverview from './DashboardOverview';
import AnalyticsComponent from './Analytics';
import SettingsComponent from './Settings';
import ProfileComponent from './Profile';
import NotificationsComponent from './Notifications';
import ReportsComponent from './Reports1';

// CSS imports
// import 'react-grid-layout/css/styles.css';
// import 'react-resizable/css/styles.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

// NEW: Define keys for localStorage for easier management.
const LOCAL_STORAGE_KEYS = {
  COMPONENTS: 'dashboard_selected_components',
  // MODIFIED: Changed from a single layout to multiple layouts.
  LAYOUTS: 'dashboard_layouts_vector',
};

const Dashboard = ({ userId }) => {
  // MODIFIED: Initialize state with null to represent "not yet loaded".
  const [userPreferences, setUserPreferences] = useState(null);
  
  // NEW: 'vector' renamed to 'layouts' for clarity. This will hold all saved layout configurations.
  const [layouts, setLayouts] = useState([]);
  
  // This will hold the *active* layout configuration for the grid.
  const [activeLayout, setActiveLayout] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [newLayoutName, setNewLayoutName] = useState('');

  const availableComponents = [
    { id: 'dashboard', name: 'Dashboard Overview', icon: '📊' },
    { id: 'analytics', name: 'Analytics', icon: '📈' },
    { id: 'settings', name: 'Settings', icon: '⚙️' },
    { id: 'profile', name: 'User Profile', icon: '👤' },
    { id: 'notifications', name: 'Notifications', icon: '🔔' },
    { id: 'reports', name: 'Reports', icon: '📋' },
  ];

  const renderComponent = (componentType) => {
    switch (componentType) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'analytics':
        return <AnalyticsComponent />;
      case 'settings':
        return <SettingsComponent />;
      case 'profile':
        return <ProfileComponent />;
      case 'notifications':
        return <NotificationsComponent />;
      case 'reports':
        return <ReportsComponent />;
      default:
        return (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <div className="text-red-600 font-medium">Component not found</div>
          </div>
        );
    }
  };

  const generateLayout = (components) => {
    return components.map((componentId, index) => ({
      i: componentId,
      x: (index % 2) * 6,
      y: Math.floor(index / 2) * 4,
      w: 6,
      h: 5,
    }));
  };

  const toggleComponent = (componentId) => {
    const updatedComponents = userPreferences.selectedComponents.includes(componentId)
      ? userPreferences.selectedComponents.filter((id) => id !== componentId)
      : [...userPreferences.selectedComponents, componentId];

    const newPreferences = {
      ...userPreferences,
      selectedComponents: updatedComponents,
    };
    
    // When components change, we generate a fresh layout for them.
    const newLayout = generateLayout(updatedComponents);

    setUserPreferences(newPreferences);
    setActiveLayout(newLayout); // Set the new layout as active.

    localStorage.setItem(LOCAL_STORAGE_KEYS.COMPONENTS, JSON.stringify(updatedComponents));
    // We don't save the layout here because the user might want to arrange it first.
  };
  
  const handleLayoutChange = (newLayout) => {
    // Only update if the layout has actually changed to prevent unnecessary re-renders.
    if (JSON.stringify(newLayout) !== JSON.stringify(activeLayout)) {
        setActiveLayout(newLayout);
        localStorage.setItem(LOCAL_STORAGE_KEYS.ACTIVELAYOUT, JSON.stringify(newLayout));
        console.log('changed!: ',newLayout);
    }
  };
  
  // NEW: Function to save the current layout to the vector.
  const saveCurrentLayout = () => {
    if (!newLayoutName.trim()) {
      alert('Please enter a name for the layout.');
      return;
    }
    const newLayoutVector = {
      name: newLayoutName,
      config: activeLayout,
      userPreferences:userPreferences
    };
    const updatedLayouts = [...layouts, newLayoutVector];
    setLayouts(updatedLayouts);
    localStorage.setItem(LOCAL_STORAGE_KEYS.LAYOUTS, JSON.stringify(updatedLayouts));
    setNewLayoutName(''); // Clear input field
  };
  
  // NEW: Function to apply a selected layout from the vector.
  const applyLayout = (layoutToApply) => {
    setActiveLayout(layoutToApply.config);
    setUserPreferences(layoutToApply.userPreferences);
  };
  
  // NEW: Function to delete a saved layout.
  const deleteLayout = (layoutNameToDelete) => {
      const updatedLayouts = layouts.filter(l => l.name !== layoutNameToDelete);
      setLayouts(updatedLayouts);
      localStorage.setItem(LOCAL_STORAGE_KEYS.LAYOUTS, JSON.stringify(updatedLayouts));
  }

  useEffect(() => {
    const loadUserPreferences = () => {
      try {
        const savedComponentsJSON = localStorage.getItem(LOCAL_STORAGE_KEYS.COMPONENTS);
        // NEW: Load the entire vector of layouts.
        const savedLayoutsVectorJSON = localStorage.getItem(LOCAL_STORAGE_KEYS.LAYOUTS);
        const activeLayoutJSON = localStorage.getItem(LOCAL_STORAGE_KEYS.ACTIVELAYOUT);

        let selectedComponents = ['dashboard', 'analytics']; // Default components
        let savedLayouts = []; // Default empty layouts vector

        if (savedComponentsJSON) {
          selectedComponents = JSON.parse(savedComponentsJSON);
        }

        if (savedLayoutsVectorJSON) {
          savedLayouts = JSON.parse(savedLayoutsVectorJSON);
          setLayouts(savedLayouts);
        }

        if(activeLayoutJSON){
          let savedLayout = JSON.parse(activeLayoutJSON);
          console.log("savedLayout: ",savedLayout);
          setActiveLayout(savedLayout);
        }

        const preferences = { selectedComponents };
        setUserPreferences(preferences);

        // // Try to find an active layout that matches the selected components.
        // // If not found, generate a new one.
        // const lastActiveLayout = savedLayouts.length > 0 ? savedLayouts[savedLayouts.length - 1].config : generateLayout(selectedComponents);
        // setActiveLayout(lastActiveLayout);

      } catch (error) {
        console.error('Failed to load or parse user preferences:', error);
        const defaultPreferences = { selectedComponents: ['dashboard', 'analytics'] };
        setUserPreferences(defaultPreferences);
        setActiveLayout(generateLayout(defaultPreferences.selectedComponents));
        setLayouts([]);
      } finally {
        setLoading(false);
      }
    };
    
    loadUserPreferences();
  }, []); // Runs once on mount.

  if (loading || !userPreferences) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-gray-600 text-lg font-medium">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Component Selection & Layout Management Panel */}
      <div className="w-80 bg-white shadow-lg border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-800 mb-2">Customize Dashboard</h3>
          <p className="text-sm text-gray-600">Select components and manage layouts</p>
        </div>

        <div className="flex-1 p-6 overflow-y-auto">
          {/* Component Toggles */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Components</h4>
            {availableComponents.map((component) => (
              <label key={component.id} className="flex items-center p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-all duration-200 group">
                <input
                  type="checkbox"
                  checked={userPreferences.selectedComponents.includes(component.id)}
                  onChange={() => toggleComponent(component.id)}
                  className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                />
                <span className="text-2xl ml-3 group-hover:scale-110 transition-transform duration-200">{component.icon}</span>
                <span className="ml-3 text-gray-700 font-medium group-hover:text-blue-700 transition-colors duration-200">{component.name}</span>
              </label>
            ))}
          </div>

          {/* NEW: Layout Management Section */}
          <div className="mt-8">
            <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Layouts</h4>
            <div className="bg-gray-50 p-4 rounded-lg">
                <input
                    type="text"
                    value={newLayoutName}
                    onChange={(e) => setNewLayoutName(e.target.value)}
                    placeholder="New layout name..."
                    className="w-full px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    onClick={saveCurrentLayout}
                    className="w-full mt-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors"
                >
                    Save Current Layout
                </button>
            </div>
            <div className="mt-4 space-y-2">
              {layouts.map((layout, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                  <span className="text-gray-800 font-medium">{layout.name}</span>
                  <div className="flex items-center space-x-2">
                    <button onClick={() => applyLayout(layout)} className="text-xs font-semibold text-blue-600 hover:text-blue-800">APPLY</button>
                    <button onClick={() => deleteLayout(layout.name)} className="text-xs font-semibold text-red-500 hover:text-red-700">DELETE</button>
                  </div>
                </div>
              ))}
              {layouts.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-2">No saved layouts.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-white shadow-sm border-b border-gray-200 p-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome back! Here's your personalized overview.</p>
            </div>
          </div>
        </div>

        <div className="flex-1 p-6 overflow-y-auto">
          {userPreferences.selectedComponents.length > 0 ? (
            <ResponsiveGridLayout
              className="layout"
              // MODIFIED: Use the activeLayout state.
              layouts={{ lg: activeLayout }}
              breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
              cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
              rowHeight={100}
              onLayoutChange={(layout, layouts) => handleLayoutChange(layout)}
              draggableHandle=".drag-handle"
            >
              {userPreferences.selectedComponents.map((componentType) => {
                const componentInfo = availableComponents.find(c => c.id === componentType);
                return (
                  <div key={componentType} className="bg-white rounded-lg shadow-md flex flex-col overflow-hidden">
                    <div className="bg-gray-50 p-2 px-4 border-b border-gray-200 flex justify-between items-center">
                      <h3 className="font-semibold text-gray-700 text-sm truncate">
                        {componentInfo?.name || 'Component'}
                      </h3>
                      <div className="drag-handle cursor-move text-gray-400 hover:text-gray-700 p-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="1"></circle>
                          <circle cx="12" cy="5" r="1"></circle>
                          <circle cx="12" cy="19" r="1"></circle>
                        </svg>
                      </div>
                    </div>
                    <div className="p-4 flex-1 overflow-auto">
                      {renderComponent(componentType)}
                    </div>
                  </div>
                )
              })}
            </ResponsiveGridLayout>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center max-w-md mx-auto">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Your dashboard is empty</h2>
                <p className="text-gray-600 mb-6">
                  Select components from the sidebar to customize your dashboard.
                </p>
                <button
                  onClick={() => toggleComponent('dashboard')}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
                >
                  <span className="mr-2">📊</span>
                  Add Dashboard Overview
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;