
import React, { useState,useEffect } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';

const AddExpense = ({ selectedExpense, onFormSubmit }) => {
  const [expense, setExpense] = useState({
    category: '',
    amount: '',
    description: '',
    date: '',
    receiptFile: null,
    receiptUrl: ''
  });

  // When selectedExpense changes, populate the form
  useEffect(() => {
    if (selectedExpense) {
      setExpense({
        category: selectedExpense.category || '',
        amount: selectedExpense.amount || '',
        description: selectedExpense.description || '',
        date: selectedExpense.date?.substring(0, 10) || '',
        receiptFile: null,
        receiptUrl: selectedExpense.receiptUrl || '' 
      });
    }
  }, [selectedExpense]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'receiptFile') {
      setExpense(prev => ({ ...prev, receiptFile: files[0] }));
    } else {
      setExpense(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('category', expense.category);
    formData.append('amount', parseFloat(expense.amount));
    formData.append('description', expense.description);
    formData.append('date', expense.date);
    if (expense.receiptFile) {
      formData.append('receipt', expense.receiptFile);
    } else if (expense.receiptUrl) {
      formData.append('receiptUrl', expense.receiptUrl); // Inform backend to reuse old file
    }

    try {
      if (selectedExpense?.id) {
        // Editing
        await api.put(`/expenses/${selectedExpense.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Expense updated successfully!');
      } else {
        // Adding
        await api.post('/expenses/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Expense added successfully!');
      }

      onFormSubmit?.();
      setExpense({
        category: '',
        amount: '',
        description: '',
        date: '',
        receiptFile: null
      });
    } catch (err) {
      console.error(err);
      toast.error('Failed to submit expense.');
    }
  };


  return (
    <div className="card border-0 shadow-sm">
      <div className="card-header bg-primary bg-gradient text-white p-3">
        <h5 className="mb-0">{selectedExpense ? 'Edit Expense' : 'Add New Expense'}</h5>
      </div>
      <div className="card-body p-4">
        <form onSubmit={handleSubmit} className="needs-validation" noValidate>
          <div className="row g-3">
            <div className="col-md-6">
              <label htmlFor="category" className="form-label fw-medium">Category *</label>
              <select 
                className="form-select border-2 border-light-subtle py-2"
                id="category" 
                name="category" 
                value={expense.category} 
                onChange={handleChange} 
                required
              >
                <option value="">Select Category</option>
                <option value="Food">Food</option>
                <option value="Supplies">Supplies</option>
                <option value="Electronics">Electronics</option>
              </select>
              <div className="invalid-feedback">Please select a category</div>
            </div>
            
            <div className="col-md-6">
              <label htmlFor="amount" className="form-label fw-medium">Amount ($) *</label>
              <div className="input-group">
                <span className="input-group-text bg-light">$</span>
                <input 
                  type="number" 
                  className="form-control border-2 border-light-subtle py-2" 
                  id="amount" 
                  placeholder="0.00" 
                  name="amount" 
                  value={expense.amount} 
                  onChange={handleChange} 
                  min="0.01"
                  step="0.01"
                  required 
                />
                <div className="invalid-feedback">Please enter a valid amount</div>
              </div>
            </div>
            
            <div className="col-md-6">
              <label htmlFor="date" className="form-label fw-medium">Date *</label>
              <input 
                type="date" 
                className="form-control border-2 border-light-subtle py-2" 
                id="date" 
                name="date" 
                value={expense.date} 
                onChange={handleChange} 
                required 
              />
              <div className="invalid-feedback">Please select a date</div>
            </div>
            
            <div className="col-md-6">
              <label htmlFor="description" className="form-label fw-medium">Description</label>
              <input 
                type="text" 
                className="form-control border-2 border-light-subtle py-2" 
                id="description" 
                placeholder="Short description" 
                name="description" 
                value={expense.description} 
                onChange={handleChange} 
              />
            </div>

            <div className="col-12">
              <label htmlFor="receiptFile" className="form-label fw-medium">Receipt (Optional)</label>
              <div className="file-upload-wrapper">
                <input 
                  className="form-control border-2 border-light-subtle py-2" 
                  type="file" 
                  id="receiptFile" 
                  name="receiptFile" 
                  onChange={handleChange} 
                  accept="image/*,.pdf"
                />

                {/* Show existing receipt only if editing and a receipt URL exists */}
                {expense.receiptUrl && typeof expense.receiptUrl === 'string' && (
                  <div className="mt-2">
                    <a 
                      href={`${process.env.REACT_APP_API_BASE_URL}${expense.receiptUrl}`}
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      📄 View existing receipt
                    </a>
                  </div>
                )}
              </div>
            </div>

            
            <div className="col-12 mt-2">
              <button className="btn btn-primary w-100 py-2 fw-medium" type="submit">
                {selectedExpense ? 'Update Expense' : 'Add Expense'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddExpense;