import React, { useState, useEffect } from 'react';
import { storesAPI } from '../services/api';
import toast from 'react-hot-toast';

const UserDetailsModal = ({ user, onClose }) => {
  const [ownedStores, setOwnedStores] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.role === 'STORE_OWNER') {
      setLoading(true);
      storesAPI.getStoresByOwner(user.id)
        .then(response => {
          if (response.data.success) {
            setOwnedStores(response.data.data.stores);
          }
        })
        .catch(() => toast.error('Failed to fetch owned stores'))
        .finally(() => setLoading(false));
    }
  }, [user]);

  if (!user) return null;

  return (
    <div>
      <div className="space-y-4">
        <div>
          <h4 className="font-semibold">{user.name}</h4>
          <p className="text-sm text-gray-600">{user.email}</p>
        </div>
        <div className="text-sm">
          <p><strong>Role:</strong> {user.role}</p>
          <p><strong>Address:</strong> {user.address}</p>
        </div>

        {user.role === 'STORE_OWNER' && (
          <div>
            <h5 className="font-semibold border-t pt-4 mt-4">Owned Stores</h5>
            {loading ? (
              <p>Loading stores...</p>
            ) : (
              <ul className="list-disc list-inside mt-2 space-y-1">
                {ownedStores.length > 0 ? (
                  ownedStores.map(store => (
                    <li key={store.id} className="text-sm">{store.name}</li>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No stores found for this owner.</p>
                )}
              </ul>
            )}
          </div>
        )}
      </div>
      <div className="flex justify-end mt-6">
        <button onClick={onClose} className="btn btn-secondary">
          Close
        </button>
      </div>
    </div>
  );
};

export default UserDetailsModal;
