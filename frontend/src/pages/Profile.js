import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { usersAPI } from '../services/api';
import { User, Mail, MapPin, Lock, Eye, EyeOff, Save } from 'lucide-react';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, login } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: profileErrors }
  } = useForm({
    defaultValues: {
      name: user?.name || '',
      address: user?.address || ''
    }
  });

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors },
    reset: resetPassword
  } = useForm();

  const validatePassword = (value) => {
    if (!value) return 'Password is required';
    if (value.length < 4) {
      return 'Password must be at least 4 characters';
    }
    return true;
  };

  const validateName = (value) => {
    if (!value) return 'Name is required';
    if (value.length < 2 || value.length > 60) {
      return 'Name must be between 2 and 60 characters';
    }
    return true;
  };

  const validateAddress = (value) => {
    if (!value) return 'Address is required';
    if (value.length > 400) {
      return 'Address must not exceed 400 characters';
    }
    return true;
  };

  const onProfileSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await usersAPI.updateUser(user.id, data);
      if (response.data.success) {
        toast.success('Profile updated successfully!');
        // Update user context
        login({
          user: { ...user, ...data },
          token: localStorage.getItem('token')
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const onPasswordSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await usersAPI.updatePassword(user.id, data);
      if (response.data.success) {
        toast.success('Password updated successfully!');
        resetPassword();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update password');
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleDisplayName = (role) => {
    switch (role) {
      case 'SYSTEM_ADMIN':
        return 'System Administrator';
      case 'STORE_OWNER':
        return 'Store Owner';
      case 'NORMAL_USER':
        return 'Normal User';
      default:
        return role;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'SYSTEM_ADMIN':
        return 'text-red-600 bg-red-50';
      case 'STORE_OWNER':
        return 'text-blue-600 bg-blue-50';
      case 'NORMAL_USER':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
        <p className="text-gray-600">Manage your account information and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Info Sidebar */}
        <div className="lg:col-span-1">
          <div className="card">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{user?.name}</h3>
              <p className="text-gray-600">{user?.email}</p>
              <span className={`inline-block mt-2 text-xs px-2 py-1 rounded-full ${getRoleColor(user?.role)}`}>
                {getRoleDisplayName(user?.role)}
              </span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="card mt-4">
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'profile'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Profile Information
              </button>
              <button
                onClick={() => setActiveTab('password')}
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'password'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Change Password
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Profile Information Tab */}
          {activeTab === 'profile' && (
            <div className="card">
              <h2 className="text-xl font-semibold mb-6">Profile Information</h2>
              
              <form onSubmit={handleSubmitProfile(onProfileSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name Field */}
                  <div className="form-group">
                    <label htmlFor="name" className="form-label">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="name"
                        type="text"
                        className={`form-input pl-10 ${profileErrors.name ? 'error' : ''}`}
                        placeholder="Enter your full name"
                        {...registerProfile('name', {
                          validate: validateName
                        })}
                      />
                    </div>
                    {profileErrors.name && (
                      <p className="form-error">{profileErrors.name.message}</p>
                    )}
                  </div>

                  {/* Email Field (Read-only) */}
                  <div className="form-group">
                    <label htmlFor="email" className="form-label">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="email"
                        type="email"
                        className="form-input pl-10 bg-gray-50"
                        value={user?.email}
                        disabled
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Email cannot be changed. Contact support if needed.
                    </p>
                  </div>
                </div>

                {/* Address Field */}
                <div className="form-group">
                  <label htmlFor="address" className="form-label">
                    Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin className="h-5 w-5 text-gray-400" />
                    </div>
                    <textarea
                      id="address"
                      rows={3}
                      className={`form-input pl-10 ${profileErrors.address ? 'error' : ''}`}
                      placeholder="Enter your address"
                      {...registerProfile('address', {
                        validate: validateAddress
                      })}
                    />
                  </div>
                  {profileErrors.address && (
                    <p className="form-error">{profileErrors.address.message}</p>
                  )}
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn btn-primary"
                  >
                    {isLoading ? (
                      <>
                        <div className="loading w-4 h-4"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Change Password Tab */}
          {activeTab === 'password' && (
            <div className="card">
              <h2 className="text-xl font-semibold mb-6">Change Password</h2>
              
              <form onSubmit={handleSubmitPassword(onPasswordSubmit)} className="space-y-6">
                {/* Current Password */}
                <div className="form-group">
                  <label htmlFor="currentPassword" className="form-label">
                    Current Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="currentPassword"
                      type={showCurrentPassword ? 'text' : 'password'}
                      className={`form-input pl-10 pr-10 ${passwordErrors.currentPassword ? 'error' : ''}`}
                      placeholder="Enter your current password"
                      {...registerPassword('currentPassword', {
                        required: 'Current password is required'
                      })}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {passwordErrors.currentPassword && (
                    <p className="form-error">{passwordErrors.currentPassword.message}</p>
                  )}
                </div>

                {/* New Password */}
                <div className="form-group">
                  <label htmlFor="newPassword" className="form-label">
                    New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="newPassword"
                      type={showNewPassword ? 'text' : 'password'}
                      className={`form-input pl-10 pr-10 ${passwordErrors.newPassword ? 'error' : ''}`}
                      placeholder="Enter your new password"
                      {...registerPassword('newPassword', {
                        validate: validatePassword
                      })}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {passwordErrors.newPassword && (
                    <p className="form-error">{passwordErrors.newPassword.message}</p>
                  )}
                  <div className="mt-1 text-xs text-gray-500">
                    Password must be 8-16 characters with at least one uppercase letter and one special character
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn btn-primary"
                  >
                    {isLoading ? (
                      <>
                        <div className="loading w-4 h-4"></div>
                        Updating...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Update Password
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
