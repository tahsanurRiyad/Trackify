import React, { useState, useEffect } from 'react';
import AssetPage from './components/AssetPage';
import ExpensePage from './components/ExpensePage';
import EmployeePage from './components/EmployeePage';
import Dashboard from './components/Dashboard';
import Navbar, { Sidebar } from './components/Navbar';
import LoginPage from './components/LoginPage';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [notifications] = useState([
    { id: 1, message: 'New expense report submitted', time: '2 hours ago' },
    { id: 2, message: 'Asset maintenance scheduled', time: '1 day ago' },
    { id: 3, message: 'New employee onboarding', time: '2 days ago' },
  ]);

  const handleLogin = (userData) => {
    setIsAuthenticated(true);
    localStorage.setItem('isAuthenticated', 'true');
    console.log('Login successful!');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    console.log('You have been logged out');
  };

  const handleNavClick = (tab) => {
    setActiveTab(tab);
  };

    useEffect(() => {
    const storedAuth = localStorage.getItem('isAuthenticated');
    if (storedAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="app-container">
        <LoginPage onLogin={handleLogin} />
        <ToastContainer position="bottom-right" autoClose={3000} />
      </div>
    );
  }

  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>

      <Sidebar activeTab={activeTab} handleNavClick={handleNavClick} onLogout={handleLogout} />

      <div className="d-flex flex-column flex-grow-1 bg-light">
        <Navbar activeTab={activeTab} notifications={notifications} onLogout={handleLogout} />

        <div className="content-container p-4 flex-grow-1">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'employees' && <EmployeePage />}
          {activeTab === 'assets' && <AssetPage />}
          {activeTab === 'expenses' && <ExpensePage />}
        </div>

        <footer className="bg-white text-center py-3 border-top">
          <div className="container">
            <span className="text-muted">
              © {new Date().getFullYear()} Trackify. All rights reserved.
            </span>
          </div>
        </footer>

        <ToastContainer position="bottom-right" autoClose={3000} />
      </div>
    </div>
  );

}

export default App;