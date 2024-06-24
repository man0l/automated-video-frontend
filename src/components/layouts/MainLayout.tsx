// src/layouts/MainLayout.tsx
import React, { ReactNode } from 'react';
import Header from '../Header';
import Footer from '../Footer';
import { Outlet } from 'react-router-dom';
import './MainLayout.scss';

interface MainLayoutProps {
  children?: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="main-layout flex flex-col min-h-screen bg-gray-100">
      <Header />
      <main className="flex-grow p-6 container mx-auto">
        {children}
        <Outlet /> {/* Renders child routes */}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
