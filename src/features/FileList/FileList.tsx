import React, { useEffect, useState, useMemo } from 'react';
import { FaCheckCircle, FaTimesCircle, FaEdit } from 'react-icons/fa';
import FileCard from './components/FileCard';
import Pagination from '../../components/Pagination';
import Filters from './components/Filters';
import { fetchFiles, fetchProjects, updateFilesProject, File, Project } from '../../services/api';
import { ClipLoader } from 'react-spinners';
import toast from 'react-hot-toast';
import './FileList.scss';

const FileList: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filters, setFilters] = useState({ type: '', search: '', fromDate: '', toDate: '', project: '' });
  const [totalItems, setTotalItems] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [isBulkSelectionMode, setIsBulkSelectionMode] = useState(false);
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
        const { files, totalItems } = await fetchFiles(currentPage, itemsPerPage, filters.type, filters.search, filters.fromDate, filters.toDate, filters.project);
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

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const projects = await fetchProjects({itemsPerPage: 100});
        if (Array.isArray(projects)) {
          setProjects(projects);
        } else {
          setProjects([]);
        }
      } catch (err) {
        console.error('Error loading projects', err);
        setProjects([]);
      }
    };
    loadProjects();
  }, []);

  const handleSelectFile = (file: File) => {
    setSelectedFiles(prevSelected => [...prevSelected, file]);
  };

  const handleDeselectFile = (file: File) => {
    setSelectedFiles(prevSelected => prevSelected.filter(f => f.id !== file.id));
  };

  const handleSync = async () => {
    setSyncing(true);
    setSyncMessage(null);
    toast.promise(
      updateFilesProject(selectedFiles.map(file => file.id), selectedFiles[0].project?.id || ''),
      {
        loading: 'Syncing...',
        success: 'Files have been sent for synchronization.',
        error: 'Error syncing files.',
      }
    ).finally(() => {
      setSyncing(false);
      setIsSyncDisabled(true);
    });
  };
  
  const handleProjectChange = async (projectId: string) => {
    toast.promise(
      updateFilesProject(selectedFiles.map(file => file.id), projectId),
      {
        loading: 'Updating project...',
        success: 'Project updated successfully.',
        error: 'Error updating project.',
      }
    ).then(() => {
      const updatedFiles = files.map(file => {
        if (selectedFiles.some(selectedFile => selectedFile.id === file.id)) {
          return {
            ...file,
            project: projects.find(project => project.id === projectId) || null,
          };
        }
        return file;
      });
      setFiles(updatedFiles);
      setSelectedFiles([]);
    }).catch(err => {
      console.error('Error updating project', err);
    });
  };
  

  const toggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode);
    setIsBulkSelectionMode(false);
    if (isSelectionMode) {
      setSelectedFiles([]);
      setIsSyncDisabled(false);
    }
  };

  const toggleBulkSelectionMode = () => {
    setIsBulkSelectionMode(!isBulkSelectionMode);
    setIsSelectionMode(false);
    if (isBulkSelectionMode) {
      setSelectedFiles([]);
    }
  };

  const canSelectFile = (file: File) => {
    if (isBulkSelectionMode) {
      return true;
    }

    if(!isSelectionMode) {
      return true;
    }
    
    if (selectedFiles.some(f => f.id === file.id)) {
      return true;
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
        <button
          onClick={toggleSelectionMode}
          className="text-blue-500 flex items-center mr-4"
          disabled={isBulkSelectionMode}
        >
          {isSelectionMode ? <FaTimesCircle className="mr-2" /> : <FaCheckCircle className="mr-2" />}
          {isSelectionMode ? 'Exit Selection Mode' : 'Enter Selection Mode'}
        </button>
        <button
          onClick={toggleBulkSelectionMode}
          className="text-blue-500 flex items-center"
          disabled={isSelectionMode}
        >
          {isBulkSelectionMode ? <FaTimesCircle className="mr-2" /> : <FaEdit className="mr-2" />}
          {isBulkSelectionMode ? 'Exit Bulk Selection Mode' : 'Enter Bulk Selection Mode'}
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
        </div>
      )}
      {isBulkSelectionMode && selectedFiles.length > 0 && (
        <div className="mb-4 text-center text-blue-500">
          {`Selected ${selectedFiles.length} file${selectedFiles.length > 1 ? 's' : ''}`}
          <select
            onChange={(e) => handleProjectChange(e.target.value)}
            className="ml-4 bg-white border border-gray-300 p-2 rounded-lg"
          >
            <option value="">Change Project</option>
            {projects && projects.map((project) => (
              <option key={project.id} value={project.id}>{project.name}</option>
            ))}
          </select>
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
                    <div key={file.id} className="p-2 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 min-w-[200px]">
                      <FileCard
                        file={file}
                        isSelected={selectedFiles.some(f => f.id === file.id)}
                        isSelectionMode={isSelectionMode || isBulkSelectionMode}
                        onSelect={handleSelectFile}
                        onDeselect={handleDeselectFile}
                        canSelect={canSelectFile(file)}
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
