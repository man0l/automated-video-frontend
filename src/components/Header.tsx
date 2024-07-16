// src/components/Header.tsx
import React from 'react';
import './Header.scss';

const Header: React.FC = () => {
  return (
    <header className="header bg-gray-400 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl"><a href="/">AI Video</a></h1>
        <nav>
          <ul className="flex space-x-4">
            <li><a href="/" className="hover:text-gray-300">Home</a></li>
            <li><a href="/projects" className="hover:text-gray-300">Projects</a></li>
            <li><a href="/scenarios" className="hover:text-gray-300">Scenarios</a></li> {/* New link to Scenarios */}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
