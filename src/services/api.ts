import axios from 'axios';

export interface File {
  id: number;
  name: string;
  url: string;
  type: 'text' | 'video' | 'audio' | 'transcript';
  date: string;
  thumbnail: string | null;
  project: Project | null;
}

export interface Project {
  id: string;
  name: string;
  color: string;
}

export const fetchFiles = async (
  page: number = 1,
  itemsPerPage: number = 5,
  type: string = '',
  search: string = '',
  fromDate: string = '',
  toDate: string = '',
  project: string = ''
): Promise<{ files: File[], totalItems: number }> => {
  const response = await axios.get('http://localhost:3000/api/files', {
    params: {
      page,
      itemsPerPage,
      type,
      search,
      fromDate,
      toDate,
      project, // Include the project parameter
    },
  });
  return response.data;
};
export const fetchProjects = async (): Promise<Project[]> => {
  const response = await axios.get('http://localhost:3000/api/projects');
  return response.data;
};

export const updateFilesProject = async (fileIds: number[], projectId: string): Promise<void> => {
  await axios.post('http://localhost:3000/api/files/updateProject', {
    fileIds,
    projectId,
  });
};

export const transcribeFile = async (fileId: number) => {
  try {
    const response = await axios.post('http://localhost:3000/api/files/transcribe', { fileId });
    return response.data;
  } catch (error) {
    console.error('Error transcribing file:', error);
    throw error;
  }
};

export const transcribeBySpeechService = async (fileId: number) => {
  try {
    const response = await axios.post('http://localhost:3000/api/azure/schedule-speech-job', { fileId });
    return response.data;
  } catch (error) {
    console.error('Error transcribing file:', error);
    throw error;
  }
}

export const videoEditingJob = async (fileId: number) => {
  try {
    const response = await axios.post('http://localhost:3000/api/azure/schedule-video-editing-job', { fileId });
    return response.data;
  } catch (error) {
    console.error('Error editing video:', error);
    throw error;
  }
}