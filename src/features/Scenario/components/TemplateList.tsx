import React, { useState, useEffect } from 'react';
import Modal from '../../../components/Modal';
import TemplateForm from './form/TemplateForm';
import CSVUploadForm from './form/CSVUploadForm';
import toast from 'react-hot-toast';
import useTemplate from '../hooks/useTemplate';
import TemplateFilters from './TemplateFilters';
import Pagination from '../../../components/Pagination';
import { Template, CreateTemplatePayload, UpdateTemplatePayload } from '../Template.types';

const TemplateList: React.FC = () => {
  const {
    templates,
    loading,
    error,
    filters,
    setFilters,
    totalItems,
    addTemplate,
    editTemplate,
    removeTemplate,
  } = useTemplate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCSVModalOpen, setIsCSVModalOpen] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState<Template | null>(null);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const openModal = (template: Template | null = null) => {
    setCurrentTemplate(template);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setCurrentTemplate(null);
    setIsModalOpen(false);
  };

  const openCSVModal = () => setIsCSVModalOpen(true);
  const closeCSVModal = () => setIsCSVModalOpen(false);

  const handleFormSubmit = async (data: CreateTemplatePayload | UpdateTemplatePayload) => {
    if (currentTemplate) {
      await editTemplate(currentTemplate.id, data);
      toast.success('Template updated successfully!');
    } else {
      await addTemplate(data as CreateTemplatePayload);
      toast.success('Template created successfully!');
    }
    closeModal();
  };

  const handleCSVImport = async (templates: CreateTemplatePayload[]) => {
    for (const template of templates) {
      await addTemplate(template);
    }
    toast.success('Templates imported successfully!');
    closeCSVModal();
  };

  const handleActionClick = (action: string, templateId: string) => {
    if (action === 'Edit') {
      const template = templates.find((t) => t.id === templateId);
      openModal(template || null);
    } else if (action === 'Delete') {
      toast.promise(
        removeTemplate(templateId),
        {
          loading: 'Deleting template...',
          success: 'Template deleted successfully!',
          error: 'Error deleting template',
        }
      );
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between mb-4">
        <button
          onClick={() => openModal()}
          className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
        >
          Create Template
        </button>
        <button
          onClick={openCSVModal}
          className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-600"
        >
          Import Templates from CSV
        </button>
      </div>
      <TemplateFilters filters={filters} setFilters={setFilters} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {loading ? (
          <p className="col-span-full text-center text-gray-500">Loading templates...</p>
        ) : (
          templates.map((template) => (
            <div key={template.id} className="bg-white p-6 rounded-lg shadow-md">
              <div className="mb-4">
                <h2 className="text-2xl font-bold mb-2 text-gray-800">{template.title}</h2>
                <p className="text-gray-700">{template.content}</p>
                <p className="text-gray-500 mt-2">Scenarios: {template.scenarioCount}</p>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => handleActionClick('Edit', template.id)}
                  className="bg-yellow-500 text-white py-1 px-3 rounded-md mr-2 hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleActionClick('Delete', template.id)}
                  className="bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="mt-6">
        <Pagination
          currentPage={filters.page}
          setCurrentPage={(page) => setFilters((prev) => ({ ...prev, page }))}
          itemsPerPage={filters.itemsPerPage}
          setItemsPerPage={(items) => setFilters((prev) => ({ ...prev, itemsPerPage: items }))}
          totalItems={totalItems}
        />
      </div>
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          content={<TemplateForm onSubmit={handleFormSubmit} onCloseModal={closeModal} initialData={currentTemplate} />}
        />
      )}
      {isCSVModalOpen && (
        <Modal
          isOpen={isCSVModalOpen}
          onRequestClose={closeCSVModal}
          content={<CSVUploadForm onSubmit={handleCSVImport} />}
        />
      )}
    </div>
  );
};

export default TemplateList;
