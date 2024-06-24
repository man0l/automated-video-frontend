// src/services/api.ts
import axios from 'axios';

export interface File {
  id: number;
  name: string;
  url: string;
  type: 'text' | 'video' | 'audio';
  date: string;
  thumbnail: string | null;
}

export const fetchFiles = async (
  page: number = 1,
  type: string = '',
  search: string = ''
): Promise<File[]> => {
  const response = await axios.get('/api/files');
  const files: File[] = response.data;
  
  return files.filter(file => {
    return (
      (type === '' || file.type === type) &&
      (search === '' || file.name.toLowerCase().includes(search.toLowerCase()))
    );
  });
};
