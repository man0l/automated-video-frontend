import React from 'react';
import ScenarioCard from './ScenarioCard';
import { Scenario } from '../Scenario.types';

interface ScenarioListProps {
  scenarios: Scenario[];
}

const ScenarioList: React.FC<ScenarioListProps> = ({ scenarios }) => {
  if (!Array.isArray(scenarios)) {
    return <div>No scenarios available</div>;
  }

  return (
    <div className="scenario-list">
      {scenarios.map((scenario) => (
        <ScenarioCard key={scenario.id} title={scenario.title} description={scenario.description} />
      ))}
    </div>
  );
};

export default ScenarioList;
