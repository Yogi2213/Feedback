import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { adminAPI, usersAPI } from '../services/api';

const CreateStoreForm = ({ onClose, onSuccess }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  const [storeOwners, setStoreOwners] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStoreOwners = async () => {
    try {
      setLoading(true);
      const response = await usersAPI.getUsers({ role: 'STORE_OWNER', limit: 100 });
      if (response.data.success) {
        setStoreOwners(response.data.data.users);
      }
    } catch (error) {
      toast.error('Failed to fetch store owners');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStoreOwners();
  }, []);

  const onSubmit = async (data) => {
    try {
      const response = await adminAPI.createStore(data);
      if (response.data.success) {
        toast.success('Store created successfully!');
        onSuccess();
      } else {
        toast.error(response.data.message || 'Failed to create store');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="form-group">
        <label htmlFor="name" className="form-label">Store Name</label>
        <input
          id="name"
          type="text"
          className={`form-input ${errors.name ? 'error' : ''}`}
          {...register('name', {
            required: 'Name is required',
            minLength: { value: 20, message: 'Name must be at least 20 characters' },
            maxLength: { value: 60, message: 'Name must not exceed 60 characters' },
          })}
        />
        {errors.name && <p className="form-error">{errors.name.message}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="email" className="form-label">Store Email</label>
        <input
          id="email"
          type="email"
          className={`form-input ${errors.email ? 'error' : ''}`}
          {...register('email', {
            required: 'Email is required',
            pattern: { value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/, message: 'Invalid email address' },
          })}
        />
        {errors.email && <p className="form-error">{errors.email.message}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="address" className="form-label">Address</label>
        <textarea
          id="address"
          rows="3"
          className={`form-input ${errors.address ? 'error' : ''}`}
          {...register('address', {
            required: 'Address is required',
            maxLength: { value: 400, message: 'Address must not exceed 400 characters' },
          })}
        />
        {errors.address && <p className="form-error">{errors.address.message}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="ownerId" className="form-label">Store Owner</label>
        <div className="flex gap-2">
          <select id="ownerId" className="form-input flex-1" {...register('ownerId', { required: 'Owner is required' })}>
            <option value="">Select an owner</option>
            {storeOwners.map(owner => (
              <option key={owner.id} value={owner.id}>{owner.name} ({owner.email})</option>
            ))}
          </select>
          <button
            type="button"
            onClick={fetchStoreOwners}
            disabled={loading}
            className="btn btn-secondary btn-sm"
            title="Refresh store owners list"
          >
            {loading ? '⟳' : '↻'}
          </button>
        </div>
        {storeOwners.length === 0 && !loading && (
          <p className="text-sm text-amber-600 mt-1">
            ⚠️ No Store Owners found. Please create a user with "Store Owner" role first, then click refresh.
          </p>
        )}
        {loading && (
          <p className="text-sm text-gray-500 mt-1">Loading store owners...</p>
        )}
        {errors.ownerId && <p className="form-error">{errors.ownerId.message}</p>}
      </div>

      <div className="flex justify-end gap-4">
        <button type="button" onClick={onClose} className="btn btn-secondary">
          Cancel
        </button>
        <button type="submit" disabled={isSubmitting} className="btn btn-primary">
          {isSubmitting ? 'Creating...' : 'Create Store'}
        </button>
      </div>
    </form>
  );
};

export default CreateStoreForm;
