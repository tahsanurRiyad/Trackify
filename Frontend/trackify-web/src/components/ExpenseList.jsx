
// import React, { useEffect, useState } from 'react';
// import api from '../services/api';

// const ExpenseList = () => {
//   const [expenses, setExpenses] = useState([]);

//   useEffect(() => {
//     api.get('/expenses').then(res => setExpenses(res.data));
//   }, []);

//   return (
//     <div className="card border-0 shadow-sm">
//       <div className="card-header bg-primary bg-gradient text-white p-3">
//         <h5 className="mb-0">Expense Records</h5>
//       </div>
//       <div className="card-body p-0">
//         <div className="table-responsive rounded">
//           <table className="table table-hover align-middle mb-0">
//             <thead className="table-light">
//               <tr>
//                 <th className="ps-4">Category</th>
//                 <th>Amount</th>
//                 <th>Date</th>
//                 <th>Description</th>
//                 <th className="text-center pe-4">Receipt</th>
//                 <th className="text-center">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {expenses.map(exp => (
//                 <tr key={exp.id} className="border-top">
//                   <td className="ps-4">
//                     <span className="badge bg-primary bg-opacity-10 text-primary p-2">
//                       {exp.category}
//                     </span>
//                   </td>
//                   <td className="fw-medium">${exp.amount.toFixed(2)}</td>
//                   <td>{new Date(exp.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
//                   <td className="text-truncate" style={{maxWidth: '200px'}} title={exp.description}>
//                     {exp.description || '-'}
//                   </td>
//                   <td className="text-center pe-4">
//                     {exp.receiptUrl ? (
//                       <a
//                         href={exp.receiptUrl}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="btn btn-sm btn-outline-primary px-3"
//                       >
//                         View
//                       </a>
//                     ) : (
//                       <span className="text-muted small">No file</span>
//                     )}
//                   </td>
//                   <td className="text-center">
//                         <button className="btn btn-sm btn-outline-primary me-1" title="Edit" >
//                           <i className="bi bi-pencil"></i>
//                         </button>
//                         <button className="btn btn-sm btn-outline-danger" title="Delete" >
//                           <i className="bi bi-trash"></i>
//                         </button>
//                       </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
          
//           {expenses.length === 0 && (
//             <div className="text-center py-5">
//               <div className="py-4">
//                 <i className="bi bi-receipt text-muted" style={{fontSize: '3rem'}}></i>
//                 <p className="text-muted mt-3">No expenses recorded yet</p>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ExpenseList;


import React, { useEffect, useState } from 'react';
import api from '../services/api';

const ExpenseList = ({ refreshTrigger, onEdit }) => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const res = await api.get('/expenses');
        setExpenses(res.data);
        setError('');
      } catch (err) {
        console.error('Error fetching expenses:', err);
        setError('Failed to load expense records. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, [refreshTrigger]);

  const handleEdit = (expense) => {
    onEdit?.(expense);
  };

  const filteredExpenses = expenses.filter(exp =>
    exp.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-header bg-primary bg-gradient text-white d-flex justify-content-between align-items-center border-bottom">
        <h5 className="mb-0 fw-semibold">Expense Records</h5>
        <input
          type="text"
          className="form-control form-control-sm w-auto"
          placeholder="Search category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="card-body p-0">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="ps-4">Category</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Description</th>
                  <th className="text-center">Receipt</th>
                  <th className="text-end pe-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredExpenses.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-5">
                      <i className="bi bi-receipt text-muted" style={{ fontSize: '3rem' }}></i>
                      <p className="mt-3">No matching expense found</p>
                    </td>
                  </tr>
                ) : (
                  filteredExpenses.map(exp => (
                    <tr key={exp.id} className="border-top">
                      <td className="ps-4">
                        <span className="badge bg-primary bg-opacity-10 text-primary p-2">
                          {exp.category}
                        </span>
                      </td>
                      <td className="fw-medium">${exp.amount.toFixed(2)}</td>
                      {/* <td>{new Date(exp.date).toLocaleDateString()}</td> */}
                      <td>
                        {exp.date
                          ? new Date(exp.date).toLocaleDateString('en-GB', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })
                          : '-'}
                      </td>
                      <td className="text-truncate" style={{ maxWidth: '200px' }} title={exp.description}>
                        {exp.description || '-'}
                      </td>
                      <td className="text-center">
                        {exp.receiptUrl && (
                          <a href={`${process.env.REACT_APP_API_BASE_URL}/${exp.receiptUrl}`}
                           target="_blank" rel="noopener noreferrer">
                            View Receipt
                          </a>
                        )}
                      </td>
                      <td className="text-end pe-4">
                        <button className="btn btn-sm btn-outline-secondary me-1" onClick={() => handleEdit(exp)} title="Edit">
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button className="btn btn-sm btn-outline-danger" title="Delete">
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

      {!loading && !error && filteredExpenses.length > 0 && (
        <div className="card-footer bg-white border-top d-flex justify-content-between align-items-center py-2">
          <div className="text-muted small">
            Showing {filteredExpenses.length} of {expenses.length} expenses
          </div>
          <nav>
            <ul className="pagination pagination-sm mb-0">
              <li className="page-item disabled">
                <a className="page-link" href="#" tabIndex="-1" aria-disabled="true">Previous</a>
              </li>
              <li className="page-item active"><a className="page-link" href="#">1</a></li>
              <li className="page-item"><a className="page-link" href="#">2</a></li>
              <li className="page-item"><a className="page-link" href="#">3</a></li>
              <li className="page-item"><a className="page-link" href="#">Next</a></li>
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
};

export default ExpenseList;