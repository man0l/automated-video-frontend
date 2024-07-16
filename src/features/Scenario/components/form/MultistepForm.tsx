import React, { useState } from 'react';
import BasicInformation from './BasicInformation';
import TemplatesAndTags from './TemplatesAndTags';
import Content from './Content';
import ReviewAndSubmit from './ReviewAndSubmit';
import { createScenario } from '../../services/scenarioService'; // Import the createScenario function
import toast from 'react-hot-toast'; // Import toast from react-hot-toast

interface MultiStepFormProps {
  onSubmit: (data: any) => void;
  onCloseModal: () => void;
}

const MultiStepForm: React.FC<MultiStepFormProps> = ({ onSubmit, onCloseModal }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'Draft',
    tags: [],
    template: '', // Add template to form data
    content: '', // Add content to form data
  });

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleDataChange = (newData: any) => {
    setFormData({ ...formData, ...newData });
  };

  const handleSubmit = async (data: any) => {
    try {
      await createScenario(data); // Call the API to create the scenario
      toast.success('Scenario created successfully');
      onSubmit(data);
      onCloseModal(); // Close the modal after submission
    } catch (error) {
      console.error('Failed to create scenario', error);
      toast.error('Failed to create scenario');
    }
  };

  switch (step) {
    case 1:
      return (
        <BasicInformation
          data={formData}
          onNext={(data: any) => {
            handleDataChange(data);
            nextStep();
          }}
        />
      );
    case 2:
      return (
        <TemplatesAndTags
          data={formData}
          onNext={(data: any) => {
            handleDataChange(data);
            nextStep();
          }}
          onBack={prevStep}
        />
      );
    case 3:
      return (
        <Content
          data={formData}
          onNext={(data: any) => {
            handleDataChange(data);
            nextStep();
          }}
          onBack={prevStep}
        />
      );
    case 4:
      return (
        <ReviewAndSubmit
          data={formData}
          onSubmit={(data: any) => {
            handleDataChange(data);
            handleSubmit(data); // Submit the form data
          }}
          onBack={prevStep}
        />
      );
    default:
      return null;
  }
};

export default MultiStepForm;
