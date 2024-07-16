import axios from 'axios';

export interface File {
  id: number;
  name: string;
  url: string;
  type: 'text' | 'video' | 'audio' | 'transcript';
  size: BigInt;
  date: string;
  thumbnail: string | null;
  project: Project | null;
}

export interface Project {
  id: string;
  name: string;
  color: string;
  createdAt: string;
  updatedAt: string;
  status: string;
}

interface FetchProjectsResponse {
  projects: Project[];
  totalProjects: number;
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
      project,
    },
  });
  return response.data;
};

export const fetchProjects = async (filters: { search?: string; fromDate?: string; toDate?: string; stage?: string; sort?: string; page?: number; itemsPerPage?: number }): Promise<FetchProjectsResponse> => {
  const response = await axios.get('http://localhost:3000/api/projects', {
    params: filters,
  });
  return response.data;
};

export const updateProject = async (id: string, updates: { name?: string; color?: string; status?: string }): Promise<Project> => {
  const response = await axios.put(`http://localhost:3000/api/projects/${id}`, updates);
  return response.data;
};

export const updateFilesProject = async (fileIds: number[], projectId: string): Promise<void> => {
  await axios.post('http://localhost:3000/api/files/updateProject', {
    fileIds,
    projectId,
  });
};

export const transcribeFile = async (fileId: number) => {
  const response = await axios.post('http://localhost:3000/api/files/transcribe', { fileId });
  return response.data;
};

export const transcribeBySpeechService = async (fileId: number) => {
  const response = await axios.post('http://localhost:3000/api/azure/schedule-speech-job', { fileId });
  return response.data;
}

export const videoEditingJob = async (fileId: number) => {
  const response = await axios.post('http://localhost:3000/api/azure/schedule-video-editing-job', { fileId });
  return response.data;
};

export const compressVideo = async (fileId: number) => {
  const response = await axios.post('http://localhost:3000/api/azure/compress-video', { fileId });
  return response.data;
};

export const mergeAudio = async (audioFileId: number, videoFileId: number) => {
  const response = await axios.post('http://localhost:3000/api/azure/merge-audio', { audioFileId, videoFileId });
  return response.data;
};

export const trimVideo = async (fileId: number) => {
  const response = await axios.post('http://localhost:3000/api/azure/trim-video', { fileId });
  return response.data;
};

export const generateSubtitles = async (fileId: number) => {
  const response = await axios.post('http://localhost:3000/api/azure/generate-subtitles', { fileId });
  return response.data;
};

export const addSubtitles = async (fileId: number) => {
  const response = await axios.post('http://localhost:3000/api/azure/add-subtitles', { fileId });
  return response.data;
};
