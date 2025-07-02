import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';

const EmployeeList = ({ refreshTrigger, onEdit  }) => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingEmployee, setEditingEmployee] = useState(null);

  

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const res = await api.get('/employees');
      setEmployees(res.data);
      setError('');
    } catch (err) {
      toast.error("Error fetching employees:", err);
      setError('Failed to load employee data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

    useEffect(() => {
    fetchEmployees();
  }, [refreshTrigger]);

  const handleEdit = (employee) => {
    onEdit(employee); // pass to parent
  };

 const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await api.delete(`/employees/${id}`);
        fetchEmployees();
      } catch (err) {
        toast.error("Error deleting employee:", err);
        alert('Failed to delete employee. Please try again.');
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
    // Simple phone formatting
    const cleaned = phone.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    return match ? `(${match[1]}) ${match[2]}-${match[3]}` : phone;
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
          <button className="btn btn-outline-primary">
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
        ) : error ? (
          <div className="text-center py-5">
            <div className="py-4">
              <i className="bi bi-exclamation-circle text-danger" style={{ fontSize: '3rem' }}></i>
              <p className="mt-3 text-danger">{error}</p>
              <button className="btn btn-outline-primary mt-2" onClick={() => window.location.reload()}>
                <i className="bi bi-arrow-repeat me-1"></i> Try Again
              </button>
            </div>
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
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-5">
                      <i className="bi bi-people text-muted" style={{ fontSize: '3rem' }}></i>
                      <p className="mt-3">No employees found matching your search</p>
                    </td>
                  </tr>
                ) : (
                  filteredEmployees.map(emp => (
                    <tr key={emp.id} className="border-top">
                      <td className="ps-4">
                        <div className="d-flex align-items-center">
                          
                          <div>
                            <div className="fw-medium">{emp.name}</div>
                            <small className="text-muted">No: EMP-{emp.empNo}</small>
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
                      {/* <td>
                        {emp.joiningDate ? new Date(emp.joiningDate).toLocaleDateString() : '-'}
                      </td> */}
                      <td>
                        {emp.joiningDate
                          ? new Date(emp.joiningDate).toLocaleDateString('en-GB', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })
                          : '-'}
                      </td>
                      <td>
                        {emp.empDoc && (
                          <a href={`${process.env.REACT_APP_API_BASE_URL}/${emp.empDoc}`}
                           target="_blank" rel="noopener noreferrer">
                            View Document
                          </a>
                        )}
                      </td>
                      <td>
                        {getStatusBadge(emp.isActive)}
                      </td>
                      <td className="text-center">
                        <button className="btn btn-sm btn-outline-primary me-1" title="Edit" onClick={() => handleEdit(emp)}>
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button className="btn btn-sm btn-outline-danger" title="Delete" onClick={() => handleDelete(emp.id)}>
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {!loading && !error && filteredEmployees.length > 0 && (
        <div className="card-footer bg-white border-top d-flex justify-content-between align-items-center py-2">
          <div className="text-muted small">
            Showing {filteredEmployees.length} of {employees.length} employees
          </div>
          <nav>
            <ul className="pagination pagination-sm mb-0">
              <li className="page-item disabled">
                <a className="page-link" href="#" tabIndex="-1" aria-disabled="true">Previous</a>
              </li>
              <li className="page-item active"><a className="page-link" href="#">1</a></li>
              <li className="page-item"><a className="page-link" href="#">2</a></li>
              <li className="page-item"><a className="page-link" href="#">3</a></li>
              <li className="page-item">
                <a className="page-link" href="#">Next</a>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
};

export default EmployeeList;