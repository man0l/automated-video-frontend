import React, { useState } from 'react';
import ScenarioList from './components/ScenarioList';
import MultiStepForm from './components/form/MultistepForm';
import useScenario from './hooks/useScenario';
import Modal from '../../components/Modal';
import './Scenario.scss';
import 'tailwindcss/tailwind.css';

const Scenario: React.FC = () => {
  const { scenarios, addScenario } = useScenario();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleFormSubmit = (data: any) => {
    addScenario(data);
    closeModal();
  };

  const renderPreviewContent = () => (
    <MultiStepForm onSubmit={handleFormSubmit} onCloseModal={closeModal} />
  );

  return (
    <div className="scenario-container p-4">
      <button onClick={openModal} className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
        Create
      </button>
      <ScenarioList scenarios={scenarios} />
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        content={renderPreviewContent()}
      />
    </div>
  );
};

export default Scenario;
