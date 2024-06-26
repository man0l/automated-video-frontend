import React, { useState, useEffect } from 'react';
import { FaPlay, FaDownload } from 'react-icons/fa';
import Modal from '../../../components/Modal';
import { ClipLoader } from 'react-spinners';
import './FileCard.scss';

interface File {
  id: number;
  name: string;
  url: string;
  type: 'text' | 'video' | 'audio';
  date: string;
  thumbnail: string | null;
  project?: {
    name: string;
    color: string;
  };
}

interface FileCardProps {
  file: File;
  isSelected: boolean;
  isSelectionMode: boolean;
  onSelect: (file: File) => void;
  onDeselect: (file: File) => void;
  canSelect: boolean;
}

const FileCard: React.FC<FileCardProps> = ({ file, isSelected, isSelectionMode, onSelect, onDeselect, canSelect }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isModalOpen) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isModalOpen]);

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
        {file.project && (
          <span className="project-tag" style={{ backgroundColor: file.project.color }}>
            {file.project.name}
          </span>
        )}
        <p>Type: {file.type}</p>
        <p>Date: {new Date(file.date).toLocaleDateString()}</p>
        <div className="flex justify-between mt-4">
          {file.type === 'video' || file.type === 'audio' ? (
            <button onClick={handlePreviewClick} className="text-blue-500 flex items-center icon" title="Play">
              <FaPlay className="mr-2" />
            </button>
          ) : (
            <div />
          )}
          <a href={file.url} download className="text-blue-500 flex items-center icon" title="Download">
            <FaDownload className="mr-2" />
          </a>
        </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        content={renderPreviewContent()}
      />
      {!canSelect && isSelectionMode && !isSelected && (
        <div className="not-selectable-overlay">
          You can only select one video and one audio file.
        </div>
      )}
    </div>
  );
};

export default FileCard;
