import React, { useState, useEffect } from 'react';
import { FaPlay, FaDownload, FaFileAlt, FaEdit } from 'react-icons/fa'; // Added FaEdit icon
import Modal from '../../../components/Modal';
import { ClipLoader } from 'react-spinners';
import { transcribeBySpeechService, videoEditingJob } from '../../../services/api'; // Import videoEditingJob function
import toast from 'react-hot-toast';
import './FileCard.scss';

interface File {
  id: number;
  name: string;
  url: string;
  type: 'text' | 'video' | 'audio';
  date: string;
  thumbnail: string | null;
  size: string; // Size as a string
  project?: {
    id: string;
    name: string;
    color: string;
  } | null;
}

interface FileCardProps {
  file: File;
  isSelected: boolean;
  isSelectionMode: boolean;
  onSelect: (file: File) => void;
  onDeselect: (file: File) => void;
  canSelect: boolean;
}

const FileCard: React.FC<FileCardProps> = ({
  file,
  isSelected,
  isSelectionMode,
  onSelect,
  onDeselect,
  canSelect,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // State for video editing job

  useEffect(() => {
    if (isModalOpen) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isModalOpen]);

  const formatFileSize = (size: string) => {
    const bytes = parseInt(size, 10);
    if (isNaN(bytes) || bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const renderPreviewContent = () => {
    if (isLoading) {
      return <ClipLoader size={50} color={"#123abc"} loading={isLoading} />;
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

  const handleCheckboxChange = () => {
    if (isSelected) {
      onDeselect(file);
    } else {
      onSelect(file);
    }
  };

  const handlePreviewClick = () => {
    setIsLoading(true);
    setIsModalOpen(true);
  };

  const handleTranscribe = async () => {
    setIsTranscribing(true);
    toast.promise(
      transcribeBySpeechService(file.id),
      {
        loading: 'Transcribing...',
        success: 'File transcribed successfully!',
        error: 'Error transcribing file.',
      }
    ).finally(() => {
      setIsTranscribing(false);
    });
  };

  const handleVideoEdit = async () => { // Function for handling video editing job
    setIsEditing(true);
    toast.promise(
      videoEditingJob(file.id),
      {
        loading: 'Editing video...',
        success: 'Video editing job scheduled successfully!',
        error: 'Error scheduling video editing job.',
      }
    ).finally(() => {
      setIsEditing(false);
    });
  };

  return (
    <div className={`file-card p-4 bg-white shadow-md rounded-lg ${isSelected ? 'border-2 border-blue-500' : ''} ${!canSelect && !isSelected ? 'not-selectable' : ''}`}>
      {isSelectionMode && (
        <input
          type="checkbox"
          checked={isSelected}
          onChange={handleCheckboxChange}
          disabled={!canSelect && !isSelected}
          className="mb-2"
        />
      )}
      <img
        src={file.thumbnail || 'https://placehold.co/300x200'}
        alt={file.name}
        className="w-full h-32 object-cover rounded-t-lg"
      />
      <div className="p-4">
        <h3 className="text-xl font-semibold truncate" title={file.name}>{file.name}</h3>
        <p>Type: {file.type}</p>
        <p>Date: {new Date(file.date).toLocaleDateString()}</p>
        <p><span className="file-size text-gray-600 text-sm">
              ({formatFileSize(file.size)})
            </span></p>
        {file.project && (
          <div className="flex items-center">
            <span
              className="project-tag mr-2"
              style={{ backgroundColor: file.project.color }}
              title={file.project.name}
            >
              {file.project.name}
            </span>            
          </div>
        )}
        <div className="flex justify-between mt-4">
          {file.type === 'video' || file.type === 'audio' ? (
            <>
              <button onClick={handlePreviewClick} className="text-blue-500 flex items-center icon" title="Play File">
                <FaPlay />
              </button>
              {file.type === 'audio' && file.project && (
                <button onClick={handleTranscribe} className="text-blue-500 flex items-center icon" title="Transcribe File">
                  <FaFileAlt />
                </button>
              )}
              {file.type === 'video' && (
                <button onClick={handleVideoEdit} className="text-blue-500 flex items-center icon" title="Edit Video">
                  <FaEdit />
                </button>
              )}
            </>
          ) : (
            <div />
          )}
          <a href={file.url} download className="text-blue-500 flex items-center icon" title="Download File">
            <FaDownload />
          </a>
        </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        content={renderPreviewContent()}
      />
      {!canSelect && isSelectionMode && !isSelected && (
        <div className="tooltip">
          You can only select one video and one audio file.
        </div>
      )}
    </div>
  );
};

export default FileCard;
