// src/features/Scenario/components/form/Content.tsx
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import './Content.scss';

interface ContentProps {
  data: any;
  onNext: (data: any) => void;
  onBack: (data: any) => void;
}

const Content: React.FC<ContentProps> = ({ data, onNext, onBack }) => {
  const { handleSubmit, control } = useForm({
    defaultValues: {
      content: data.content || ''
    }
  });

  return (
    <form onSubmit={handleSubmit(onNext)} className="form-container">
      <div className="flex-grow">
        <label className="block text-gray-700 font-semibold mb-1">Content</label>
        <Controller
          control={control}
          name="content"
          render={({ field }) => (
            <textarea
              className="textarea"
              {...field}
            />
          )}
        />
      </div>
      <div className="buttons mt-4">
        <button
          type="button"
          onClick={handleSubmit((data) => onBack(data))}
          className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Back
        </button>
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Next
        </button>
      </div>
    </form>
  );
};

export default Content;
