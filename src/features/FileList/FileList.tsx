import React, { useEffect, useState, useMemo } from 'react';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import FileCard from './components/FileCard';
import Pagination from './components/Pagination';
import Filters from './components/Filters';
import { fetchFiles, syncFiles, File } from '../../services/api';
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
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);
  const [isSyncDisabled, setIsSyncDisabled] = useState(false);

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

  const handleSelectFile = (file: File) => {
    setSelectedFiles(prevSelected => [...prevSelected, file]);
  };

  const handleDeselectFile = (file: File) => {
    setSelectedFiles(prevSelected => prevSelected.filter(f => f.id !== file.id));
  };

  const handleSync = async () => {
    setSyncing(true);
    setSyncMessage(null);
    try {
      await syncFiles(selectedFiles.map(file => file.id));
      setSyncMessage('Files have been sent for synchronization.');
      setIsSyncDisabled(true); // Disable the sync button after synchronization
    } catch (err) {
      setSyncMessage('Error syncing files.');
    } finally {
      setSyncing(false);
    }
  };

  const toggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode);
    if (isSelectionMode) {
      setSelectedFiles([]); // Clear selections when exiting selection mode
      setIsSyncDisabled(false); // Enable the sync button when exiting selection mode
    }
  };

  const canSelectFile = (file: File) => {
    if (selectedFiles.some(f => f.id === file.id)) {
      return true; // Always allow already selected files to be selectable
    }
    if (file.type !== 'video' && file.type !== 'audio') {
      return false;
    }
    if (selectedFiles.length === 0) {
      return true;
    }
    const selectedType = selectedFiles[0].type;
    if (selectedFiles.length === 1) {
      return file.type !== selectedType;
    }
    return false;
  };

  return (
    <div className="file-list p-4">
      <h2 className="text-3xl font-bold mb-6 text-center">Files</h2>
      <Filters filters={filters} setFilters={setFilters} />
      <div className="flex justify-end mb-4">
        <button onClick={toggleSelectionMode} className="text-blue-500 flex items-center">
          {isSelectionMode ? <FaTimesCircle className="mr-2" /> : <FaCheckCircle className="mr-2" />}
          {isSelectionMode ? 'Exit Selection Mode' : 'Enter Selection Mode'}
        </button>
      </div>
      {isSelectionMode && selectedFiles.length > 0 && (
        <div className="mb-4 text-center text-blue-500">
          {`Selected ${selectedFiles.length} file${selectedFiles.length > 1 ? 's' : ''}`}
          <button 
            onClick={handleSync} 
            className="ml-4 bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 transition duration-200"
            disabled={syncing || isSyncDisabled}
          >
            {syncing ? 'Syncing...' : 'Sync'}
          </button>
          {syncMessage && (
            <div className="mt-2 text-green-500">
              {syncMessage}
            </div>
          )}
        </div>
      )}
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
                      <FileCard
                        file={file}
                        isSelected={selectedFiles.some(f => f.id === file.id)}
                        isSelectionMode={isSelectionMode}
                        onSelect={handleSelectFile}
                        onDeselect={handleDeselectFile}
                        canSelect={canSelectFile(file)} // Pass canSelect prop
                      />
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
