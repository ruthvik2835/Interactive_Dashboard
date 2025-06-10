import React, { useState, useEffect, cloneElement } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import {
  Layout,
  Spin,
  Typography,
  Checkbox,
  Input,
  Button,
  Card,
  Space,
  Empty,
  Tooltip,
  Divider,
} from 'antd';
import { EditOutlined, DeleteOutlined, SaveOutlined, DragOutlined } from '@ant-design/icons';

// Import your dashboard components
import DashboardOverview from './DashboardOverview';
import AnalyticsComponent from './Analytics';
import SettingsComponent from './Settings';
import ProfileComponent from './Profile';
import NotificationsComponent from './Notifications';
import ReportsComponent from './Reports1';
import PropsCollector from './PropsCollector'; // The component to collect missing props

const { Sider, Header, Content } = Layout;
const { Title, Text, Paragraph } = Typography;

const ResponsiveGridLayout = WidthProvider(Responsive);

const LOCAL_STORAGE_KEYS = {
  COMPONENTS: 'dashboard_selected_components',
  LAYOUTS: 'dashboard_layouts_vector',
  ACTIVELAYOUT: 'active_layout',
  PROPS: 'dashboard_component_props',
};

const Dashboard = () => {
  const [userPreferences, setUserPreferences] = useState(null);
  const [layouts, setLayouts] = useState([]);
  const [activeLayout, setActiveLayout] = useState([]);
  const [componentProps, setComponentProps] = useState({});
  const [loading, setLoading] = useState(true);
  const [newLayoutName, setNewLayoutName] = useState('');
  const [editingComponentId, setEditingComponentId] = useState(null);

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

  const handleResizeStart = () => {
    document.body.classList.add('select-none');
  };

  const handleResizeStop = () => {
    document.body.classList.remove('select-none');
  };

  const handlePropsSubmit = (componentId, submittedProps) => {
    const updatedProps = { ...componentProps, [componentId]: submittedProps };
    setComponentProps(updatedProps);
    localStorage.setItem(LOCAL_STORAGE_KEYS.PROPS, JSON.stringify(updatedProps));
    setEditingComponentId(null);
  };

  const handleCancelEdit = () => {
    setEditingComponentId(null);
  };

  const toggleComponent = (componentId) => {
    const isSelected = userPreferences.selectedComponents.includes(componentId);
    let updatedComponents;
    let newLayout = [...activeLayout];

    if (isSelected) {
      updatedComponents = userPreferences.selectedComponents.filter((id) => id !== componentId);
      const newComponentProps = { ...componentProps };
      delete newComponentProps[componentId];
      setComponentProps(newComponentProps);
      localStorage.setItem(LOCAL_STORAGE_KEYS.PROPS, JSON.stringify(newComponentProps));
      newLayout = newLayout.filter(item => item.i !== componentId);
    } else {
      updatedComponents = [...userPreferences.selectedComponents, componentId];
      if (!newLayout.some(item => item.i === componentId)) {
        const nextX = (newLayout.length % 2) * 6;
        const nextY = Math.floor(newLayout.length / 2) * 4;
        newLayout.push({ i: componentId, x: nextX, y: nextY, w: 6, h: 5 });
      }
    }
    
    const newPreferences = { ...userPreferences, selectedComponents: updatedComponents };
    setUserPreferences(newPreferences);
    setActiveLayout(newLayout);
    localStorage.setItem(LOCAL_STORAGE_KEYS.COMPONENTS, JSON.stringify(updatedComponents));
    localStorage.setItem(LOCAL_STORAGE_KEYS.ACTIVELAYOUT, JSON.stringify(newLayout));
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
    localStorage.setItem(LOCAL_STORAGE_KEYS.ACTIVELAYOUT, JSON.stringify(layoutToApply.config));
    localStorage.setItem(LOCAL_STORAGE_KEYS.COMPONENTS, JSON.stringify(layoutToApply.userPreferences.selectedComponents));
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
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" tip="Loading dashboard..." />
      </div>
    );
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Sidebar for Customization */}
      <Sider width={320} theme="light" style={{ borderRight: '1px solid #f0f0f0' }}>
        <div style={{ padding: '24px' }}>
          <Title level={4}>Customize Dashboard</Title>
          <Text type="secondary">Select components and manage layouts</Text>
        </div>
        <Divider style={{ margin: 0 }} />
        <div style={{ padding: '24px' }}>
          <Title level={5} type="secondary" style={{ marginBottom: '16px' }}>COMPONENTS</Title>
          <Space direction="vertical" style={{ width: '100%' }}>
            {availableComponents.map((component) => (
              <Card key={component.id} hoverable style={{ cursor: 'pointer' }} onClick={() => toggleComponent(component.id)}>
                <Checkbox
                  checked={userPreferences.selectedComponents.includes(component.id)}
                  style={{ marginRight: '12px' }}
                />
                <span style={{ fontSize: '24px', marginRight: '12px' }}>{component.icon}</span>
                <Text strong>{component.name}</Text>
              </Card>
            ))}
          </Space>
          <Divider />
          <Title level={5} type="secondary" style={{ marginBottom: '16px' }}>LAYOUTS</Title>
          <Card style={{ backgroundColor: '#fafafa' }}>
            <Input
              value={newLayoutName}
              onChange={(e) => setNewLayoutName(e.target.value)}
              placeholder="New layout name..."
              style={{ marginBottom: '8px' }}
            />
            <Button
              type="primary"
              icon={<SaveOutlined />}
              onClick={saveCurrentLayout}
              block
            >
              Save Current Layout
            </Button>
          </Card>
          <Space direction="vertical" style={{ width: '100%', marginTop: '16px' }}>
            {layouts.length > 0 ? layouts.map((layout, index) => (
              <Card key={index} size="small">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text strong>{layout.name}</Text>
                  <Space>
                    <Button type="link" onClick={() => applyLayout(layout)}>APPLY</Button>
                    <Button type="link" danger onClick={() => deleteLayout(layout.name)}>DELETE</Button>
                  </Space>
                </div>
              </Card>
            )) : <Text type="secondary">No saved layouts.</Text>}
          </Space>
        </div>
      </Sider>

      {/* Main Dashboard Content Area */}
      <Layout>
        <Header style={{ backgroundColor: '#fff', borderBottom: '1px solid #f0f0f0', padding: '0 24px', height: 'auto' }}>
          <div style={{ padding: '24px 0' }}>
            <Title level={2}>Dashboard</Title>
            <Paragraph type="secondary">Welcome back! Here's your personalized overview.</Paragraph>
          </div>
        </Header>
        <Content style={{ padding: '24px', overflow: 'auto' }}>
          {userPreferences.selectedComponents.length > 0 ? (
            <ResponsiveGridLayout
              className="layout"
              layouts={{ lg: activeLayout }}
              breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
              cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
              rowHeight={100}
              onResizeStart={handleResizeStart}
              onResizeStop={handleResizeStop}
              onLayoutChange={(layout) => handleLayoutChange(layout)}
              draggableHandle=".drag-handle"
            >
              {userPreferences.selectedComponents.map((componentId) => {
                const componentInfo = availableComponents.find(c => c.id === componentId);
                if (!componentInfo) {
                    return (
                        <div key={componentId}>
                            <Card>
                                <Text type="danger">Component definition for '{componentId}' not found.</Text>
                            </Card>
                        </div>
                    );
                }

                const propsForComponent = componentProps[componentId] || {};
                const requiredProps = componentInfo.requiredProps || [];
                const hasAllProps = requiredProps.every(p => propsForComponent[p]);
                const isEditing = editingComponentId === componentId;
                
                const cardTitle = (
                    <Text strong>{componentInfo.name}</Text>
                );

                const cardExtra = (
                    <Space>
                        {requiredProps.length > 0 && (
                            <Tooltip title="Edit Properties">
                                <Button
                                    type="text"
                                    icon={<EditOutlined />}
                                    onClick={() => setEditingComponentId(componentId)}
                                />
                            </Tooltip>
                        )}
                        <div className="drag-handle" style={{ cursor: 'move',userSelect: 'none' }}>
                            <Tooltip title="Drag to move">
                                <DragOutlined />
                            </Tooltip>
                        </div>
                    </Space>
                );

                return (
                  <div key={componentId}>
                    <Card
                        title={cardTitle}
                        extra={cardExtra}
                        style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                        bodyStyle={{ flex: 1, overflow: 'auto' }}
                    >
                      {hasAllProps && !isEditing ? (
                        cloneElement(componentInfo.component, { ...propsForComponent })
                      ) : (
                        <PropsCollector
                          componentName={componentInfo.name}
                          propsNeeded={requiredProps}
                          initialData={propsForComponent}
                          onSubmit={(submittedProps) => handlePropsSubmit(componentId, submittedProps)}
                          onCancel={handleCancelEdit}
                        />
                      )}
                    </Card>
                  </div>
                );
              })}
            </ResponsiveGridLayout>
          ) : (
            <Empty
              description={
                <>
                  <Title level={4}>Your dashboard is empty</Title>
                  <Paragraph type="secondary">
                    Select components from the sidebar to customize your dashboard.
                  </Paragraph>
                </>
              }
            />
          )}
        </Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;