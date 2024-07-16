import React from 'react';

interface ScenarioCardProps {
  title: string;
  description: string;
}

const ScenarioCard: React.FC<ScenarioCardProps> = ({ title, description }) => {
  return (
    <div className="scenario-card">
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
};

export default ScenarioCard;
