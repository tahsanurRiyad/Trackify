import React, { useEffect, useState, useRef } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';

const AddEmployee = ({ onEmployeeSaved, employeeToEdit }) => {
  const [employee, setEmployee] = useState({
    empNo: '',
    name: '',
    address: '',
    email: '',
    phone: '',
    designation: '',
    joiningDate: '',
    isActive: true,
    terminationDate: ''
  });

  
  const [document, setDocument] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef(null);

useEffect(() => {
  if (employeeToEdit) {
    setEmployee({
      ...employeeToEdit,
      joiningDate: employeeToEdit.joiningDate?.substring(0, 10) || '',
      terminationDate: employeeToEdit.terminationDate?.substring(0, 10) || ''
    });
    if (employeeToEdit.empDoc) {
      setDocument({ name: employeeToEdit.empDoc }); // Store filename only
    } else {
      setDocument(null);
    }
    setIsEditing(true);
  } else {
    setEmployee({
      empNo: '',
      name: '',
      address: '',
      email: '',
      phone: '',
      designation: '',
      joiningDate: '',
      isActive: true,
      terminationDate: ''
    });
    setIsEditing(false);
  }
}, [employeeToEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEmployee(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (successMessage || errorMessage) {
      setSuccessMessage('');
      setErrorMessage('');
    }
  };

  const handleFileChange = (e) => {
    setDocument(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const formData = new FormData();
    formData.append("empNo", employee.empNo);
    formData.append("name", employee.name);
    formData.append("address", employee.address);
    formData.append("email", employee.email);
    formData.append("phone", employee.phone);
    formData.append("designation", employee.designation);
    formData.append("joiningDate", employee.joiningDate);
    formData.append("isActive", employee.isActive);
    formData.append("terminationDate", employee.terminationDate || "");

    if (document) {
      formData.append("document", document);
    }

    let res;
    if (isEditing) {
      if (window.confirm("Are you sure you want to update this employee?")) {
        res = await api.put(`/employees/${employee.id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        toast.success("Employee updated successfully!");
      }
    } else {
      if (window.confirm("Are you sure you want to add this employee?")) {
        res = await api.post('/employees', formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        toast.success("Employee added successfully!");
      }
    }

    setEmployee({
      empNo: '',
      name: '',
      address: '',
      email: '',
      phone: '',
      designation: '',
      joiningDate: '',
      isActive: true,
      terminationDate: ''
    });
    setDocument(null);
    setErrorMessage('');
    onEmployeeSaved();
    setIsEditing(false);
  } catch (error) {
    console.error(error);
    toast.error("Error saving employee");
  }
};


  return (
    <div className="card border-0 shadow-sm mb-4">
      <div className="card-header bg-primary bg-gradient text-white p-3 border-bottom">
        <h5 className="mb-3">{isEditing ? 'Edit Employee' : 'Add Employee'}</h5>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label text-muted small mb-1">Emp No <span className="text-danger">*</span></label>
              <input 
                className="form-control form-control-lg border-0 bg-light" 
                name="empNo" 
                value={employee.empNo} 
                onChange={handleChange} 
                placeholder="ES015" 
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label text-muted small mb-1">Full Name <span className="text-danger">*</span></label>
              <input 
                className="form-control form-control-lg border-0 bg-light" 
                name="name" 
                value={employee.name} 
                onChange={handleChange} 
                placeholder="John Smith" 
                required
              />
            </div>
            
            <div className="col-md-6">
              <label className="form-label text-muted small mb-1">Designation <span className="text-danger">*</span></label>
              <input 
                className="form-control form-control-lg border-0 bg-light" 
                name="designation" 
                value={employee.designation} 
                onChange={handleChange} 
                placeholder="Software Engineer" 
                required
              />
            </div>
            
            <div className="col-md-6">
              <label className="form-label text-muted small mb-1">Email Address <span className="text-danger">*</span></label>
              <input 
                className="form-control form-control-lg border-0 bg-light" 
                name="email" 
                type="email"
                value={employee.email} 
                onChange={handleChange} 
                placeholder="john.smith@company.com" 
                required
              />
            </div>
            
            <div className="col-md-6">
              <label className="form-label text-muted small mb-1">Phone Number</label>
              <input 
                className="form-control form-control-lg border-0 bg-light" 
                name="phone" 
                value={employee.phone} 
                onChange={handleChange} 
                placeholder="(123) 456-7890" 
              />
            </div>
            
            <div className="col-12">
              <label className="form-label text-muted small mb-1">Address</label>
              <input 
                className="form-control form-control-lg border-0 bg-light" 
                name="address" 
                value={employee.address} 
                onChange={handleChange} 
                placeholder="123 Main St, City, Country" 
              />
            </div>
            
            <div className="col-md-6">
              <label className="form-label text-muted small mb-1">Joining Date <span className="text-danger">*</span></label>
              <input 
                className="form-control form-control-lg border-0 bg-light" 
                name="joiningDate" 
                type="date" 
                value={employee.joiningDate} 
                onChange={handleChange} 
                required
              />
            </div>
            
            <div className="col-md-6">
              <label className="form-label text-muted small mb-1">Termination Date</label>
              <input 
                className="form-control form-control-lg border-0 bg-light" 
                name="terminationDate" 
                type="date" 
                value={employee.terminationDate} 
                onChange={handleChange} 
                disabled={employee.isActive}
              />
            </div>

            <div className="mb-3">
              <label>Upload Document</label>
              <input className="form-control" type="file" onChange={handleFileChange} ref={fileInputRef} />
              
              {isEditing && employee.empDoc && (
                <div className="mt-2">
                  <a 
                    href={`${process.env.REACT_APP_API_BASE_URL}/${employee.empDoc}`}
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    📄 View existing document
                  </a>
                </div>
              )}
            </div>
            
            <div className="col-md-6">
              <div className="form-check form-switch mt-3">
                <input 
                  className="form-check-input" 
                  type="checkbox" 
                  name="isActive" 
                  checked={employee.isActive} 
                  onChange={handleChange} 
                  id="activeSwitch"
                />
                <label className="form-check-label text-muted" htmlFor="activeSwitch">
                  Active Employee
                </label>
              </div>
            </div>
          </div>
          
          <div className="d-flex justify-content-end mt-4 border-top pt-3">
            <button 
  type="button" 
  className="btn btn-outline-secondary me-2 px-4"
  onClick={() => {
    setEmployee({
      empNo: '',
      name: '',
      address: '',
      email: '',
      phone: '',
      designation: '',
      joiningDate: '',
      isActive: true,
      terminationDate: ''
    });
    setIsEditing(false);
    setDocument(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setErrorMessage('');
    setSuccessMessage('');
    onEmployeeSaved(); // This clears the employeeToEdit in the parent
  }}
>
  Reset
</button>

            <button className="btn btn-primary px-4" type="submit">
              <i className="bi bi-person-plus me-2"></i> {isEditing ? 'Update Employee' : 'Add Employee'}
            </button>
          </div>
        </form>
        {successMessage && <div className="alert alert-success mt-3">{successMessage}</div>}
        {errorMessage && <div className="alert alert-danger mt-3">{errorMessage}</div>}
      </div>
    </div>
  );
};

export default AddEmployee;