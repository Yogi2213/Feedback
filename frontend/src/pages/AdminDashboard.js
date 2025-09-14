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
  Eye,
  Award,
  BarChart3
} from 'lucide-react';
import Modal from '../components/Modal';
import CreateUserForm from '../components/CreateUserForm';
import CreateStoreForm from '../components/CreateStoreForm';
import UserDetailsModal from '../components/UserDetailsModal';
import { BarChart, DonutChart, GrowthChart } from '../components/Charts';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-32 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-gradient-to-br from-pink-400/20 to-indigo-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-br from-emerald-400/15 to-cyan-600/15 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative container py-8">
        {/* Enhanced Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500/10 to-orange-500/10 dark:from-red-400/20 dark:to-orange-400/20 rounded-full mb-6 border border-red-200/50 dark:border-red-400/30 backdrop-blur-sm">
            <Award className="w-5 h-5 text-red-600 dark:text-red-400 animate-pulse" />
            <span className="text-sm font-semibold text-red-700 dark:text-red-300">Administrator Portal</span>
          </div>
          
          <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-red-800 to-orange-800 dark:from-white dark:via-red-200 dark:to-orange-200 bg-clip-text text-transparent mb-4">
            Admin Dashboard
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Welcome back, {user?.name}! Manage your platform with powerful tools and insights.
          </p>
        </div>

        {/* Enhanced Tabs */}
        <Card className="mb-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
          <CardContent className="p-6">
            <nav className="flex flex-wrap gap-2">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: TrendingUp, color: 'from-blue-500 to-indigo-600' },
                { id: 'users', label: 'Users', icon: Users, color: 'from-green-500 to-emerald-600' },
                { id: 'stores', label: 'Stores', icon: Store, color: 'from-purple-500 to-pink-600' }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <Button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    variant={activeTab === tab.id ? "default" : "ghost"}
                    className={`flex items-center gap-3 py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 ${
                      activeTab === tab.id
                        ? `bg-gradient-to-r ${tab.color} text-white shadow-lg hover:shadow-xl transform hover:scale-105`
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {tab.label}
                  </Button>
                );
              })}
            </nav>
          </CardContent>
        </Card>

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && dashboardData && (
        <div className="space-y-8 animate-fadeIn">
          {/* Enhanced Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-gradient-to-br from-blue-500/10 to-indigo-600/5 dark:from-blue-400/20 dark:to-indigo-500/10 border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      {dashboardData.statistics.totalUsers}
                    </div>
                    <div className="text-sm font-semibold text-gray-600 dark:text-gray-400">Total Users</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">Active users</span>
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-gradient-to-br from-green-500/10 to-emerald-600/5 dark:from-green-400/20 dark:to-emerald-500/10 border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                    <Store className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                      {dashboardData.statistics.totalStores}
                    </div>
                    <div className="text-sm font-semibold text-gray-600 dark:text-gray-400">Total Stores</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">Registered stores</span>
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-gradient-to-br from-yellow-500/10 to-orange-500/5 dark:from-yellow-400/20 dark:to-orange-500/10 border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-4 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                    <Star className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                      {dashboardData.statistics.totalRatings}
                    </div>
                    <div className="text-sm font-semibold text-gray-600 dark:text-gray-400">Total Ratings</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">Customer feedback</span>
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-gradient-to-br from-purple-500/10 to-pink-500/5 dark:from-purple-400/20 dark:to-pink-500/10 border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                    <TrendingUp className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      {dashboardData.statistics.averageRating.toFixed(1)}
                    </div>
                    <div className="text-sm font-semibold text-gray-600 dark:text-gray-400">Avg Rating</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">Platform quality</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Recent Users and Stores */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Users className="w-6 h-6 text-blue-600" />
                  Recent Users
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-4">
                  {dashboardData.recentUsers.map((user, index) => (
                    <div key={user.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-blue-50/50 dark:from-gray-700/50 dark:to-blue-900/20 rounded-xl hover:shadow-lg transition-all duration-300 group">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm group-hover:scale-110 transition-transform duration-300">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">{user.name}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">{user.email}</p>
                        </div>
                      </div>
                      <Badge className={`text-xs font-semibold ${getRoleColor(user.role)}`}>
                        {user.role.replace('_', ' ')}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Store className="w-6 h-6 text-green-600" />
                  Recent Stores
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-4">
                  {dashboardData.recentStores.map((store, index) => (
                    <div key={store.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-green-50/50 dark:from-gray-700/50 dark:to-green-900/20 rounded-xl hover:shadow-lg transition-all duration-300 group">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-sm group-hover:scale-110 transition-transform duration-300">
                          {store.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">{store.name}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">{store.address}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 mb-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-bold text-gray-900 dark:text-white">{store.avgRating.toFixed(1)}</span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{store.owner.name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Top Rated Stores */}
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Award className="w-6 h-6 text-yellow-600" />
                Top Rated Stores
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-4">
                {dashboardData.topRatedStores.map((store, index) => (
                  <div key={store.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-yellow-50/50 dark:from-gray-700/50 dark:to-yellow-900/20 rounded-xl hover:shadow-lg transition-all duration-300 group">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{store.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{store.address}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 mb-1">
                        <Star className="w-5 h-5 text-yellow-400 fill-current" />
                        <span className="text-lg font-bold text-gray-900 dark:text-white">{store.avgRating.toFixed(1)}</span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{store._count.ratings} ratings</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Analytics Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* User Role Distribution Chart */}
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Users className="w-6 h-6 text-purple-600" />
                  User Role Distribution
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <DonutChart
                  title="User Role Distribution"
                  data={dashboardData.userRoleDistribution.map(role => ({
                    label: role.role.replace('_', ' '),
                    value: role._count.role
                  }))}
                />
              </CardContent>
            </Card>

            {/* Platform Growth Metrics */}
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                  Platform Growth
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <GrowthChart
                  title="Platform Growth"
                  data={[
                    { label: 'Total Users', value: dashboardData.statistics.totalUsers, change: 12 },
                    { label: 'Total Stores', value: dashboardData.statistics.totalStores, change: 8 },
                    { label: 'Total Ratings', value: dashboardData.statistics.totalRatings, change: 15 },
                    { label: 'Avg Rating', value: dashboardData.statistics.averageRating.toFixed(1), change: 3 }
                  ]}
                />
              </CardContent>
            </Card>
          </div>

          {/* Top Stores Performance Chart */}
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-blue-600" />
                Top Stores by Rating Count
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <BarChart
                title="Top Stores by Rating Count"
                data={dashboardData.topRatedStores.slice(0, 5).map(store => ({
                  label: store.name.substring(0, 10) + '...',
                  value: store._count.ratings
                }))}
              />
            </CardContent>
          </Card>
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
    </div>
  );
};

export default AdminDashboard;
