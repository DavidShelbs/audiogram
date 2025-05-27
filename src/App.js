// App.js
import React from 'react';
import { AudioRecorder, EventDashboard } from './pages'
import { BrowserRouter as Router, Routes, Route } from 'react-router';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import './App.css';

function App() {
  return (
      <Routes>
          <Route path="/" element={<AudioRecorder />} />
          <Route path="/dashboard" element={<EventDashboard />} />
      </Routes>
  );
}
export default App