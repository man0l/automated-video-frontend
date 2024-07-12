import React, { useState, useEffect } from 'react';
import { useDebounce } from '../../../hooks/useDebounce';
import { fetchProjects, Project } from '../../../services/api'; // Adjust the import path as necessary

interface FiltersProps {
  filters: { search: string; fromDate?: string; toDate?: string; stage?: string; sort?: string };
  setFilters: React.Dispatch<React.SetStateAction<{ search: string; fromDate?: string; toDate?: string; stage?: string; sort?: string }>>;
}

const ProjectFilters: React.FC<FiltersProps> = ({ filters, setFilters }) => {
  const [search, setSearch] = useState(filters.search);
  const [fromDate, setFromDate] = useState(filters.fromDate || '');
  const [toDate, setToDate] = useState(filters.toDate || '');
  const [stage, setStage] = useState(filters.stage || '');
  const [sort, setSort] = useState(filters.sort || 'desc');

  const debouncedSearch = useDebounce(search, 500);
  const debouncedFromDate = useDebounce(fromDate, 500);
  const debouncedToDate = useDebounce(toDate, 500);
  const debouncedStage = useDebounce(stage, 500);
  const debouncedSort = useDebounce(sort, 500);

  useEffect(() => {
    setFilters({ search: debouncedSearch, fromDate: debouncedFromDate, toDate: debouncedToDate, stage: debouncedStage, sort: debouncedSort });
  }, [debouncedSearch, debouncedFromDate, debouncedToDate, debouncedStage, debouncedSort, setFilters]);

  const clearFilters = () => {
    setSearch('');
    setFromDate('');
    setToDate('');
    setStage('');
    setSort('desc');
    setFilters({ search: '', fromDate: '', toDate: '', stage: '', sort: 'desc' });
  };

  return (
    <div className="filters mb-4 p-4 bg-gray-100 rounded-lg shadow-md">
      <div className="flex flex-wrap -mx-2">
        <div className="p-2 w-full sm:w-1/2 md:w-1/4">
          <label className="block mb-1 text-sm font-medium">Search</label>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full p-2 border rounded-lg"
          />
        </div>
        <div className="p-2 w-full sm:w-1/2 md:w-1/4">
          <label className="block mb-1 text-sm font-medium">From Date</label>
          <input
            type="date"
            value={fromDate}
            onChange={e => setFromDate(e.target.value)}
            className="w-full p-2 border rounded-lg"
          />
        </div>
        <div className="p-2 w-full sm:w-1/2 md:w-1/4">
          <label className="block mb-1 text-sm font-medium">To Date</label>
          <input
            type="date"
            value={toDate}
            onChange={e => setToDate(e.target.value)}
            className="w-full p-2 border rounded-lg"
          />
        </div>
        <div className="p-2 w-full sm:w-1/2 md:w-1/4">
          <label className="block mb-1 text-sm font-medium">Stage</label>
          <select
            value={stage}
            onChange={e => setStage(e.target.value)}
            className="w-full p-2 border rounded-lg"
          >
            <option value="">All</option>
            <option value="initial">Initial</option>
            <option value="compressed">Compressed</option>
            <option value="merged">Merged</option>
            <option value="trimmed">Trimmed</option>
            <option value="subtitlesGenerated">Subtitles Generated</option>
          </select>
        </div>
        <div className="p-2 w-full sm:w-1/2 md:w-1/4">
          <label className="block mb-1 text-sm font-medium">Sort By Date</label>
          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            className="w-full p-2 border rounded-lg"
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>
        <div className="p-2 w-full flex justify-end space-x-2">
          <button onClick={clearFilters} className="bg-gray-500 text-white p-3 rounded-lg mt-4 hover:bg-gray-600 transition duration-200 md:px-6 md:py-2">
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectFilters;
