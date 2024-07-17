import axios from 'axios';
import { Template, CreateTemplatePayload, UpdateTemplatePayload } from '../Template.types';

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL as string;

export const getTemplates = async (params: {
  search?: string;
  sort?: string;
  page?: number;
  itemsPerPage?: number;
}): Promise<{ templates: Template[]; totalItems: number }> => {
  const response = await axios.get<{ templates: Template[]; totalItems: number }>('/api/templates', { params });
  return response.data;
};

export const getTemplateById = async (id: string): Promise<Template> => {
  const response = await axios.get<Template>(`/api/templates/${id}`);
  return response.data;
};

export const createTemplate = async (template: CreateTemplatePayload): Promise<Template> => {
  const response = await axios.post<Template>('/api/templates', template);
  return response.data;
};

export const updateTemplate = async (id: string, template: UpdateTemplatePayload): Promise<Template> => {
  const response = await axios.put<Template>(`/api/templates/${id}`, template);
  return response.data;
};

export const deleteTemplate = async (id: string): Promise<void> => {
  await axios.delete(`/api/templates/${id}`);
};
