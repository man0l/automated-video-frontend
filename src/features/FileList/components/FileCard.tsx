import React, { useState, useEffect } from 'react';
import { FaPlay, FaDownload } from 'react-icons/fa';
import Modal from '../../../components/Modal';
import { ClipLoader } from 'react-spinners';
import './FileCard.scss';

interface FileCardProps {
  file: {
    id: number;
    name: string;
    url: string;
    type: string;
    date: string;
    thumbnail: string | null;
  };
}

const FileCard: React.FC<FileCardProps> = ({ file }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isModalOpen) {
      // Simulate loading time
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1000); // Adjust loading time as needed

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

  const handlePreviewClick = () => {
    setIsLoading(true);
    setIsModalOpen(true);
  };

  return (
    <div className="file-card p-4 bg-white shadow-md rounded-lg">
      <img
        src={file.thumbnail || 'https://placehold.co/300x200'}
        alt={file.name}
        className="w-full h-32 object-cover rounded-t-lg"
      />
      <div className="p-4">
        <h3 className="text-xl font-semibold">{file.name}</h3>
        <p>Type: {file.type}</p>
        <p>Date: {new Date(file.date).toLocaleDateString()}</p>
        <div className="flex justify-between mt-4">
          {file.type === 'video' || file.type === 'audio' ? (
            <button onClick={handlePreviewClick} className="text-blue-500 flex items-center">
              <FaPlay className="mr-2" />
              Play File
            </button>
          ) : (
            <div />
          )}
          <a href={file.url} download className="text-blue-500 flex items-center">
            <FaDownload className="mr-2" />
            Download File
          </a>
        </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        content={renderPreviewContent()}
      />
    </div>
  );
};

export default FileCard;
