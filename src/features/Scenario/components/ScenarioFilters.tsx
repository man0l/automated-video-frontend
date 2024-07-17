// src/components/ScenarioFilters.tsx
import React, { useState, useEffect } from 'react';
import { useDebounce } from '../../../hooks/useDebounce';

interface FiltersProps {
  filters: { search: string; fromDate?: string; toDate?: string; status?: string; sort?: string };
  setFilters: React.Dispatch<React.SetStateAction<{ search: string; fromDate?: string; toDate?: string; status?: string; sort?: string }>>;
}

const ScenarioFilters: React.FC<FiltersProps> = ({ filters, setFilters }) => {
  const [search, setSearch] = useState(filters.search);
  const [fromDate, setFromDate] = useState(filters.fromDate || '');
  const [toDate, setToDate] = useState(filters.toDate || '');
  const [status, setStatus] = useState(filters.status || '');
  const [sort, setSort] = useState(filters.sort || 'desc');

  const debouncedSearch = useDebounce(search, 500);
  const debouncedFromDate = useDebounce(fromDate, 500);
  const debouncedToDate = useDebounce(toDate, 500);
  const debouncedStatus = useDebounce(status, 500);
  const debouncedSort = useDebounce(sort, 500);

  useEffect(() => {
    setFilters({ search: debouncedSearch, fromDate: debouncedFromDate, toDate: debouncedToDate, status: debouncedStatus, sort: debouncedSort });
  }, [debouncedSearch, debouncedFromDate, debouncedToDate, debouncedStatus, debouncedSort, setFilters]);

  const clearFilters = () => {
    setSearch('');
    setFromDate('');
    setToDate('');
    setStatus('');
    setSort('desc');
    setFilters({ search: '', fromDate: '', toDate: '', status: '', sort: 'desc' });
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
          <label className="block mb-1 text-sm font-medium">Status</label>
          <select
            value={status}
            onChange={e => setStatus(e.target.value)}
            className="w-full p-2 border rounded-lg"
          >
            <option value="">All</option>
            <option value="Draft">Draft</option>
            <option value="Published">Published</option>
            <option value="Archived">Archived</option>
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

export default ScenarioFilters;
