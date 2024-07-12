import React, { useEffect, useState } from 'react';
import { fetchProjects, Project } from '../../services/api';
import ProjectCard from './components/ProjectCard';
import ProjectFilters from './components/ProjectFilters';
import Pagination from '../../components/Pagination';
import { ClipLoader } from 'react-spinners';
import toast from 'react-hot-toast';

const ProjectList: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({ search: '', fromDate: '', toDate: '', stage: '', sort: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    const loadProjects = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetchProjects({
          ...filters,
          page: currentPage,
          itemsPerPage,
        });
        console.log('Fetched Projects:', response.projects);  // Debugging log
        setProjects(response.projects || []);
        setTotalItems(response.totalProjects || 0);
      } catch (err) {
        console.error('Error loading projects', err);  // Debugging log
        setError('Error loading projects');
        setProjects([]);  // Ensure projects is an array
      } finally {
        setLoading(false);
      }
    };
    loadProjects();
  }, [filters, currentPage, itemsPerPage]);

  const handleActionClick = async (action: string, projectId: string) => {
    toast.promise(
      // Replace this with actual API call
      new Promise((resolve) => setTimeout(resolve, 2000)),
      {
        loading: `${action} in progress...`,
        success: `${action} completed successfully!`,
        error: `Error performing ${action}`,
      }
    );
  };

  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold mb-6 text-center">Projects</h2>
      <ProjectFilters filters={filters} setFilters={setFilters} />
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <ClipLoader size={50} color={"#123abc"} loading={loading} />
        </div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : (
        <>
          <div className="flex flex-wrap -mx-2">
            {projects.length > 0 ? (
              projects.map((project) => (
                <div key={project.id} className="p-2 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 min-w-[200px]">
                  <ProjectCard project={project} onActionClick={handleActionClick} />
                </div>
              ))
            ) : (
              <div className="text-center w-full">No projects found</div>
            )}
          </div>
          <div className="flex justify-center mt-6">
            <Pagination
              currentPage={currentPage}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={setItemsPerPage}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default ProjectList;
