import React, { useState, useEffect } from 'react';
import { useDebounce } from '../../../hooks/useDebounce';

interface FiltersProps {
  filters: { type: string; search: string; fromDate?: string; toDate?: string };
  setFilters: React.Dispatch<React.SetStateAction<{ type: string; search: string; fromDate?: string; toDate?: string }>>;
}

const Filters: React.FC<FiltersProps> = ({ filters, setFilters }) => {
  const [type, setType] = useState(filters.type);
  const [search, setSearch] = useState(filters.search);
  const [fromDate, setFromDate] = useState(filters.fromDate || '');
  const [toDate, setToDate] = useState(filters.toDate || '');

  const debouncedType = useDebounce(type, 500);
  const debouncedSearch = useDebounce(search, 500);
  const debouncedFromDate = useDebounce(fromDate, 500);
  const debouncedToDate = useDebounce(toDate, 500);

  useEffect(() => {
    setFilters({ type: debouncedType, search: debouncedSearch, fromDate: debouncedFromDate, toDate: debouncedToDate });
  }, [debouncedType, debouncedSearch, debouncedFromDate, debouncedToDate, setFilters]);

  const clearFilters = () => {
    setType('');
    setSearch('');
    setFromDate('');
    setToDate('');
    setFilters({ type: '', search: '', fromDate: '', toDate: '' });
  };

  return (
    <div className="filters mb-4 p-4 bg-gray-100 rounded-lg shadow-md">
      <div className="flex flex-wrap -mx-2">
        <div className="p-2 w-full sm:w-1/2 md:w-1/4">
          <label className="block mb-1 text-sm font-medium">Type</label>
          <select
            value={type}
            onChange={e => setType(e.target.value)}
            className="w-full p-2 border rounded-lg"
          >
            <option value="">All</option>
            <option value="text">Text</option>
            <option value="video">Video</option>
            <option value="audio">Audio</option>
          </select>
        </div>
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
        <div className="p-2 w-full flex justify-end space-x-2">
          <button onClick={clearFilters} className="bg-gray-500 text-white p-3 rounded-lg mt-4 hover:bg-gray-600 transition duration-200 md:px-6 md:py-2">
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default Filters;
