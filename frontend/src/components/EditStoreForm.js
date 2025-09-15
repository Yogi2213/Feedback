import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from './ui/button';
import { Store, Mail, MapPin, Phone } from 'lucide-react';

const EditStoreForm = ({ store, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();

  useEffect(() => {
    if (store) {
      setValue('name', store.name);
      setValue('email', store.email);
      setValue('address', store.address);
      setValue('phone', store.phone);
    }
  }, [store, setValue]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await onSuccess(data);
    } catch (error) {
      console.error('Error updating store:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!store) return null;

  return (
    <div className="p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Store Name Field */}
        <div>
          <label className="form-label flex items-center gap-2">
            <Store className="w-4 h-4 text-green-600" />
            Store Name
          </label>
          <input
            type="text"
            className="form-input"
            placeholder="Enter store name"
            {...register('name', { required: 'Store name is required' })}
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

        {/* Phone Field */}
        <div>
          <label className="form-label flex items-center gap-2">
            <Phone className="w-4 h-4 text-green-600" />
            Phone Number
          </label>
          <input
            type="tel"
            className="form-input"
            placeholder="Enter phone number"
            {...register('phone', { required: 'Phone number is required' })}
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
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
            placeholder="Enter store address"
            rows="3"
            {...register('address', { required: 'Address is required' })}
          />
          {errors.address && (
            <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4">
          <Button
            type="submit"
            disabled={loading}
            className="flex-1"
          >
            {loading ? 'Updating...' : 'Update Store'}
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

export default EditStoreForm;
