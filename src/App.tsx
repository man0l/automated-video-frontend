// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainLayout from './components/layouts/MainLayout';
import FileList from './features/FileList/FileList';
import ReactModal from 'react-modal';

ReactModal.setAppElement('#root'); // Set the root element for accessibility

import './App.scss';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<FileList />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
