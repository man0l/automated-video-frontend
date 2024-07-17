import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';

interface TemplateFormProps {
  onSubmit: (data: any) => void;
  onCloseModal: () => void;
  initialData?: any;
}

const TemplateForm: React.FC<TemplateFormProps> = ({ onSubmit, onCloseModal, initialData }) => {
  const { handleSubmit, control, reset } = useForm({
    defaultValues: initialData || { title: '', content: '' }
  });

  useEffect(() => {
    reset(initialData || { title: '', content: '' });
  }, [initialData, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-gray-700 font-semibold mb-1">Template Title</label>
        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <input
              {...field}
              type="text"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}
        />
      </div>
      <div>
        <label className="block text-gray-700 font-semibold mb-1">Template Content</label>
        <Controller
          name="content"
          control={control}
          render={({ field }) => (
            <textarea
              {...field}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={6}
            />
          )}
        />
      </div>
      <div className="flex justify-end">
        <button
          type="button"
          onClick={onCloseModal}
          className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 mr-2"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {initialData ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
};

export default TemplateForm;
