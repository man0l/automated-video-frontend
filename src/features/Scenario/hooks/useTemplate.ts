import { useState, useEffect } from 'react';
import { getTemplates, createTemplate, updateTemplate, deleteTemplate } from '../services/templateService';
import { Template, CreateTemplatePayload, UpdateTemplatePayload } from '../Template.types';

const useTemplate = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({ search: '', sort: 'desc', page: 1, itemsPerPage: 10 });
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    fetchTemplates();
  }, [filters]);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const { templates, totalItems } = await getTemplates(filters);
      setTemplates(templates);
      setTotalItems(totalItems);
    } catch (err) {
      setError(err.message);
      setTemplates([]);
    } finally {
      setLoading(false);
    }
  };

  const addTemplate = async (template: CreateTemplatePayload) => {
    try {
      const newTemplate = await createTemplate(template);
      setTemplates((prevTemplates) => [...prevTemplates, newTemplate]);
    } catch (err) {
      setError(err.message);
    }
  };

  const editTemplate = async (id: string, updatedTemplate: UpdateTemplatePayload) => {
    try {
      const updated = await updateTemplate(id, updatedTemplate);
      await fetchTemplates();
      // setTemplates((prevTemplates) =>
      //   prevTemplates.map((template) => (template.id === id ? updated : template))
      // );
    } catch (err) {
      setError(err.message);
    }
  };

  const removeTemplate = async (id: string) => {
    try {
      await deleteTemplate(id);
      setTemplates((prevTemplates) =>
        prevTemplates.filter((template) => template.id !== id)
      );
    } catch (err) {
      setError(err.message);
    }
  };

  return {
    templates,
    loading,
    error,
    filters,
    setFilters,
    totalItems,
    addTemplate,
    editTemplate,
    removeTemplate,
  };
};

export default useTemplate;
