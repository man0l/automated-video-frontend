import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { fetchTemplates, createTemplate } from '../../services/templateService';
import Modal from '../../../../components/Modal';
import toast from 'react-hot-toast';

interface TemplatesAndTagsProps {
  data: any;
  onNext: (data: any) => void;
  onBack: () => void;
}

const TemplatesAndTags: React.FC<TemplatesAndTagsProps> = ({ data, onNext, onBack }) => {
  const [templates, setTemplates] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { handleSubmit, control, reset } = useForm({
    defaultValues: data,
  });

  useEffect(() => {
    const loadTemplates = async () => {
      const fetchedTemplates = await fetchTemplates();
      setTemplates(fetchedTemplates);
    };

    loadTemplates();
  }, []);

  const handleCreateTemplate = async (formData: any) => {
    try {
      const newTemplate = await createTemplate({ title: formData.title, content: formData.content });
      setTemplates([...templates, newTemplate]);
      setIsModalOpen(false);
      reset({ title: '', content: '' }); // Reset form fields
      toast.success('Template created successfully');
    } catch (error) {
      console.error('Failed to create template', error);
      toast.error('Failed to create template');
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onNext)} className="space-y-6">
        <div>
          <label className="block text-gray-700 font-semibold mb-1">Templates</label>
          <Controller
            name="template"
            control={control}
            render={({ field }) => (
              <>
                <select
                  {...field}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="" disabled>Select a template</option>
                  {templates.map((template) => (
                    <option key={template.id} value={template.id}>{template.title}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="mt-2 text-blue-500 hover:underline"
                >
                  Create New Template
                </button>
              </>
            )}
          />
        </div>
        <div className="flex justify-between">
          <button
            type="button"
            onClick={onBack}
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

      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onRequestClose={() => setIsModalOpen(false)}
          content={
            <form
              onSubmit={handleSubmit(handleCreateTemplate)}
              className="space-y-6"
            >
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
                  type="submit"
                  className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Create Template
                </button>
              </div>
            </form>
          }
        />
      )}
    </>
  );
};

export default TemplatesAndTags;
