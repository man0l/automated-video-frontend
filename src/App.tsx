import React from 'react';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainLayout from './components/layouts/MainLayout';
import FileList from './features/FileList/FileList';
import ProjectList from './features/ProjectManagement/ProjectList'; // Import the ProjectList component
import ReactModal from 'react-modal';
import Scenario from './features/Scenario/Scenario';
import Debug from './features/Scenario/Debug';


ReactModal.setAppElement('#root'); // Set the root element for accessibility

import './App.scss';
import Template from './features/Scenario/Template';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<FileList />} />
          <Route path="projects" element={<ProjectList />} /> {/* New route for ProjectList */}
          <Route path="scenarios" element={<Scenario />} />
          <Route path="templates" element={<Template />} />
          <Route path="debug" element={<Debug />} />
        </Route>
      </Routes>
      <Toaster position="top-right" reverseOrder={false} />
    </Router>
  );
};

export default App;
