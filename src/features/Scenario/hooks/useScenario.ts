import { useState, useEffect } from 'react';
import { getScenarios, createScenario, updateScenario, deleteScenario } from '../services/scenarioService';
import { Scenario, CreateScenarioPayload, UpdateScenarioPayload } from '../Scenario.types';
import { useDebounce } from '../../../hooks/useDebounce';

const useScenario = () => {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({ search: '', fromDate: '', toDate: '', status: '', sort: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  // Debounce filters
  const debouncedFilters = useDebounce(filters, 500);

  useEffect(() => {
    fetchScenarios();
  }, [debouncedFilters, currentPage, itemsPerPage]);

  const fetchScenarios = async () => {
    try {
      setLoading(true);
      const data = await getScenarios({
        ...debouncedFilters,
        page: currentPage,
        itemsPerPage,
      });
      setScenarios(Array.isArray(data.scenarios) ? data.scenarios : []);
      setTotalItems(data.totalItems || 0);
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

  return {
    scenarios,
    loading,
    error,
    filters,
    setFilters,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    totalItems,
    addScenario,
    editScenario,
    removeScenario,
  };
};

export default useScenario;
