import React, { useEffect, useState } from 'react';
import api from '../services/api';

const AssetList = ({ refreshTrigger, onEdit  }) => {
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [editingAsset, setEditingAsset] = useState(null);
  
    useEffect(() => {
      const fetchAssets = async () => {
        try {
          const res = await api.get('/assets');
          setAssets(res.data);
          setError('');
        } catch (error) {
          console.error("Error fetching assets:", error);
          setError('Failed to load assets data. Please try again later.');
        } finally {
          setLoading(false);
        }
      };
      
      fetchAssets();
    }, [refreshTrigger]);

      const handleEdit = (asset) => {
    onEdit(asset); // pass to parent
  };
  
    const getStatusBadge = (status) => {
      const statusMap = {
        'In Stock': 'bg-success',
        'In Use': 'bg-primary',
        'Broken': 'bg-danger',
        'In Repair': 'bg-warning text-dark',
        'Retired': 'bg-secondary'
      };
      return <span className={`badge ${statusMap[status] || 'bg-light text-dark'} rounded-pill`}>{status}</span>;
    };

      const filteredAssets = assets.filter(a => 
        a.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
  
    return (
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-primary bg-gradient text-white d-flex justify-content-between align-items-center border-bottom">
          <h5 className="mb-0 fw-semibold">Asset Inventory</h5>
          <div>
            <input 
              type="text" 
              className="form-control form-control-sm" 
              placeholder="Search assets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
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
                    <th className="ps-4">Asset</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Assigned To</th>
                    <th>Purchase Date</th>
                    <th className="text-end pe-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAssets.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-5">
                      <i className="bi bi-people text-muted" style={{ fontSize: '3rem' }}></i>
                      <p className="mt-3">No assets found matching your search</p>
                    </td>
                  </tr>
                ) : (
                  filteredAssets.map(a => (
                    <tr key={a.id} className="border-top">
                      <td className="ps-4">
                        <div className="fw-medium">{a.name}</div>
                        {/* <small className="text-muted">ID: {a.id}</small> */}
                      </td>
                      <td>
                        <span className="badge bg-light text-dark">{a.type}</span>
                      </td>
                      <td>{getStatusBadge(a.status)}</td>
                      <td>{a.assignedEmployee? `${a.assignedEmployee.name} (${a.assignedEmployee.empNo})`: '-'}</td>
                      {/* <td>{a.purchasedDate ? new Date(a.purchasedDate).toLocaleDateString() : '-'}</td> */}
                      <td>
                        {a.purchasedDate
                          ? new Date(a.purchasedDate).toLocaleDateString('en-GB', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })
                          : '-'}
                      </td>

                      <td className="text-end pe-4">
                        <button className="btn btn-sm btn-outline-secondary me-1" onClick={() => handleEdit(a)}>
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button className="btn btn-sm btn-outline-danger">
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  )))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        {!loading && !error && filteredAssets.length > 0 && (
        <div className="card-footer bg-white border-top d-flex justify-content-between align-items-center py-2">
          <div className="text-muted small">
            Showing {filteredAssets.length} of {assets.length} assets
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

export default AssetList;
