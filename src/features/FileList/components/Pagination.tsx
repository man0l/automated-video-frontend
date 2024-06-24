// src/features/FileList/components/Pagination.tsx
import React from 'react';
import './Pagination.scss';

interface PaginationProps {
  currentPage: number;
  setCurrentPage: (page: number) => void;
  itemsPerPage: number;
  setItemsPerPage: (items: number) => void;
  totalItems: number;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, setCurrentPage, itemsPerPage, setItemsPerPage, totalItems }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to the first page when items per page changes
  };

  return (
    <div className="pagination flex justify-between items-center mt-4">
      <div>
        <button onClick={handlePrevious} disabled={currentPage === 1} className="px-4 py-2 mx-1 bg-gray-300 rounded">
          Previous
        </button>
        <span className="px-4 py-2 mx-1">{currentPage}</span>
        <button onClick={handleNext} disabled={currentPage === totalPages} className="px-4 py-2 mx-1 bg-gray-300 rounded">
          Next
        </button>
      </div>
      <div>
        <label htmlFor="itemsPerPage" className="mr-2">Items per page:</label>
        <select id="itemsPerPage" value={itemsPerPage} onChange={handleItemsPerPageChange} className="p-2 border rounded">
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={15}>15</option>
        </select>
      </div>
    </div>
  );
};

export default Pagination;
