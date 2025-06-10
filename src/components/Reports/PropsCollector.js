import React, { useEffect } from 'react';
import { Form, Input, Button, Alert, Space, Typography, message } from 'antd';
import { SaveOutlined, CloseCircleOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const PropsCollector = ({ componentName, propsNeeded, initialData, onSubmit, onCancel }) => {
  // Use Ant Design's Form instance for state management and validation
  const [form] = Form.useForm();

  // Effect to reset and set form fields when the component being edited changes
  useEffect(() => {
    // The `initialData` prop contains the current values for the component's props.
    // We use it to pre-fill the form.
    const fieldsData = propsNeeded.reduce((acc, prop) => {
      acc[prop] = initialData?.[prop] || '';
      return acc;
    }, {});
    form.setFieldsValue(fieldsData);
  }, [initialData, propsNeeded, form]);

  // This function is called when the form is submitted and validation succeeds
  const handleFinish = (values) => {
    // The `values` object contains the validated form data
    onSubmit(values);
    message.success(`${componentName} configured successfully!`);
  };
  
  // This function is called when form validation fails
  const handleFinishFailed = () => {
    message.error('Please fill out all required fields.');
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  // Function to format the prop name for display (e.g., 'trackingId' -> 'Tracking Id')
  const formatLabel = (propName) => {
    return propName
      .replace(/([A-Z])/g, ' $1') // Add space before capital letters
      .replace(/^./, (str) => str.toUpperCase()); // Capitalize the first letter
  };

  return (
    // Use AntD's Alert component for a visually distinct container
    <Alert
      type="info"
      style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
      message={
        <Title level={5} style={{ margin: 0 }}>Configure {componentName}</Title>
      }
      description={
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Paragraph type="secondary" style={{ flexShrink: 0 }}>
                This component needs some information to get started.
            </Paragraph>
            <div style={{ flex: 1, overflow: 'auto', paddingTop: '16px' }}>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleFinish}
                    onFinishFailed={handleFinishFailed}
                    autoComplete="off"
                >
                    {propsNeeded.map((propName) => (
                    <Form.Item
                        key={propName}
                        name={propName}
                        label={formatLabel(propName)}
                        rules={[{ required: true, message: `Please enter the ${formatLabel(propName)}.` }]}
                    >
                        <Input placeholder={`Enter ${formatLabel(propName)}...`} />
                    </Form.Item>
                    ))}
                    <Form.Item style={{ marginTop: '24px', marginBottom: 0 }}>
                    <Space direction="vertical" style={{ width: '100%' }}>
                        <Button type="primary" htmlType="submit" block icon={<SaveOutlined />}>
                            Save and Render
                        </Button>
                        {onCancel && (
                        <Button onClick={handleCancel} block icon={<CloseCircleOutlined />}>
                            Cancel
                        </Button>
                        )}
                    </Space>
                    </Form.Item>
                </Form>
            </div>
        </div>
      }
    />
  );
};

export default PropsCollector;