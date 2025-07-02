import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';

const AddAsset = ({ onAssetSaved, assetToEdit }) => {
    const [asset, setAsset] = useState({
      name: '',
      type: '',
      status: 'In Stock',
      assignedToEmployeeId: '',
      purchasedDate: ''
    });

    const [employees, setEmployees] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
      const fetchEmployees = async () => {
        try {
          const res = await api.get('/employees');
          setEmployees(res.data);
        } catch (err) {
          console.error('Failed to load employees', err);
        }
      };

    fetchEmployees();
    }, []);
  
  useEffect(() => {
    if (assetToEdit) {
      setAsset({
        ...assetToEdit,
        assignedToEmployeeId: assetToEdit.assignedToEmployeeId || '',
        purchasedDate: assetToEdit.purchasedDate
          ? assetToEdit.purchasedDate.substring(0, 10)
          : ''
      });
      setIsEditing(true);
    } else {
      setAsset({
        name: '',
        type: '',
        status: 'In Stock',
        assignedToEmployeeId: '',
        purchasedDate: ''
      });
      setIsEditing(false);
    }
  }, [assetToEdit]);

    const handleChange = (e) => {
      const { name, value } = e.target;
      setAsset(prev => ({ ...prev, [name]: value }));

      if (successMessage || errorMessage) {
        setSuccessMessage('');
        setErrorMessage('');
      }
    };

    // const handleSubmit = async (e) => {
    //   e.preventDefault();

    //   const assetPayload = {
    //     name: asset.name,
    //     type: asset.type,
    //     status: asset.status,
    //     assignedToEmployeeId: asset.assignedToEmployeeId || null,
    //     purchasedDate: asset.purchasedDate
    //   };

    //   try {
    //     let res;
    //     if (isEditing) {
    //       if (window.confirm("Are you sure you want to update this asset info?")) {
    //         res = await api.put(`/assets/${asset.id}`, assetPayload);
    //         toast.success("Asset info updated successfully!");
    //       }
    //     } else {
    //       if (window.confirm("Are you sure you want to add this asset info?")) {
    //         res = await api.post('/assets', assetPayload);
    //         toast.success("Asset info added successfully!");
    //       }
    //     }

    //     setAsset({
    //       name: '',
    //       type: '',
    //       status: 'In Stock',
    //       assignedToEmployeeId: '',
    //       purchasedDate: ''
    //     });
    //     onAssetSaved();
    //     setIsEditing(false);
    //   } catch (error) {
    //     console.error(error);
    //     toast.error("Error saving asset info");
    //   }
    // };


    const handleSubmit = async (e) => {
      e.preventDefault();

      const assetPayload = {
        id: asset.id, // Make sure this is included during update
        name: asset.name,
        type: asset.type,
        status: asset.status,
        assignedToEmployeeId: asset.assignedToEmployeeId || null,
        purchasedDate: asset.purchasedDate
      };

      try {
        let res;
        if (isEditing) {
          if (window.confirm("Are you sure you want to update this asset info?")) {
            res = await api.put(`/assets/${asset.id}`, assetPayload); // Route ID
            toast.success("Asset info updated successfully!");
          }
        } else {
          if (window.confirm("Are you sure you want to add this asset info?")) {
            res = await api.post('/assets', assetPayload);
            toast.success("Asset info added successfully!");
          }
        }

        setAsset({
          name: '',
          type: '',
          status: 'In Stock',
          assignedToEmployeeId: '',
          purchasedDate: ''
        });
        onAssetSaved();
        setIsEditing(false);
      } catch (error) {
        console.error(error);
        toast.error("Error saving asset info");
      }
    };


  
    return (
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-primary bg-gradient text-white p-2 border-bottom">
          <h5 className="mb-0 fw-semibold">Add New Asset</h5>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label text-muted small mb-1">Asset Name</label>
                <input 
                  className="form-control form-control-lg border-0 bg-light" 
                  name="name" 
                  value={asset.name} 
                  onChange={handleChange} 
                  placeholder="e.g. MacBook Pro M1" 
                  required
                />
              </div>
              
              <div className="col-md-6">
                <label className="form-label text-muted small mb-1">Type</label>
                <select 
                  className="form-select form-select-lg border-0 bg-light" 
                  name="type" 
                  value={asset.type} 
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Type</option>
                  <option value="Laptop">Laptop</option>
                  <option value="Desktop">Desktop</option>
                  <option value="Printer">Printer</option>
                  <option value="Monitor">Monitor</option>
                  <option value="Phone">Phone</option>
                </select>
              </div>
              
              <div className="col-md-4">
                <label className="form-label text-muted small mb-1">Status</label>
                <select 
                  className="form-select form-select-lg border-0 bg-light" 
                  name="status" 
                  value={asset.status} 
                  onChange={handleChange}
                >
                  <option value="In Stock">In Stock</option>
                  <option value="In Use">In Use</option>
                  <option value="Broken">Broken</option>
                  <option value="In Repair">In Repair</option>
                  <option value="Retired">Retired</option>
                </select>
              </div>

              <div className="col-md-4">
                <label className="form-label text-muted small mb-1">Assigned Employee</label>
                <select
                  className="form-select form-select-lg border-0 bg-light"
                  name="assignedToEmployeeId"
                  value={asset.assignedToEmployeeId}
                  onChange={handleChange}
                >
                  <option value="">-- Unassigned --</option>
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name} ({emp.empNo})
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="col-md-4">
                <label className="form-label text-muted small mb-1">Purchase Date</label>
                <input 
                  className="form-control form-control-lg border-0 bg-light" 
                  name="purchasedDate" 
                  type="date" 
                  value={asset.purchasedDate} 
                  onChange={handleChange} 
                  required
                />
              </div>
            </div>
            
            <div className="d-flex justify-content-end mt-4">
              <button 
              type="button" 
              className="btn btn-outline-secondary me-2 px-4"
              onClick={() => {
                setAsset({
                  name: '',
                  type: '',
                  status: 'In Stock',
                  assignedToEmployeeId: '',
                  purchasedDate: ''
                });
              }}
            >
              Reset
            </button>
              <button className="btn btn-primary px-4 py-2 fw-medium" type="submit">
                {isEditing ? 'Update Asset' : 'Add Asset'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

export default AddAsset;
