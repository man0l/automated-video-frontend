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
  itemsPerPage: number = 5,
  type: string = '',
  search: string = '',
  fromDate?: string,
  toDate?: string
): Promise<{ files: File[]; totalItems: number }> => {
  const response = await axios.get('http://localhost:3000/api/files', {
    params: {
      page,
      itemsPerPage,
      type,
      search,
      fromDate,
      toDate,
    },
  });

  return response.data;
};
