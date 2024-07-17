import React, { useState, useEffect } from 'react';
import { useDebounce } from '../../../hooks/useDebounce';

interface FiltersProps {
  filters: { search: string; sort: string; page: number; itemsPerPage: number };
  setFilters: React.Dispatch<React.SetStateAction<{ search: string; sort: string; page: number; itemsPerPage: number }>>;
}

const TemplateFilters: React.FC<FiltersProps> = ({ filters, setFilters }) => {
  const [search, setSearch] = useState(filters.search);
  const [sort, setSort] = useState(filters.sort);

  const debouncedSearch = useDebounce(search, 500);
  const debouncedSort = useDebounce(sort, 500);

  useEffect(() => {
    setFilters((prev) => ({ ...prev, search: debouncedSearch, sort: debouncedSort }));
  }, [debouncedSearch, debouncedSort, setFilters]);

  const clearFilters = () => {
    setSearch('');
    setSort('desc');
    setFilters({ search: '', sort: 'desc', page: 1, itemsPerPage: 10 });
  };

  return (
    <div className="filters mb-4 p-4 bg-gray-100 rounded-lg shadow-md">
      <div className="flex flex-wrap -mx-2">
        <div className="p-2 w-full sm:w-1/2 md:w-1/4">
          <label className="block mb-1 text-sm font-medium">Search</label>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-2 border rounded-lg"
          />
        </div>
        <div className="p-2 w-full sm:w-1/2 md:w-1/4">
          <label className="block mb-1 text-sm font-medium">Sort By</label>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
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

export default TemplateFilters;
