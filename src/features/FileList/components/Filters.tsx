// src/features/FileList/components/Filters.tsx
import React, { ChangeEvent } from 'react';
import './Filters.scss';

interface FiltersProps {
  filters: {
    type: string;
    search: string;
  };
  setFilters: (filters: { type: string; search: string }) => void;
}

const Filters: React.FC<FiltersProps> = ({ filters, setFilters }) => {
  const handleTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setFilters({ ...filters, type: e.target.value });
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, search: e.target.value });
  };

  return (
    <div className="filters flex justify-between mb-4">
      <select value={filters.type} onChange={handleTypeChange} className="p-2 border rounded">
        <option value="">All Types</option>
        <option value="text">Text</option>
        <option value="video">Video</option>
        <option value="audio">Audio</option>
      </select>
      <input
        type="text"
        value={filters.search}
        onChange={handleSearchChange}
        placeholder="Search files..."
        className="p-2 border rounded"
      />
    </div>
  );
};

export default Filters;
