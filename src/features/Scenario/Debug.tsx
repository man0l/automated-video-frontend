import React, { useEffect, useState } from 'react';
import useTemplate from './hooks/useTemplate';
import TemplateCard from './components/TemplateCard';
import TemplateList from './components/TemplateList';

const Template: React.FC = () => {
  const { addTemplate, editTemplate, removeTemplate, templates } = useTemplate();

  useEffect(() => {
    console.log('Templates state change form Debug:', templates);  // Debugging log
  }, [templates]);

  const click = async () => {
    await addTemplate({ title: 'Test Template', content: 'Test Content' });
  }
  return (
    <div className="template-container p-4">
        {JSON.stringify(templates)}
        <a href='#' onClick={click}>Add Template</a>
        <TemplateList onActionClick={() => {}} />
    </div>
  );
};

export default Template;
