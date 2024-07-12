import React, { useState, useEffect } from 'react';
import { FaCompress, FaMusic, FaCut, FaClosedCaptioning, FaFileVideo } from 'react-icons/fa';
import {
  Project,
  updateProject,
  fetchFiles,
  transcribeBySpeechService,
  videoEditingJob,
  compressVideo,
  mergeAudio,
  trimVideo,
  generateSubtitles,
  addSubtitles,
} from '../../../services/api';
import toast from 'react-hot-toast';

interface ProjectCardProps {
  project: Project;
  onActionClick: (action: string, projectId: string) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onActionClick }) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadFiles = async () => {
      setLoading(true);
      try {
        const { files } = await fetchFiles(1, 100, '', '', '', '', project.id);
        setFiles(files);
        console.log('Fetched files:', files); // Debugging log
      } catch (error) {
        console.error('Error fetching project files:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFiles();
  }, [project.id]);

  const handleAction = async (action: string) => {
    try {
      const audioFiles = files.filter(file => file.type === 'audio');
      const videoFiles = files.filter(file => file.type === 'video');

      const latestAudioFile = audioFiles.reduce((latest, file) =>
        new Date(file.createdAt) > new Date(latest.createdAt) ? file : latest,
        audioFiles[0]
      );

      const latestVideoFile = videoFiles.reduce((latest, file) =>
        new Date(file.createdAt) > new Date(latest.createdAt) ? file : latest,
        videoFiles[0]
      );

      switch (action) {
        case 'compress':
          if (latestVideoFile) {
            await compressVideo(latestVideoFile.id);
            await updateProject(project.id, { status: 'compressed' });
            toast.success('Video compression scheduled successfully!');
          } else {
            toast.error('No video files found for compression');
          }
          break;
        case 'merge':
          if (latestAudioFile && latestVideoFile) {
            await mergeAudio(latestAudioFile.id, latestVideoFile.id);
            await updateProject(project.id, { status: 'merged' });
            toast.success('Audio merge scheduled successfully!');
          } else {
            toast.error('No audio or video files found for merging');
          }
          break;
        case 'trim':
          if (latestVideoFile) {
            await trimVideo(latestVideoFile.id);
            await updateProject(project.id, { status: 'trimmed' });
            toast.success('Video trim/cut scheduled successfully!');
          } else {
            toast.error('No video files found for trimming');
          }
          break;
        case 'generateSubtitles':
          if (latestAudioFile) {
            await generateSubtitles(latestAudioFile.id);
            await updateProject(project.id, { status: 'subtitlesGenerated' });
            toast.success('Subtitle generation scheduled successfully!');
          } else {
            toast.error('No audio files found for subtitle generation');
          }
          break;
        case 'addSubtitles':
          if (latestVideoFile) {
            await addSubtitles(latestVideoFile.id);
            await updateProject(project.id, { status: 'completed' });
            toast.success('Subtitles added successfully!');
          } else {
            toast.error('No video files found for adding subtitles');
          }
          break;
        default:
          break;
      }
    } catch (error) {
      toast.error(`Error performing ${action}`);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md m-4 overflow-hidden transform transition-transform hover:-translate-y-1">
      <div className="p-4" style={{ backgroundColor: project.color }}>
        <h3 className="text-white text-xl font-bold">{project.name}</h3>
      </div>
      <div className="p-4">
        <p className="mb-2">Created At: {new Date(project.createdAt).toLocaleDateString()}</p>
        <p className="mb-2">Updated At: {new Date(project.updatedAt).toLocaleDateString()}</p>
        <p className="mb-2">Status: {project.status}</p>
      </div>
      <div className="p-4 flex flex-col space-y-2">
        <button
          onClick={() => handleAction('compress')}
          disabled={project.status !== 'initial'}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
        >
          <FaCompress className="mr-2" /> Compress Video
        </button>
        <button
          onClick={() => handleAction('merge')}
          disabled={project.status !== 'compressed'}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
        >
          <FaMusic className="mr-2" /> Merge Audio
        </button>
        <button
          onClick={() => handleAction('trim')}
          disabled={project.status !== 'merged'}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
        >
          <FaCut className="mr-2" /> Trim/Cut
        </button>
        <button
          onClick={() => handleAction('generateSubtitles')}
          disabled={project.status !== 'trimmed'}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
        >
          <FaClosedCaptioning className="mr-2" /> Generate Subtitles
        </button>
        <button
          onClick={() => handleAction('addSubtitles')}
          disabled={project.status !== 'subtitlesGenerated'}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
        >
          <FaFileVideo className="mr-2" /> Add Subtitles
        </button>
      </div>
    </div>
  );
};

export default ProjectCard;
