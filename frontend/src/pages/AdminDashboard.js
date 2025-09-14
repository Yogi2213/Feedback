import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { adminAPI, usersAPI, storesAPI } from '../services/api';
import { 
  Users, 
  Store, 
  Star, 
  TrendingUp, 
  Plus, 
  Search, 
  Edit,
  Trash2,
  Eye
} from 'lucide-react';
import Modal from '../components/Modal';
import CreateUserForm from '../components/CreateUserForm';
import CreateStoreForm from '../components/CreateStoreForm';
import UserDetailsModal from '../components/UserDetailsModal';
import { BarChart, DonutChart, GrowthChart } from '../components/Charts';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dashboardData, setDashboardData] = useState(null);
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createType, setCreateType] = useState('user');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserDetails, setShowUserDetails] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const response = await adminAPI.getDashboard();
      if (response.data.success) {
        setDashboardData(response.data.data);
      }
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = useCallback(async () => {
    try {
      const params = {
        search: searchTerm,
        role: roleFilter || undefined,
        page: 1,
        limit: 50
      };
      const response = await usersAPI.getUsers(params);
      if (response.data.success) {
        setUsers(response.data.data.users);
      }
    } catch (error) {
      toast.error('Failed to load users');
    }
  }, [searchTerm, roleFilter]);

  const loadStores = useCallback(async () => {
    try {
      const params = {
        search: searchTerm,
        page: 1,
        limit: 50
      };
      const response = await storesAPI.getStores(params);
      if (response.data.success) {
        setStores(response.data.data.stores);
      }
    } catch (error) {
      toast.error('Failed to load stores');
    }
  }, [searchTerm]);

  useEffect(() => {
    if (activeTab === 'users') {
      loadUsers();
    } else if (activeTab === 'stores') {
      loadStores();
    }
  }, [activeTab, loadUsers, loadStores, searchTerm, roleFilter]);

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await usersAPI.deleteUser(userId);
        toast.success('User deleted successfully');
        loadUsers();
      } catch (error) {
        toast.error('Failed to delete user');
      }
    }
  };

  const handleDeleteStore = async (storeId) => {
    if (window.confirm('Are you sure you want to delete this store?')) {
      try {
        await storesAPI.deleteStore(storeId);
        toast.success('Store deleted successfully');
        loadStores();
      } catch (error) {
        toast.error('Failed to delete store');
      }
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

  if (loading) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <div className="loading w-8 h-8 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user?.name}</p>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <nav className="flex space-x-8">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
            { id: 'users', label: 'Users', icon: Users },
            { id: 'stores', label: 'Stores', icon: Store }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && dashboardData && (
        <div className="space-y-8 animate-fadeIn">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card group hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg group-hover:shadow-blue-500/25 transition-all duration-300">
                  <Users className="w-7 h-7 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">Total Users</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {dashboardData.statistics.totalUsers}
                  </p>
                </div>
              </div>
            </div>

            <div className="card group hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg group-hover:shadow-green-500/25 transition-all duration-300">
                  <Store className="w-7 h-7 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">Total Stores</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    {dashboardData.statistics.totalStores}
                  </p>
                </div>
              </div>
            </div>

            <div className="card group hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl shadow-lg group-hover:shadow-yellow-500/25 transition-all duration-300">
                  <Star className="w-7 h-7 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">Total Ratings</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                    {dashboardData.statistics.totalRatings}
                  </p>
                </div>
              </div>
            </div>

            <div className="card group hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg group-hover:shadow-purple-500/25 transition-all duration-300">
                  <TrendingUp className="w-7 h-7 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">Avg Rating</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {dashboardData.statistics.averageRating.toFixed(1)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Users and Stores */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Recent Users</h3>
              <div className="space-y-3">
                {dashboardData.recentUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${getRoleColor(user.role)}`}>
                      {user.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Recent Stores</h3>
              <div className="space-y-3">
                {dashboardData.recentStores.map((store) => (
                  <div key={store.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{store.name}</p>
                      <p className="text-sm text-gray-600">{store.address}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{store.avgRating.toFixed(1)} ⭐</p>
                      <p className="text-xs text-gray-600">{store.owner.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Rated Stores */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Top Rated Stores</h3>
            <div className="space-y-3">
              {dashboardData.topRatedStores.map((store) => (
                <div key={store.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{store.name}</p>
                    <p className="text-sm text-gray-600">{store.address}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{store.avgRating.toFixed(1)} ⭐</p>
                    <p className="text-xs text-gray-600">{store._count.ratings} ratings</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Analytics Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* User Role Distribution Chart */}
            <div className="card">
              <DonutChart
                title="User Role Distribution"
                data={dashboardData.userRoleDistribution.map(role => ({
                  label: role.role.replace('_', ' '),
                  value: role._count.role
                }))}
              />
            </div>

            {/* Platform Growth Metrics */}
            <div className="card">
              <GrowthChart
                title="Platform Growth"
                data={[
                  { label: 'Total Users', value: dashboardData.statistics.totalUsers, change: 12 },
                  { label: 'Total Stores', value: dashboardData.statistics.totalStores, change: 8 },
                  { label: 'Total Ratings', value: dashboardData.statistics.totalRatings, change: 15 },
                  { label: 'Avg Rating', value: dashboardData.statistics.averageRating.toFixed(1), change: 3 }
                ]}
              />
            </div>
          </div>

          {/* Top Stores Performance Chart */}
          <div className="card">
            <BarChart
              title="Top Stores by Rating Count"
              data={dashboardData.topRatedStores.slice(0, 5).map(store => ({
                label: store.name.substring(0, 10) + '...',
                value: store._count.ratings
              }))}
            />
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search users..."
                  className="form-input pl-10 w-full sm:w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select
                className="form-input"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="">All Roles</option>
                <option value="SYSTEM_ADMIN">System Admin</option>
                <option value="STORE_OWNER">Store Owner</option>
                <option value="NORMAL_USER">Normal User</option>
              </select>
            </div>
            <button
              onClick={() => {
                setCreateType('user');
                setShowCreateModal(true);
              }}
              className="btn btn-primary"
            >
              <Plus className="w-4 h-4" />
              Add User
            </button>
          </div>

          <div className="card">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Name</th>
                    <th className="text-left py-3 px-4">Email</th>
                    <th className="text-left py-3 px-4">Role</th>
                    <th className="text-left py-3 px-4">Address</th>
                    <th className="text-left py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{user.name}</td>
                      <td className="py-3 px-4 text-gray-600">{user.email}</td>
                      <td className="py-3 px-4">
                        <span className={`text-xs px-2 py-1 rounded-full ${getRoleColor(user.role)}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{user.address}</td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <button 
                            onClick={() => { setSelectedUser(user); setShowUserDetails(true); }} 
                            className="text-gray-600 hover:text-gray-800"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="text-blue-600 hover:text-blue-800">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Stores Tab */}
      {/* Create User/Store Modal */}
      <Modal 
        show={showCreateModal} 
        onClose={() => setShowCreateModal(false)} 
        title={createType === 'user' ? 'Create New User' : 'Create New Store'}
      >
        {createType === 'user' ? (
          <CreateUserForm 
            onClose={() => setShowCreateModal(false)} 
            onSuccess={() => {
              setShowCreateModal(false);
              loadUsers();
            }}
          />
        ) : (
          <CreateStoreForm 
            onClose={() => setShowCreateModal(false)} 
            onSuccess={() => {
              setShowCreateModal(false);
              loadStores();
            }}
          />
        )}
      </Modal>

      {/* User Details Modal */}
      <Modal 
        show={showUserDetails} 
        onClose={() => setShowUserDetails(false)} 
        title="User Details"
      >
        <UserDetailsModal user={selectedUser} onClose={() => setShowUserDetails(false)} />
      </Modal>

      {activeTab === 'stores' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search stores..."
                className="form-input pl-10 w-full sm:w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              onClick={() => {
                setCreateType('store');
                setShowCreateModal(true);
              }}
              className="btn btn-primary"
            >
              <Plus className="w-4 h-4" />
              Add Store
            </button>
          </div>

          <div className="card">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Name</th>
                    <th className="text-left py-3 px-4">Email</th>
                    <th className="text-left py-3 px-4">Address</th>
                    <th className="text-left py-3 px-4">Rating</th>
                    <th className="text-left py-3 px-4">Owner</th>
                    <th className="text-left py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {stores.map((store) => (
                    <tr key={store.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{store.name}</td>
                      <td className="py-3 px-4 text-gray-600">{store.email}</td>
                      <td className="py-3 px-4 text-gray-600">{store.address}</td>
                      <td className="py-3 px-4">
                        <span className="text-yellow-600 font-medium">
                          {store.avgRating.toFixed(1)} ⭐
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{store.owner.name}</td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <button className="text-blue-600 hover:text-blue-800">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteStore(store.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
