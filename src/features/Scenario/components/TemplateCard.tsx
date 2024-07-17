import React from 'react';
import { Template } from '../Template.types';

interface TemplateCardProps {
  template: Template;
  onActionClick: (action: string, templateId: string) => void;
}

const TemplateCard: React.FC<TemplateCardProps> = ({ template, onActionClick }) => {
  return (
    <div className="border rounded-lg p-4 shadow-md bg-white">
      <h3 className="text-xl font-semibold">{template.title}</h3>
      <p className="text-gray-600">{template.content}</p>
      {template.scenarioCount > 0 && (
        <p className="text-green-600 mt-2">Used in {template.scenarioCount} scenarios</p>
      )}
      <div className="flex justify-end mt-4 space-x-2">
        <button
          onClick={() => onActionClick('Edit', template.id)}
          className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600"
        >
          Edit
        </button>
        <button
          onClick={() => onActionClick('Delete', template.id)}
          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TemplateCard;
