// src/features/Scenario/components/ScenarioList.tsx
import React from 'react';
import useScenario from '../hooks/useScenario'; // Adjust the import path as needed
import ScenarioCard from './ScenarioCard';
import ScenarioFilters from './ScenarioFilters';
import Pagination from '../../../components/Pagination';
import { ClipLoader } from 'react-spinners';
import toast from 'react-hot-toast';

const ScenarioList: React.FC = () => {
  const {
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
  } = useScenario();

  const handleActionClick = async (action: string, scenarioId: number) => {
    toast.promise(
      // Replace this with actual API call
      new Promise((resolve) => setTimeout(resolve, 2000)),
      {
        loading: `${action} in progress...`,
        success: `${action} completed successfully!`,
        error: `Error performing ${action}`,
      }
    );
  };

  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold mb-6 text-center">Scenarios</h2>
      <ScenarioFilters filters={filters} setFilters={setFilters} />
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <ClipLoader size={50} color={"#123abc"} loading={loading} />
        </div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : (
        <>
          <div className="flex flex-wrap -mx-2">
            {scenarios.length > 0 ? (
              scenarios.map((scenario) => (
                <div key={scenario.id} className="p-2 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 min-w-[200px]">
                  <ScenarioCard scenario={scenario} onActionClick={handleActionClick} />
                </div>
              ))
            ) : (
              <div className="text-center w-full">No scenarios found</div>
            )}
          </div>
          <div className="flex justify-center mt-6">
            <Pagination
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              itemsPerPage={itemsPerPage}
              setItemsPerPage={setItemsPerPage}
              totalItems={totalItems}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default ScenarioList;
