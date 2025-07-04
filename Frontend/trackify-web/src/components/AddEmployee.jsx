import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';
import { showConfirmation, showSuccess, showError,showWarningConfirm, showToast, showLoading, closeAlert } from '../Utility/SweetAlertUtils';

const EmployeeForm = ({ employeeToEdit, onEmployeeSaved, onCancel }) => {
  const [employee, setEmployee] = useState({
    empNo: '',
    name: '',
    address: '',
    email: '',
    phone: '',
    designation: '',
    joiningDate: '',
    isActive: true,
    terminationDate: '',
    profilePicture: null,
    document: null
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profilePreview, setProfilePreview] = useState(null);
  const fileInputRef = useRef(null);
  const docInputRef = useRef(null);
  const isEditing = !!employeeToEdit;

  useEffect(() => {
    if (employeeToEdit) {
      setEmployee({
        ...employeeToEdit,
        joiningDate: employeeToEdit.joiningDate?.substring(0, 10) || '',
        terminationDate: employeeToEdit.terminationDate?.substring(0, 10) || '',
        profilePicture: null,
        document: null
      });
      
      if (employeeToEdit.profilePicture) {
        setProfilePreview(
          `${process.env.REACT_APP_API_BASE_URL}/${employeeToEdit.profilePicture}`
        );
      }
    } else {
      // Reset form
      setEmployee({
        empNo: '',
        name: '',
        address: '',
        email: '',
        phone: '',
        designation: '',
        joiningDate: '',
        isActive: true,
        terminationDate: '',
        profilePicture: null,
        document: null
      });
      setProfilePreview(null);
    }
  }, [employeeToEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEmployee(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when field changes
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type and size
    if (!file.type.match('image.*')) {
      setErrors(prev => ({ ...prev, profilePicture: 'Please select an image file' }));
      return;
    }
    
    if (file.size > 2 * 1024 * 1024) { // 2MB
      setErrors(prev => ({ ...prev, profilePicture: 'File size exceeds 2MB limit' }));
      return;
    }
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setProfilePreview(e.target.result);
    };
    reader.readAsDataURL(file);
    
    setEmployee(prev => ({ ...prev, profilePicture: file }));
    setErrors(prev => ({ ...prev, profilePicture: null }));
  };

  const handleDocumentChange = (e) => {
    setEmployee(prev => ({ ...prev, document: e.target.files[0] }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!employee.empNo.trim()) newErrors.empNo = 'Employee number is required';
    if (!employee.name.trim()) newErrors.name = 'Name is required';
    if (!employee.designation.trim()) newErrors.designation = 'Designation is required';
    if (!employee.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(employee.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!employee.joiningDate) newErrors.joiningDate = 'Joining date is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }
    
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
      
      if (employee.profilePicture) {
        formData.append("profilePicture", employee.profilePicture);
      }
      
      if (employee.document) {
        formData.append("document", employee.document);
      }

      if (isEditing) {
        const result = await showConfirmation({ text: "Do you want to update the employee data?" });
        if (result.isConfirmed){
          showLoading('Saving...');
          await api.put(`/employees/${employee.id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" }
          });
          closeAlert();
          showSuccess('Employee Updated!', 'Employee updated successfully!');
          //toast.success("Employee updated successfully!");
          //showToast('Employee updated successfully!', 'success');
        }
      } else {
        const result = await showConfirmation({ text: "Do you want to add the employee?" });
        if (result.isConfirmed){
          showLoading('Saving...');
          await api.post('/employees', formData, {
            headers: { "Content-Type": "multipart/form-data" }
          });
          closeAlert();
          showSuccess('Employee Added!', 'Employee added successfully!');
          //toast.success("Employee added successfully!");
        }
      }
      
      onEmployeeSaved();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Error saving employee");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveProfilePicture = () => {
    setEmployee(prev => ({ ...prev, profilePicture: null }));
    setProfilePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="row g-3">
        {/* Profile Picture Upload */}
        <div className="col-12 text-center mb-3">
          <div className="position-relative d-inline-block">
            <div className="bg-light rounded-circle d-flex align-items-center justify-content-center" 
                 style={{ width: '120px', height: '120px', overflow: 'hidden' }}>
              {profilePreview ? (
                <img 
                  src={profilePreview} 
                  alt="Profile Preview" 
                  className="img-fluid rounded-circle"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <div className="text-muted">
                  <i className="bi bi-person-circle" style={{ fontSize: '4rem' }}></i>
                </div>
              )}
            </div>
            <label 
              className="btn btn-sm btn-primary rounded-pill position-absolute" 
              style={{ bottom: '0', right: '0' }}
              title="Change photo"
            >
              <i className="bi bi-camera"></i>
              <input 
                type="file" 
                className="d-none" 
                accept="image/*"
                onChange={handleProfilePictureChange}
                ref={fileInputRef}
              />
            </label>
            {profilePreview && (
              <button 
                type="button"
                className="btn btn-sm btn-danger rounded-pill position-absolute" 
                style={{ top: '0', right: '0' }}
                onClick={handleRemoveProfilePicture}
                title="Remove photo"
              >
                <i className="bi bi-x-lg"></i>
              </button>
            )}
          </div>
          {errors.profilePicture && (
            <div className="text-danger small mt-2">{errors.profilePicture}</div>
          )}
        </div>

        <div className="col-md-6">
          <label className="form-label text-muted small mb-1">Emp No <span className="text-danger">*</span></label>
          <input 
            className={`form-control form-control-lg border-0 bg-light ${errors.empNo ? 'is-invalid' : ''}`} 
            name="empNo" 
            value={employee.empNo} 
            onChange={handleChange} 
            placeholder="ES015" 
          />
          {errors.empNo && <div className="invalid-feedback">{errors.empNo}</div>}
        </div>

        <div className="col-md-6">
          <label className="form-label text-muted small mb-1">Full Name <span className="text-danger">*</span></label>
          <input 
            className={`form-control form-control-lg border-0 bg-light ${errors.name ? 'is-invalid' : ''}`} 
            name="name" 
            value={employee.name} 
            onChange={handleChange} 
            placeholder="John Smith" 
          />
          {errors.name && <div className="invalid-feedback">{errors.name}</div>}
        </div>
        
        <div className="col-md-6">
          <label className="form-label text-muted small mb-1">Designation <span className="text-danger">*</span></label>
          <input 
            className={`form-control form-control-lg border-0 bg-light ${errors.designation ? 'is-invalid' : ''}`} 
            name="designation" 
            value={employee.designation} 
            onChange={handleChange} 
            placeholder="Software Engineer" 
          />
          {errors.designation && <div className="invalid-feedback">{errors.designation}</div>}
        </div>
        
        <div className="col-md-6">
          <label className="form-label text-muted small mb-1">Email Address <span className="text-danger">*</span></label>
          <input 
            className={`form-control form-control-lg border-0 bg-light ${errors.email ? 'is-invalid' : ''}`} 
            name="email" 
            type="email"
            value={employee.email} 
            onChange={handleChange} 
            placeholder="john.smith@company.com" 
          />
          {errors.email && <div className="invalid-feedback">{errors.email}</div>}
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
            className={`form-control form-control-lg border-0 bg-light ${errors.joiningDate ? 'is-invalid' : ''}`} 
            name="joiningDate" 
            type="date" 
            value={employee.joiningDate} 
            onChange={handleChange} 
          />
          {errors.joiningDate && <div className="invalid-feedback">{errors.joiningDate}</div>}
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
        
        {/* Document Uploader */}
        <div className="col-12">
          <div className="mb-3">
            <label className="form-label text-muted small mb-1">Upload Document</label>
            <input 
              className="form-control" 
              type="file" 
              onChange={handleDocumentChange}
              ref={docInputRef}
            />
            
            {isEditing && employee.empDoc && !employee.document && (
              <div className="mt-2">
                <a 
                  href={`${process.env.REACT_APP_API_BASE_URL}/${employee.empDoc}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-decoration-none"
                >
                  <i className="bi bi-file-earmark-text me-1"></i> View existing document
                </a>
              </div>
            )}
          </div>
        </div>
        
        {/* ... other fields same as before ... */}
        
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
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </button>

        <button 
          className="btn btn-primary px-4" 
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              {isEditing ? 'Updating...' : 'Adding...'}
            </span>
          ) : (
            <span>
              <i className={`bi ${isEditing ? 'bi-arrow-repeat' : 'bi-person-plus'} me-2`}></i>
              {isEditing ? 'Update Employee' : 'Add Employee'}
            </span>
          )}
        </button>
      </div>
    </form>
  );
};

export default EmployeeForm;