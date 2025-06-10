import React, { useState, useEffect, cloneElement } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';

// Import your dashboard components
import DashboardOverview from './DashboardOverview';
import AnalyticsComponent from './Analytics';
import SettingsComponent from './Settings';
import ProfileComponent from './Profile';
import NotificationsComponent from './Notifications';
import ReportsComponent from './Reports1';
import PropsCollector from './PropsCollector'; // The component to collect missing props

const ResponsiveGridLayout = WidthProvider(Responsive);

const LOCAL_STORAGE_KEYS = {
  COMPONENTS: 'dashboard_selected_components',
  LAYOUTS: 'dashboard_layouts_vector',
  ACTIVELAYOUT: 'active_layout',
  PROPS: 'dashboard_component_props', // Key for storing component-specific props
};

const Dashboard = () => {
  const [userPreferences, setUserPreferences] = useState(null);
  const [layouts, setLayouts] = useState([]);
  const [activeLayout, setActiveLayout] = useState([]);
  const [componentProps, setComponentProps] = useState({});
  const [loading, setLoading] = useState(true);
  const [newLayoutName, setNewLayoutName] = useState('');
  const [editingComponentId, setEditingComponentId] = useState(null); // State to track which component is being edited

  const availableComponents = [
    { id: 'dashboard', name: 'Dashboard Overview', icon: '📊', component: <DashboardOverview />, requiredProps: [] },
    { id: 'analytics', name: 'Analytics', icon: '📈', component: <AnalyticsComponent />, requiredProps: ['trackingId'] },
    { id: 'settings', name: 'Settings', icon: '⚙️', component: <SettingsComponent />, requiredProps: [] },
    { id: 'profile', name: 'User Profile', icon: '👤', component: <ProfileComponent />, requiredProps: ['username', 'email'] },
    { id: 'notifications', name: 'Notifications', icon: '🔔', component: <NotificationsComponent />, requiredProps: [] },
    { id: 'reports', name: 'Reports', icon: '📋', component: <ReportsComponent />, requiredProps: [] },
  ];

  const generateLayout = (components) => {
    return components.map((componentId, index) => ({
      i: componentId,
      x: (index % 2) * 6,
      y: Math.floor(index / 2) * 4,
      w: 6,
      h: 5,
    }));
  };

  const handlePropsSubmit = (componentId, submittedProps) => {
    const updatedProps = { ...componentProps, [componentId]: submittedProps };
    setComponentProps(updatedProps);
    localStorage.setItem(LOCAL_STORAGE_KEYS.PROPS, JSON.stringify(updatedProps));
    setEditingComponentId(null); // Exit editing mode on successful submission
  };
  
  const handleCancelEdit = () => {
    setEditingComponentId(null); // Cancel editing and hide the form
  };

  const toggleComponent = (componentId) => {
    const isSelected = userPreferences.selectedComponents.includes(componentId);
    let updatedComponents;
    let newLayout = [...activeLayout]; // Start with the current active layout

    if (isSelected) {
      updatedComponents = userPreferences.selectedComponents.filter((id) => id !== componentId);
      // Clean up props when a component is removed
      const newComponentProps = { ...componentProps };
      delete newComponentProps[componentId];
      setComponentProps(newComponentProps);
      localStorage.setItem(LOCAL_STORAGE_KEYS.PROPS, JSON.stringify(newComponentProps));

      // Remove the component from the layout
      newLayout = newLayout.filter(item => item.i !== componentId);

    } else {
      updatedComponents = [...userPreferences.selectedComponents, componentId];
      // Add a new layout item for the newly selected component if it doesn't exist
      if (!newLayout.some(item => item.i === componentId)) {
        const nextX = (newLayout.length % 2) * 6;
        const nextY = Math.floor(newLayout.length / 2) * 4;
        newLayout.push({
          i: componentId,
          x: nextX,
          y: nextY,
          w: 6,
          h: 5,
        });
      }
    }
    
    const newPreferences = { ...userPreferences, selectedComponents: updatedComponents };

    setUserPreferences(newPreferences);
    setActiveLayout(newLayout); // Update layout with the new component's position
    localStorage.setItem(LOCAL_STORAGE_KEYS.COMPONENTS, JSON.stringify(updatedComponents));
    localStorage.setItem(LOCAL_STORAGE_KEYS.ACTIVELAYOUT, JSON.stringify(newLayout)); // Save the updated layout
  };

  const handleLayoutChange = (newLayout) => {
    if (JSON.stringify(newLayout) !== JSON.stringify(activeLayout)) {
        setActiveLayout(newLayout);
        localStorage.setItem(LOCAL_STORAGE_KEYS.ACTIVELAYOUT, JSON.stringify(newLayout));
    }
  };

  const saveCurrentLayout = () => {
    if (!newLayoutName.trim()) {
      alert('Please enter a name for the layout.');
      return;
    }
    const newLayoutVector = {
      name: newLayoutName,
      config: activeLayout,
      userPreferences: userPreferences,
      componentProps: componentProps,
    };
    const updatedLayouts = [...layouts, newLayoutVector];
    setLayouts(updatedLayouts);
    localStorage.setItem(LOCAL_STORAGE_KEYS.LAYOUTS, JSON.stringify(updatedLayouts));
    setNewLayoutName('');
  };

  const applyLayout = (layoutToApply) => {
    setActiveLayout(layoutToApply.config);
    setUserPreferences(layoutToApply.userPreferences);
    if (layoutToApply.componentProps) {
      setComponentProps(layoutToApply.componentProps);
    }
    localStorage.setItem(LOCAL_STORAGE_KEYS.ACTIVELAYOUT, JSON.stringify(layoutToApply.config)); // Save applied layout
    localStorage.setItem(LOCAL_STORAGE_KEYS.COMPONENTS, JSON.stringify(layoutToApply.userPreferences.selectedComponents)); // Save applied components
  };

  const deleteLayout = (layoutNameToDelete) => {
      const updatedLayouts = layouts.filter(l => l.name !== layoutNameToDelete);
      setLayouts(updatedLayouts);
      localStorage.setItem(LOCAL_STORAGE_KEYS.LAYOUTS, JSON.stringify(updatedLayouts));
  };

  useEffect(() => {
    const loadUserPreferences = () => {
      try {
        const savedComponentsJSON = localStorage.getItem(LOCAL_STORAGE_KEYS.COMPONENTS);
        const savedLayoutsVectorJSON = localStorage.getItem(LOCAL_STORAGE_KEYS.LAYOUTS);
        const activeLayoutJSON = localStorage.getItem(LOCAL_STORAGE_KEYS.ACTIVELAYOUT);
        const savedPropsJSON = localStorage.getItem(LOCAL_STORAGE_KEYS.PROPS);

        let selectedComponents = []; 
        let savedLayouts = [];
        let savedProps = {};

        if (savedComponentsJSON) selectedComponents = JSON.parse(savedComponentsJSON);
        if (savedLayoutsVectorJSON) {
          savedLayouts = JSON.parse(savedLayoutsVectorJSON);
          setLayouts(savedLayouts);
        }
        if (savedPropsJSON) savedProps = JSON.parse(savedPropsJSON);
        setUserPreferences({ selectedComponents });
        setComponentProps(savedProps);

        if (activeLayoutJSON) {
          setActiveLayout(JSON.parse(activeLayoutJSON));
        } else {
          // If no active layout is saved, generate one based on selected components
          setActiveLayout(generateLayout(selectedComponents));
        }
      } catch (error) {
        console.error('Failed to load or parse user preferences:', error);
        const defaultPreferences = { selectedComponents: [] };
        setUserPreferences(defaultPreferences);
        setActiveLayout(generateLayout(defaultPreferences.selectedComponents));
        setLayouts([]);
        setComponentProps({});
      } finally {
        setLoading(false);
      }
    };
    loadUserPreferences();
  }, []);

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
      {/* Sidebar for Customization */}
      <div className="w-80 bg-white shadow-lg border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-800 mb-2">Customize Dashboard</h3>
          <p className="text-sm text-gray-600">Select components and manage layouts</p>
        </div>

        <div className="flex-1 p-6 overflow-y-auto">
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

      {/* Main Dashboard Content Area */}
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
              layouts={{ lg: activeLayout }}
              breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
              cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
              rowHeight={100}
              onLayoutChange={(layout) => handleLayoutChange(layout)}
              draggableHandle=".drag-handle"
            >
              {userPreferences.selectedComponents.map((componentId) => {
                const componentInfo = availableComponents.find(c => c.id === componentId);
                if (!componentInfo) {
                    return (
                        <div key={componentId} className="bg-red-50 border border-red-200 rounded-lg p-6 text-center ">
                            <div className="text-red-600 font-medium">Component definition for '{componentId}' not found.</div>
                        </div>
                    );
                }

                const propsForComponent = componentProps[componentId] || {};
                const requiredProps = componentInfo.requiredProps || [];
                const hasAllProps = requiredProps.every(p => propsForComponent[p]);
                const isEditing = editingComponentId === componentId;

                return (
                  <div key={componentId} className="bg-white rounded-lg shadow-md flex flex-col overflow-hidden">
                    <div className="bg-gray-50 p-2 px-4 border-b border-gray-200 flex justify-between items-center">
                      <h3 className="font-semibold text-gray-700 text-sm truncate">
                        {componentInfo.name}
                      </h3>
                      <div className="flex items-center">
                        {/* Show Edit button only if there are props to configure */}
                        {requiredProps.length > 0 && (
                          <button onClick={() => setEditingComponentId(componentId)} className="cursor-pointer text-gray-400 hover:text-blue-600 p-1" title="Edit Properties">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                          </button>
                        )}
                        <div className="drag-handle cursor-move text-gray-400 hover:text-gray-700 p-1 select-none">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle>
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 flex-1 overflow-auto">
                      {hasAllProps && !isEditing ? (
                        cloneElement(componentInfo.component, { ...propsForComponent })
                      ) : (
                        <PropsCollector
                          componentName={componentInfo.name}
                          propsNeeded={requiredProps}
                          initialData={propsForComponent} // Pass current props to pre-fill the form
                          onSubmit={(submittedProps) => handlePropsSubmit(componentId, submittedProps)}
                          onCancel={handleCancelEdit} // Pass cancel handler
                        />
                      )}
                    </div>
                  </div>
                );
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