import React, { useState, useEffect } from 'react';
import { FaCompress, FaMusic, FaCut, FaClosedCaptioning, FaFileVideo, FaVideo, FaFileAlt, FaFileAudio, FaClosedCaptioning as FaSubtitles, FaFileArchive } from 'react-icons/fa';
import {
  Project,
  updateProject,
  fetchFiles,
  compressVideo,
  mergeAudio,
  trimVideo,
  generateSubtitles,
  addSubtitles,
  File,
} from '../../../services/api';
import Modal from '../../../components/Modal';
import toast, { Toaster } from 'react-hot-toast';
import { ClipLoader } from 'react-spinners';
import jsonBeautify from 'json-beautify';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import './ProjectCard.scss';

interface ProjectCardProps {
  project: Project;
  onActionClick: (action: string, projectId: string) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onActionClick }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [latestVideoFile, setLatestVideoFile] = useState<File | null>(null);
  const [latestAudioFile, setLatestAudioFile] = useState<File | null>(null);
  const [latestTranscriptFile, setLatestTranscriptFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [modalContent, setModalContent] = useState<JSX.Element | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState<Project>(project);
  const [downloadProgress, setDownloadProgress] = useState<number>(0);

  useEffect(() => {
    const loadFiles = async () => {
      setLoading(true);
      try {
        const { files } = await fetchFiles(1, 100, '', '', '', '', project.id);
        setFiles(files);

        const audioFiles = files.filter(file => file.type === 'audio');
        const videoFiles = files.filter(file => file.type === 'video');
        const transcriptFiles = files.filter(file => file.type === 'transcript');

        const latestAudio = audioFiles.reduce((latest, file) =>
          new Date(file.date) > new Date(latest.date) ? file : latest,
          audioFiles[0]
        );

        const latestVideo = videoFiles.reduce((latest, file) =>
          new Date(file.date) > new Date(latest.date) ? file : latest,
          videoFiles[0]
        );

        const latestTranscript = transcriptFiles.reduce((latest, file) =>
          new Date(file.date) > new Date(latest.date) ? file : latest,
          transcriptFiles[0]
        );

        setLatestAudioFile(latestAudio || null);
        setLatestVideoFile(latestVideo || null);
        setLatestTranscriptFile(latestTranscript || null);

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
      let newStatus = currentProject.status;

      switch (action) {
        case 'compress':
          if (latestVideoFile) {
            await compressVideo(latestVideoFile.id);
            if (currentProject.status === 'initial') newStatus = 'compressed';
            toast.success('Video compression scheduled successfully!');
          } else {
            toast.error('No video files found for compression');
          }
          break;
        case 'merge':
          if (latestAudioFile && latestVideoFile) {
            await mergeAudio(latestAudioFile.id, latestVideoFile.id);
            if (currentProject.status === 'compressed') newStatus = 'merged';
            toast.success('Audio merge scheduled successfully!');
          } else {
            toast.error('No audio or video files found for merging');
          }
          break;
        case 'trim':
          if (latestVideoFile) {
            await trimVideo(latestVideoFile.id);
            if (currentProject.status === 'merged') newStatus = 'trimmed';
            toast.success('Video trim/cut scheduled successfully!');
          } else {
            toast.error('No video files found for trimming');
          }
          break;
        case 'generateSubtitles':
          if (latestVideoFile) {
            await generateSubtitles(latestVideoFile.id);
            if (currentProject.status === 'trimmed') newStatus = 'subtitlesGenerated';
            toast.success('Subtitle generation scheduled successfully!');
          } else {
            toast.error('No video files found for subtitle generation');
          }
          break;
        case 'addSubtitles':
          if (latestVideoFile) {
            await addSubtitles(latestVideoFile.id);
            if (currentProject.status === 'subtitlesGenerated') newStatus = 'completed';
            toast.success('Subtitles added successfully!');
          } else {
            toast.error('No video files found for adding subtitles');
          }
          break;
        default:
          break;
      }

      // Update project status in the API
      if (newStatus !== currentProject.status) {
        await updateProject(currentProject.id, { status: newStatus });
        setCurrentProject({ ...currentProject, status: newStatus });
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
    } else if (file.type === 'transcript' || file.type === 'text') {
      return (
        <div className="p-4 overflow-auto max-h-96">
          <pre>{jsonBeautify(JSON.parse(file.url), null, 2, 80)}</pre>
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

  const handlePreview = async (file: File) => {
    if (file.type === 'transcript') {
      const response = await fetch(file.url);
      const data = await response.json();
      setModalContent(renderPreviewContent({ ...file, url: JSON.stringify(data) }));
    } else {
      setModalContent(renderPreviewContent(file));
    }
    setIsModalOpen(true);
  };

  const isActionDisabled = (action: string) => {
    const statusOrder = ['initial', 'compressed', 'merged', 'trimmed', 'subtitlesGenerated', 'completed'];
    const currentStatusIndex = statusOrder.indexOf(currentProject.status);
    const actionStatusIndex = statusOrder.indexOf(action);
    return actionStatusIndex > currentStatusIndex + 1;
  };

  const handleDownloadAll = async () => {
    if (!latestVideoFile || !latestTranscriptFile) {
      toast.error('Latest video or transcript files not found.');
      return;
    }

    const zip = new JSZip();
    let loadedBytes = 0;
    const filesToDownload = [latestVideoFile, latestTranscriptFile];
    let totalBytes = 0;

    const updateProgress = () => {
      setDownloadProgress((loadedBytes / totalBytes) * 100);
    };

    const toastId = toast.loading('Downloading files...', {
      duration: 0, // Make the toast persistent
      icon: '⬇️',
    });

    const filePromises = filesToDownload.map(async file => {
      const response = await fetch(file.url);
      const reader = response.body.getReader();
      const contentLength = +response.headers.get('Content-Length');
      totalBytes += contentLength;

      let receivedLength = 0;
      const chunks = [];

      while(true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }
        chunks.push(value);
        receivedLength += value.length;
        loadedBytes += value.length;
        updateProgress();
        toast.loading(`Downloading files... ${Math.round((loadedBytes / totalBytes) * 100)}%`, {
          id: toastId,
        });
      }

      const blob = new Blob(chunks);
      zip.file(file.name, blob);
    });

    await Promise.all(filePromises);

    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, `${currentProject.name}-files.zip`);
    toast.dismiss(toastId); // Dismiss the loading toast
    toast.success('All files downloaded successfully!');
  };

  return (
    <div className="bg-white rounded-lg shadow-md m-4 overflow-hidden transform transition-transform hover:-translate-y-1">
      <div className="p-4" style={{ backgroundColor: currentProject.color }}>
        <h3 className="text-white text-xl font-bold">{currentProject.name}</h3>
      </div>
      <div className="p-4">
        <img
          src={latestVideoFile?.thumbnail || 'https://placehold.co/300x200'}
          alt={latestVideoFile?.name}
          className="w-full h-32 object-cover rounded-t-lg"
        />
        <p className="mb-2">Created At: {new Date(currentProject.createdAt).toLocaleDateString()}</p>
        <p className="mb-2">Updated At: {new Date(currentProject.updatedAt).toLocaleDateString()}</p>
        <p className="mb-2">Status: {currentProject.status}</p>
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
            <FaVideo />
          </button>
        )}
        {latestTranscriptFile && (
          <button
            onClick={() => handlePreview(latestTranscriptFile)}
            className="text-blue-500 flex items-center icon"
          >
            <FaSubtitles />
          </button>
        )}
        {latestAudioFile && (
          <button
            onClick={() => handlePreview(latestAudioFile)}
            className="text-blue-500 flex items-center icon"
          >
            <FaFileAudio />
          </button>
        )}
        {latestTranscriptFile && (
          <button
            onClick={() => handlePreview(latestTranscriptFile)}
            className="text-blue-500 flex items-center icon"
          >
            <FaFileAlt />
          </button>
        )}
        {latestVideoFile && latestTranscriptFile && (
          <button
            onClick={handleDownloadAll}
            className="text-blue-500 flex items-center icon"
          >
            <FaFileArchive />
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
