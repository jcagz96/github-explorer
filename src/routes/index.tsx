import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import Repository from '../pages/Repository';

const RoutesComp: React.FC = () => (
  <Routes>
    <Route path="/" element={<Dashboard />} />
    <Route path="/repository/:owner/:project" element={<Repository />} />
  </Routes>
);

export default RoutesComp;
