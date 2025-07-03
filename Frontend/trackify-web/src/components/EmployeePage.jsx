import React, { useState, useEffect } from 'react';
import EmployeeList from './EmployeeList';
import EmployeeForm from './AddEmployee';
import { Modal, Button } from 'react-bootstrap';
import api from '../services/api';
import { toast } from 'react-toastify';

const EmployeePage = () => {
  const [employees, setEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [employeeToEdit, setEmployeeToEdit] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await api.get('/employees');
      setEmployees(response.data);
    } catch (error) {
      toast.error('Error fetching employees: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (employee = null) => {
    setEmployeeToEdit(employee);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEmployeeToEdit(null);
  };

  const handleEmployeeSaved = () => {
    fetchEmployees();
    handleCloseModal();
  };

  return (
    <div className="container-fluid px-4 py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h2 fw-bold mb-0">Employee Management</h1>
          <p className="text-muted mb-0">Manage your organization's employees</p>
        </div>
        <div className="d-flex">
          <div className="me-3">
            <div className="text-muted small">Total Employees</div>
            <div className="fw-bold fs-5">{employees.length}</div>
          </div>
          <Button 
            variant="primary" 
            onClick={() => handleOpenModal()}
            className="ms-3"
          >
            <i className="bi bi-plus-lg me-2"></i> Add Employee
          </Button>
        </div>
      </div>
      
      <EmployeeList 
        employees={employees} 
        loading={loading} 
        onEdit={handleOpenModal}
        onDeleteSuccess={fetchEmployees}
      />
      
      {/* Employee Form Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>
            {employeeToEdit ? 'Edit Employee' : 'Add New Employee'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <EmployeeForm 
            employeeToEdit={employeeToEdit}
            onEmployeeSaved={handleEmployeeSaved}
            onCancel={handleCloseModal}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default EmployeePage;