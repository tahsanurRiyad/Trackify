import React, { useState, useEffect } from 'react';
import AddEmployee from './AddEmployee';
import EmployeeList from './EmployeeList';
import api from '../services/api';
import { toast } from 'react-toastify';

const EmployeePage = () => {
  const [employees, setEmployees] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [employeeToEdit, setEmployeeToEdit] = useState(null);

   useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await api.get('/employees');
      setEmployees(response.data);
    } catch (error) {
      toast.error('Error fetching employees:', error);
    }
  };

  const handleEmployeeAddedOrUpdated = () => {
    setRefreshTrigger(prev => prev + 1);
    setEmployeeToEdit(null); // reset form after save
  };

  const handleEdit = (employee) => {
  setEmployeeToEdit({ ...employee });
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

return (
  <div className="container-fluid px-4 py-4">
    <div className="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h1 className="h2 fw-bold mb-0">Employee Management</h1>
        <p className="text-muted mb-0">Manage your organization's employees</p>
      </div>
      <div>
        <div className="d-flex align-items-center">
          <div className="me-3">
            <span className="badge bg-primary rounded-pill p-2">
              <i className="bi bi-people-fill"></i>
            </span>
          </div>
          <div>
            <div className="text-muted small">Total Employees</div>
            <div className="fw-bold fs-5">{employees.length}</div>
          </div>
        </div>
      </div>
    </div>
    
    <div className="row">
      <div className="col-lg-5 mb-4">
       <AddEmployee
            onEmployeeSaved={handleEmployeeAddedOrUpdated}
            employeeToEdit={employeeToEdit}
          />
      </div>
      <div className="col-lg-7">
        <EmployeeList
            refreshTrigger={refreshTrigger}
            onEdit={handleEdit}
            onDeleteSuccess={fetchEmployees}
          />
      </div>
    </div>
  </div>
  );
};

export default EmployeePage;