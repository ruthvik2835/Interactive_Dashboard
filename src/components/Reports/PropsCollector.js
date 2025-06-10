import React, { useState, useEffect } from 'react';

const PropsCollector = ({ componentName, propsNeeded, initialData, onSubmit, onCancel }) => {
  // Initialize state to hold the values from the form inputs
  const [formData, setFormData] = useState(() => {
    // Use initialData to pre-fill the form if provided
    if (initialData) {
      return propsNeeded.reduce((acc, prop) => {
        acc[prop] = initialData[prop] !== undefined ? initialData[prop] : '';
        return acc;
      }, {});
    } else {
      return propsNeeded.reduce((acc, prop) => {
        acc[prop] = '';
        return acc;
      }, {});
    }
  });

  // Update formData if initialData changes (e.g., when editing a different component)
  useEffect(() => {
    if (initialData) {
      setFormData(
        propsNeeded.reduce((acc, prop) => {
          acc[prop] = initialData[prop] !== undefined ? initialData[prop] : '';
          return acc;
        }, {})
      );
    }
  }, [initialData, propsNeeded]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Check if any field is empty
    if (Object.values(formData).some(value => !value.trim())) {
      alert('Please fill out all fields.');
      return;
    }
    onSubmit(formData);
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center h-full flex flex-col justify-center">
      <h4 className="text-lg font-bold text-yellow-800 mb-2">Configure {componentName}</h4>
      <p className="text-sm text-yellow-700 mb-4">This component needs some information to get started.</p>
      <form onSubmit={handleSubmit} className="space-y-3 text-left">
        {propsNeeded.map((propName) => (
          <div key={propName}>
            <label htmlFor={propName} className="block text-sm font-medium text-gray-700 capitalize">
              {propName.replace(/([A-Z])/g, ' $1')}
            </label>
            <input
              type="text"
              id={propName}
              name={propName}
              value={formData[propName]}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder={`Enter ${propName}...`}
            />
          </div>
        ))}
        <button
          type="submit"
          className="w-full mt-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors"
        >
          Save and Render Component
        </button>
        {onCancel && ( // Only render cancel button if onCancel prop is provided
          <button
            type="button" // Use type="button" to prevent form submission
            onClick={handleCancel}
            className="w-full mt-2 px-4 py-2 bg-gray-300 text-gray-800 font-semibold rounded-md hover:bg-gray-400 transition-colors"
          >
            Cancel
          </button>
        )}
      </form>
    </div>
  );
};

export default PropsCollector;