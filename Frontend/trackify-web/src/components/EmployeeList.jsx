import React, { useState } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';

const EmployeeList = ({ employees, loading, onEdit, onDeleteSuccess }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await api.delete(`/employees/${id}`);
        onDeleteSuccess();
        toast.success("Employee deleted successfully!");
      } catch (err) {
        toast.error("Error deleting employee: " + err.message);
      }
    }
  };

  const getStatusBadge = (isActive) => {
    return isActive ? (
      <span className="badge bg-success rounded-pill py-1 px-3">Active</span>
    ) : (
      <span className="badge bg-danger rounded-pill py-1 px-3">Inactive</span>
    );
  };

  const formatPhone = (phone) => {
    if (!phone) return '-';
    const cleaned = phone.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    return match ? `(${match[1]}) ${match[2]}-${match[3]}` : phone;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const filteredEmployees = employees.filter(emp => 
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.designation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-header bg-primary bg-gradient text-white border-bottom d-flex justify-content-between align-items-center">
        <h5 className="mb-0 fw-semibold">Employee Directory</h5>
        <div className="d-flex">
          <div className="input-group me-2" style={{ width: '300px' }}>
            <span className="input-group-text bg-white border-end-0">
              <i className="bi bi-search text-muted"></i>
            </span>
            <input
              type="text"
              className="form-control border-start-0"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="btn btn-outline-light">
            <i className="bi bi-download me-1"></i> Export
          </button>
        </div>
      </div>
      
      <div className="card-body p-0">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="mt-2 text-muted">Loading employee data...</p>
          </div>
        ) : filteredEmployees.length === 0 ? (
          <div className="text-center py-5">
            <i className="bi bi-people text-muted" style={{ fontSize: '3rem' }}></i>
            <p className="mt-3">No employees found</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="ps-4">Employee</th>
                  <th>Contact</th>
                  <th>Designation</th>
                  <th>Joining Date</th>
                  <th>Status</th>
                  <th>Document</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map(emp => (
                  <tr key={emp.id} className="border-top">
                    <td className="ps-4">
                      <div className="d-flex align-items-center">
                        <div className="me-3">
                          {emp.profilePicture ? (
                            <img 
                              src={`${process.env.REACT_APP_API_BASE_URL}/${emp.profilePicture}`} 
                              alt={emp.name}
                              className="rounded-circle"
                              style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                            />
                          ) : (
                            <div className="bg-light rounded-circle d-flex align-items-center justify-content-center" 
                                 style={{ width: '40px', height: '40px' }}>
                              <i className="bi bi-person text-muted"></i>
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="fw-medium">{emp.name}</div>
                          <small className="text-muted">ID: EMP-{emp.empNo}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div>{emp.email}</div>
                      <small className="text-muted">{formatPhone(emp.phone)}</small>
                    </td>
                    <td>
                      <span className="badge bg-light text-dark border">{emp.designation}</span>
                    </td>
                    <td>
                      {formatDate(emp.joiningDate)}
                    </td>
                    <td>
                      {getStatusBadge(emp.isActive)}
                    </td>
                    <td>
                      {emp.empDoc ? (
                        <a 
                          href={`${process.env.REACT_APP_API_BASE_URL}/${emp.empDoc}`}
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-decoration-none"
                        >
                          <i className="bi bi-file-earmark-text me-1"></i> View
                        </a>
                      ) : (
                        <span className="text-muted">None</span>
                      )}
                    </td>
                    <td className="text-center">
                      <button 
                        className="btn btn-sm btn-outline-primary me-1" 
                        title="Edit" 
                        onClick={() => onEdit(emp)}
                      >
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button 
                        className="btn btn-sm btn-outline-danger" 
                        title="Delete" 
                        onClick={() => handleDelete(emp.id)}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {!loading && filteredEmployees.length > 0 && (
        <div className="card-footer bg-white border-top d-flex justify-content-between align-items-center py-2">
          <div className="text-muted small">
            Showing {filteredEmployees.length} of {employees.length} employees
          </div>
          <div className="d-flex">
            <button className="btn btn-sm btn-outline-secondary me-2" disabled>
              <i className="bi bi-chevron-left"></i>
            </button>
            <button className="btn btn-sm btn-outline-secondary">
              <i className="bi bi-chevron-right"></i>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeList;