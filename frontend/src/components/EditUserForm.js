import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from './ui/button';
import { User, Mail, MapPin, Shield } from 'lucide-react';

const EditUserForm = ({ user, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();

  useEffect(() => {
    if (user) {
      setValue('name', user.name);
      setValue('email', user.email);
      setValue('address', user.address);
      setValue('role', user.role);
    }
  }, [user, setValue]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await onSuccess(data);
    } catch (error) {
      console.error('Error updating user:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Name Field */}
        <div>
          <label className="form-label flex items-center gap-2">
            <User className="w-4 h-4 text-green-600" />
            Full Name
          </label>
          <input
            type="text"
            className="form-input"
            placeholder="Enter full name"
            {...register('name', { required: 'Name is required' })}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Email Field */}
        <div>
          <label className="form-label flex items-center gap-2">
            <Mail className="w-4 h-4 text-green-600" />
            Email Address
          </label>
          <input
            type="email"
            className="form-input"
            placeholder="Enter email address"
            {...register('email', { 
              required: 'Email is required',
              pattern: {
                value: /^\S+@\S+$/i,
                message: 'Invalid email address'
              }
            })}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Address Field */}
        <div>
          <label className="form-label flex items-center gap-2">
            <MapPin className="w-4 h-4 text-green-600" />
            Address
          </label>
          <textarea
            className="form-input"
            placeholder="Enter address"
            rows="3"
            {...register('address', { required: 'Address is required' })}
          />
          {errors.address && (
            <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
          )}
        </div>

        {/* Role Field */}
        <div>
          <label className="form-label flex items-center gap-2">
            <Shield className="w-4 h-4 text-green-600" />
            Role
          </label>
          <select
            className="form-input"
            {...register('role', { required: 'Role is required' })}
          >
            <option value="">Select Role</option>
            <option value="NORMAL_USER">Normal User</option>
            <option value="STORE_OWNER">Store Owner</option>
            <option value="SYSTEM_ADMIN">System Admin</option>
          </select>
          {errors.role && (
            <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4">
          <Button
            type="submit"
            disabled={loading}
            className="flex-1"
          >
            {loading ? 'Updating...' : 'Update User'}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditUserForm;
