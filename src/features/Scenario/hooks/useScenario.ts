import { useState, useEffect } from 'react';
import { getScenarios, createScenario, updateScenario, deleteScenario } from '../services/scenarioService';
import { Scenario, CreateScenarioPayload, UpdateScenarioPayload } from '../Scenario.types';

const useScenario = () => {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchScenarios();
  }, []);

  const fetchScenarios = async () => {
    try {
      setLoading(true);
      const data = await getScenarios();
      setScenarios(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
      setScenarios([]); // Ensure scenarios is an array even if there is an error
    } finally {
      setLoading(false);
    }
  };

  const addScenario = async (scenario: CreateScenarioPayload) => {
    try {
      const newScenario = await createScenario(scenario);
      setScenarios([...scenarios, newScenario]);
    } catch (err) {
      setError(err.message);
    }
  };

  const editScenario = async (id: number, updatedScenario: UpdateScenarioPayload) => {
    try {
      const updated = await updateScenario(id, updatedScenario);
      setScenarios(scenarios.map((scenario) => (scenario.id === id ? updated : scenario)));
    } catch (err) {
      setError(err.message);
    }
  };

  const removeScenario = async (id: number) => {
    try {
      await deleteScenario(id);
      setScenarios(scenarios.filter((scenario) => scenario.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  return { scenarios, loading, error, addScenario, editScenario, removeScenario };
};

export default useScenario;
