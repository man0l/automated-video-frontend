// src/features/Scenario/components/form/BasicInformation.tsx
import React from 'react';
import { useForm, Controller } from 'react-hook-form';

interface BasicInformationProps {
  data: any;
  onNext: (data: any) => void;
}

const BasicInformation: React.FC<BasicInformationProps> = ({ data, onNext }) => {
  const { handleSubmit, control, formState: { errors } } = useForm({
    defaultValues: {
      title: data.title || '',
      description: data.description || '',
      status: data.status || 'draft'
    }
  });

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-6">
      <div>
        <label className="block text-gray-700 font-semibold mb-1">Title</label>
        <Controller
          name="title"
          control={control}
          rules={{ required: "Title is required", maxLength: { value: 100, message: "Max length is 100 characters" } }}
          render={({ field }) => (
            <input
              {...field}
              type="text"
              placeholder="Enter scenario title"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}
        />
        {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
      </div>
      <div>
        <label className="block text-gray-700 font-semibold mb-1">Description</label>
        <Controller
          name="description"
          control={control}
          rules={{ required: "Description is required", maxLength: { value: 500, message: "Max length is 500 characters" } }}
          render={({ field }) => (
            <textarea
              {...field}
              placeholder="Enter a brief description"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}
        />
        {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
      </div>
      <div>
        <label className="block text-gray-700 font-semibold mb-1">Status</label>
        <Controller
          name="status"
          control={control}
          rules={{ required: "Status is required" }}
          render={({ field }) => (
            <select
              {...field}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          )}
        />
        {errors.status && <p className="text-red-500 text-sm">{errors.status.message}</p>}
      </div>
      <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
        Next
      </button>
    </form>
  );
};

export default BasicInformation;
