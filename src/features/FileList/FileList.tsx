// src/features/FileList/FileList.tsx
import React, { useEffect, useState } from 'react';
import FileCard from './components/FileCard';
import Pagination from './components/Pagination';
import Filters from './components/Filters';
import { fetchFiles } from '../../services/api';
import './FileList.scss';

interface File {
  id: number;
  name: string;
  url: string;
  type: 'text' | 'video' | 'audio';
  date: string;
  thumbnail: string | null;
}

const FileList: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [filters, setFilters] = useState({ type: '', search: '' });
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    const loadFiles = async () => {
      setLoading(true);
      const allFiles = await fetchFiles(1, filters.type, filters.search);
      setTotalItems(allFiles.length);
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      setFiles(allFiles.slice(startIndex, endIndex));
      setLoading(false);
    };
    loadFiles();
  }, [currentPage, itemsPerPage, filters]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="file-list">
      <h2 className="text-2xl font-bold mb-4">Files</h2>
      <Filters filters={filters} setFilters={setFilters} />
      <div className="flex flex-wrap -mx-2">
        {files.map(file => (
          <div key={file.id} className="p-2 w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
            <FileCard file={file} />
          </div>
        ))}
      </div>
      <Pagination 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage} 
        itemsPerPage={itemsPerPage} 
        setItemsPerPage={setItemsPerPage} 
        totalItems={totalItems} 
      />
    </div>
  );
};

export default FileList;
