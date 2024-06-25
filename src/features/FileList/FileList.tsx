import React, { useEffect, useState, useMemo } from 'react';
import FileCard from './components/FileCard';
import Pagination from './components/Pagination';
import Filters from './components/Filters';
import { fetchFiles, File } from '../../services/api';
import { ClipLoader } from 'react-spinners';
import './FileList.scss';

const FileList: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [filters, setFilters] = useState({ type: '', search: '', fromDate: '', toDate: '' });
  const [totalItems, setTotalItems] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const memoizedFilters = useMemo(() => filters, [filters]);
  const memoizedPagination = useMemo(() => ({ currentPage, itemsPerPage }), [currentPage, itemsPerPage]);

  useEffect(() => {
    const loadFiles = async () => {
      setLoading(true);
      setError(null);
      try {
        const { files, totalItems } = await fetchFiles(currentPage, itemsPerPage, filters.type, filters.search, filters.fromDate, filters.toDate);
        setFiles(files);
        setTotalItems(totalItems);
      } catch (err) {
        setError('Error loading files');
      } finally {
        setLoading(false);
      }
    };
    loadFiles();
  }, [memoizedFilters, memoizedPagination]);

  return (
    <div className="file-list p-4">
      <h2 className="text-3xl font-bold mb-6 text-center">Files</h2>
      <Filters filters={filters} setFilters={setFilters} />
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <ClipLoader size={50} color={"#123abc"} loading={loading} />
        </div>
      ) : (
        <>
          {error ? (
            <div className="text-center text-red-500">{error}</div>
          ) : (
            <>
              <div className="flex flex-wrap -mx-2">
                {files.length > 0 ? (
                  files.map(file => (
                    <div key={file.id} className="p-2 w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
                      <FileCard file={file} />
                    </div>
                  ))
                ) : (
                  <div className="text-center w-full">No files found</div>
                )}
              </div>
              <div className="flex justify-center mt-6">
                <Pagination 
                  currentPage={currentPage} 
                  setCurrentPage={setCurrentPage} 
                  itemsPerPage={itemsPerPage} 
                  setItemsPerPage={setItemsPerPage} 
                  totalItems={totalItems} 
                />
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default FileList;
