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
  File,
} from '../../../services/api';
import Modal from '../../../components/Modal';
import toast from 'react-hot-toast';
import { ClipLoader } from 'react-spinners';
import './ProjectCard.scss';

interface ProjectCardProps {
  project: Project;
  onActionClick: (action: string, projectId: string) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onActionClick }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalContent, setModalContent] = useState<JSX.Element | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const loadFiles = async () => {
      setLoading(true);
      try {
        const { files } = await fetchFiles(1, 100, '', '', '', '', project.id);
        setFiles(files);
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
        new Date(file.date) > new Date(latest.date) ? file : latest,
        audioFiles[0]
      );

      const latestVideoFile = videoFiles.reduce((latest, file) =>
        new Date(file.date) > new Date(latest.date) ? file : latest,
        videoFiles[0]
      );

      switch (action) {
        case 'compress':
          if (latestVideoFile) {
            await compressVideo(latestVideoFile.id);
            if (project.status === 'initial') await updateProject(project.id, { status: 'compressed' });
            toast.success('Video compression scheduled successfully!');
          } else {
            toast.error('No video files found for compression');
          }
          break;
        case 'merge':
          if (latestAudioFile && latestVideoFile) {
            await mergeAudio(latestAudioFile.id, latestVideoFile.id);
            if (project.status === 'compressed') await updateProject(project.id, { status: 'merged' });
            toast.success('Audio merge scheduled successfully!');
          } else {
            toast.error('No audio or video files found for merging');
          }
          break;
        case 'trim':
          if (latestVideoFile) {
            await trimVideo(latestVideoFile.id);
            if (project.status === 'merged') await updateProject(project.id, { status: 'trimmed' });
            toast.success('Video trim/cut scheduled successfully!');
          } else {
            toast.error('No video files found for trimming');
          }
          break;
        case 'generateSubtitles':
          if (latestAudioFile) {
            await generateSubtitles(latestAudioFile.id);
            if (project.status === 'trimmed') await updateProject(project.id, { status: 'subtitlesGenerated' });
            toast.success('Subtitle generation scheduled successfully!');
          } else {
            toast.error('No audio files found for subtitle generation');
          }
          break;
        case 'addSubtitles':
          if (latestVideoFile) {
            await addSubtitles(latestVideoFile.id);
            if (project.status === 'subtitlesGenerated') await updateProject(project.id, { status: 'completed' });
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

  const renderPreviewContent = (file: File) => {
    if (loading) {
      return <ClipLoader size={50} color={"#123abc"} loading={loading} />;
    }

    if (file.type === 'video') {
      return (
        <video controls className="w-full h-full">
          <source src={file.url} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      );
    } else if (file.type === 'audio') {
      return (
        <audio controls className="w-full">
          <source src={file.url} type="audio/mp3" />
          Your browser does not support the audio element.
        </audio>
      );
    } else if (file.type === 'text') {
      return (
        <div className="p-4 overflow-auto max-h-96">
          <pre>{file.url}</pre>
        </div>
      );
    } else {
      return (
        <img
          src={file.thumbnail || 'https://placehold.co/300x200'}
          alt={file.name}
          className="w-full h-full object-cover"
        />
      );
    }
  };

  const handlePreview = (file: File) => {
    setModalContent(renderPreviewContent(file));
    setIsModalOpen(true);
  };

  const latestAudioFile = files.filter(file => file.type === 'audio').reduce((latest, file) =>
    new Date(file.date) > new Date(latest.date) ? file : latest,
    files[0]
  );

  const latestVideoFile = files.filter(file => file.type === 'video').reduce((latest, file) =>
    new Date(file.date) > new Date(latest.date) ? file : latest,
    files[0]
  );

  const latestTranscriptFile = files.filter(file => file.type === 'text').reduce((latest, file) =>
    new Date(file.date) > new Date(latest.date) ? file : latest,
    files[0]
  );

  const isActionDisabled = (action: string) => {
    const statusOrder = ['initial', 'compressed', 'merged', 'trimmed', 'subtitlesGenerated', 'completed'];
    const currentStatusIndex = statusOrder.indexOf(project.status);
    const actionStatusIndex = statusOrder.indexOf(action);
    return actionStatusIndex > currentStatusIndex + 1;
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
          disabled={isActionDisabled('compressed')}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
        >
          <FaCompress className="mr-2" /> Compress Video
        </button>
        <button
          onClick={() => handleAction('merge')}
          disabled={isActionDisabled('merged')}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
        >
          <FaMusic className="mr-2" /> Merge Audio
        </button>
        <button
          onClick={() => handleAction('trim')}
          disabled={isActionDisabled('trimmed')}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
        >
          <FaCut className="mr-2" /> Trim/Cut
        </button>
        <button
          onClick={() => handleAction('generateSubtitles')}
          disabled={isActionDisabled('subtitlesGenerated')}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
        >
          <FaClosedCaptioning className="mr-2" /> Generate Subtitles
        </button>
        <button
          onClick={() => handleAction('addSubtitles')}
          disabled={isActionDisabled('completed')}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
        >
          <FaFileVideo className="mr-2" /> Add Subtitles
        </button>
      </div>
      <div className="p-4 flex justify-between space-x-2">
        {latestVideoFile && (
          <button
            onClick={() => handlePreview(latestVideoFile)}
            className="text-blue-500 flex items-center icon"
          >
            Preview Video
          </button>
        )}
        {latestAudioFile && (
          <button
            onClick={() => handlePreview(latestAudioFile)}
            className="text-blue-500 flex items-center icon"
          >
            Preview Audio
          </button>
        )}
        {latestTranscriptFile && (
          <button
            onClick={() => handlePreview(latestTranscriptFile)}
            className="text-blue-500 flex items-center icon"
          >
            Preview Transcript
          </button>
        )}
      </div>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        content={modalContent}
      />
    </div>
  );
};

export default ProjectCard;
