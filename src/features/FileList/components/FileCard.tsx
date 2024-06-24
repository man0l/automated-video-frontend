// src/features/FileList/components/FileCard.tsx
import React from 'react';
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
  return (
    <div className="file-card p-4 bg-white shadow-md rounded-lg">
      <img
        src={file.thumbnail || '/assets/images/placeholder.png'}
        alt={file.name}
        className="w-full h-32 object-cover rounded-t-lg"
      />
      <div className="p-4">
        <h3 className="text-xl font-semibold">{file.name}</h3>
        <p>Type: {file.type}</p>
        <p>Date: {new Date(file.date).toLocaleDateString()}</p>
        <a href={file.url} className="text-blue-500">View File</a>
      </div>
    </div>
  );
};

export default FileCard;
