// src/services/templateService.ts
import axios from 'axios';

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL as string;

export const fetchTemplates = async () => {
  try {
    const response = await axios.get('/api/templates'); // Update with your actual API endpoint
    return response.data || [];
  } catch (error) {
    console.error('Failed to fetch templates', error);
    return [];
  }
};

export const createTemplate = async (template: { title: string, content: string }) => {
  try {
    const response = await axios.post('/api/templates', template); // Update with your actual API endpoint
    return response.data;
  } catch (error) {
    console.error('Failed to create template', error);
    throw error;
  }
};


export const fetchTemplateById = async (id: string) => {
  try {
    const response = await axios.get(`/api/templates/${id}`); // Update with your actual API endpoint
    return response.data;
  } catch (error) {
    console.error('Failed to fetch template', error);
    throw error;
  }
}