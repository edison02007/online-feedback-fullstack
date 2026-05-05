import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
import Navbar from './components/Navbar.jsx';
import FeedbackForm from './pages/FeedbackForm.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import FeedbackDetail from './pages/FeedbackDetail.jsx';

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<FeedbackForm />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/feedback/:id" element={<FeedbackDetail />} />
          </Routes>
        </Router>
      </ToastProvider>
    </ThemeProvider>
  );
}
