import React, { useState, useEffect } from 'react';
import AddAsset from './AddAsset';
import AssetList from './AssetList';
import api from '../services/api';
import { toast } from 'react-toastify';

const AssetPage = () => {
  const [assets, setAssets] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [assetToEdit, setAssetToEdit] = useState(null);

   useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    try {
      const response = await api.get('/assets');
      setAssets(response.data);
    } catch (error) {
      toast.error('Error fetching assets:', error);
    }
  };

  const handleAssetsAddedOrUpdated = () => {
    setRefreshTrigger(prev => prev + 1);
    setAssetToEdit(null); // reset form after save
  };

  const handleEdit = (asset) => {
  setAssetToEdit({ ...asset });
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

  return(
    <div className="container-fluid px-4 py-3">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 fw-bold mb-0">Asset Management</h1>
          <p className="text-muted mb-0">Track and manage company assets</p>
        </div>
        <div>
          <button className="btn btn-sm btn-outline-secondary">
            <i className="bi bi-download me-1"></i> Export
          </button>
        </div>
      </div>
      
      <div className="row">
        <div className="col-lg-5 mb-4">
          <AddAsset onAssetSaved={handleAssetsAddedOrUpdated}
            assetToEdit={assetToEdit}/>
        </div>
        <div className="col-lg-7">
          <AssetList refreshTrigger={refreshTrigger}
            onEdit={handleEdit}
            onDeleteSuccess={fetchAssets}/>
        </div>
      </div>
    </div>
  );
};
export default AssetPage;
