// src/components/Footer.tsx
import React from 'react';
import './Footer.scss';

const Footer: React.FC = () => {
  return (
    <footer className="footer bg-secondary text-black p-4 mt-auto">
      <div className="container mx-auto text-center">
        <p>&copy; 2024 File Management System</p>
      </div>
    </footer>
  );
};

export default Footer;
