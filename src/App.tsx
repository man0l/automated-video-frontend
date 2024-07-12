import React from 'react';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainLayout from './components/layouts/MainLayout';
import FileList from './features/FileList/FileList';
import ProjectList from './features/ProjectManagement/ProjectList'; // Import the ProjectList component
import ReactModal from 'react-modal';

ReactModal.setAppElement('#root'); // Set the root element for accessibility

import './App.scss';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<FileList />} />
          <Route path="projects" element={<ProjectList />} /> {/* New route for ProjectList */}
        </Route>
      </Routes>
      <Toaster position="top-right" reverseOrder={false} />
    </Router>
  );
};

export default App;
