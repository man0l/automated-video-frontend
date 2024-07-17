import React from 'react';

interface ScenarioCardProps {
  scenario: {
    id: string;
    title: string;
    description: string;
    status: string;
  };
  onActionClick: (action: string, scenarioId: string) => void;
}

const ScenarioCard: React.FC<ScenarioCardProps> = ({ scenario, onActionClick }) => {
  return (
    <div className="border rounded-lg p-4 shadow-md bg-white">
      <h3 className="text-xl font-semibold mb-2">{scenario.title}</h3>
      <p className="text-gray-700 mb-4">{scenario.description}</p>
      <p className="text-gray-500 mb-4"><strong>Status:</strong> {scenario.status}</p>
      <button
        onClick={() => onActionClick('Edit', scenario.id)}
        className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2"
      >
        Edit
      </button>
      <button
        onClick={() => onActionClick('Delete', scenario.id)}
        className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
      >
        Delete
      </button>
    </div>
  );
};

export default ScenarioCard;
