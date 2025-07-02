import React, { useState, useEffect } from 'react';

// The top navigation bar component
const Navbar = ({ activeTab, notifications, onLogout }) => {

    const [user, setUser] = useState({});

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
        try {
            const parsed = JSON.parse(storedUser);
            setUser(parsed);
        } catch (e) {
            console.error('Failed to parse user:', e);
        }
        }
    }, []);

  return (
    <nav className="navbar navbar-expand-lg bg-white border-bottom shadow-sm" style={{ height:"7rem"}}>
      <div className="container-fluid p-3">
        <div className="d-flex align-items-center">
          <h4 className="fw-bold mb-0 text-capitalize text-gray-700">{activeTab}</h4>
        </div>
        
        <div className="d-flex align-items-center">
          <div className="position-relative me-4">
            <button className="btn btn-light position-relative rounded-circle">
              <i className="bi bi-bell fs-5"></i>
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {notifications.length}
              </span>
            </button>
          </div>
          
          <div className="dropdown">
            <button className="btn dropdown-toggle d-flex align-items-center" type="button" id="userDropdown" data-bs-toggle="dropdown" aria-expanded="false">
              <div className="bg-light p-2 rounded-circle me-2">
                <i className="bi bi-person-circle fs-4 text-primary"></i>
              </div>
              <div className="text-start">
                <p className="mb-0 fw-medium text-gray-800">{user.userName || 'User'}</p>
                <small className="text-muted">{user.email || ''}</small>
              </div>
            </button>
            <ul className="dropdown-menu dropdown-menu-end shadow border-0 mt-2">
              <li><button className="dropdown-item" type="button"><i className="bi bi-person-circle me-2"></i> Profile</button></li>
              <li><button className="dropdown-item" type="button"><i className="bi bi-gear me-2"></i> Settings</button></li>
              <li><hr className="dropdown-divider" /></li>
              <li><button className="dropdown-item" type="button" onClick={onLogout}><i className="bi bi-box-arrow-right me-2"></i> Logout</button></li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

// The side navigation bar component
export const Sidebar = ({ activeTab, handleNavClick, onLogout }) => {
    return (
        <div className="sidebar shadow-lg" style={{ width: '280px', backgroundColor: 'white' }}>
            <div className="p-4 border-bottom" style={{ height:"7rem"}}>
                <div className="d-flex align-items-center">
                    <div className="bg-primary p-2 rounded me-3">
                        <i className="bi bi-pc-display fs-4 text-white"></i>
                    </div>
                    <h3 className="fw-bold mb-0 text-primary">Trackify</h3>
                </div>
            </div>
            
            <div className="p-3">
                <ul className="nav flex-column">
                    <li className="nav-item mb-2">
                        <button className={`nav-link w-100 text-start d-flex align-items-center p-3 rounded ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => handleNavClick('dashboard')}>
                            <i className="bi bi-speedometer2 me-3 fs-5"></i><span>Dashboard</span>
                        </button>
                    </li>
                    <li className="nav-item mb-2">
                        <button className={`nav-link w-100 text-start d-flex align-items-center p-3 rounded ${activeTab === 'employees' ? 'active' : ''}`} onClick={() => handleNavClick('employees')}>
                            <i className="bi bi-people me-3 fs-5"></i><span>Employees</span>
                        </button>
                    </li>
                    <li className="nav-item mb-2">
                        <button className={`nav-link w-100 text-start d-flex align-items-center p-3 rounded ${activeTab === 'assets' ? 'active' : ''}`} onClick={() => handleNavClick('assets')}>
                            <i className="bi bi-pc-display me-3 fs-5"></i><span>Assets</span>
                        </button>
                    </li>
                    <li className="nav-item mb-2">
                        <button className={`nav-link w-100 text-start d-flex align-items-center p-3 rounded ${activeTab === 'expenses' ? 'active' : ''}`} onClick={() => handleNavClick('expenses')}>
                            <i className="bi bi-receipt me-3 fs-5"></i><span>Expenses</span>
                        </button>
                    </li>
                </ul>
            </div>
            
            <div className="p-3 mt-auto">
                <ul className="nav flex-column">
                    <li className="nav-item mb-2">
                        <button className="nav-link d-flex align-items-center p-3 rounded hover-bg w-100 text-start"><i className="bi bi-gear me-3 fs-5"></i><span>Settings</span></button>
                    </li>
                    <li className="nav-item">
                        <button className="nav-link d-flex align-items-center p-3 rounded hover-bg w-100 text-start" onClick={onLogout}><i className="bi bi-box-arrow-right me-3 fs-5"></i><span>Logout</span></button>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Navbar;
