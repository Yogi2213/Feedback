import React from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { adminAPI } from '../services/api';

const CreateUserForm = ({ onClose, onSuccess }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await adminAPI.createUser(data);
      if (response.data.success) {
        toast.success('User created successfully!');
        onSuccess();
      } else {
        toast.error(response.data.message || 'Failed to create user');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="form-group">
        <label htmlFor="name" className="form-label">Full Name</label>
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
        <label htmlFor="email" className="form-label">Email Address</label>
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
        <label htmlFor="password" className="form-label">Password</label>
        <input
          id="password"
          type="password"
          className={`form-input ${errors.password ? 'error' : ''}`}
          {...register('password', {
            required: 'Password is required',
            minLength: { value: 8, message: 'Password must be 8-16 characters' },
            maxLength: { value: 16, message: 'Password must be 8-16 characters' },
            pattern: { 
              value: /^(?=.*[A-Z])(?=.*[!@#$%^&*])/, 
              message: 'Password needs an uppercase letter and a special character' 
            },
          })}
        />
        {errors.password && <p className="form-error">{errors.password.message}</p>}
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
        <label htmlFor="role" className="form-label">Role</label>
        <select id="role" className="form-input" {...register('role', { required: 'Role is required' })}>
          <option value="NORMAL_USER">Normal User</option>
          <option value="STORE_OWNER">Store Owner</option>
          <option value="SYSTEM_ADMIN">System Admin</option>
        </select>
        {errors.role && <p className="form-error">{errors.role.message}</p>}
      </div>

      <div className="flex justify-end gap-4">
        <button type="button" onClick={onClose} className="btn btn-secondary">
          Cancel
        </button>
        <button type="submit" disabled={isSubmitting} className="btn btn-primary">
          {isSubmitting ? 'Creating...' : 'Create User'}
        </button>
      </div>
    </form>
  );
};

export default CreateUserForm;
