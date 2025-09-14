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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-white dark:from-green-900 dark:via-emerald-900 dark:to-gray-900 relative overflow-hidden">
      {/* Enhanced Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-32 w-96 h-96 bg-gradient-to-br from-green-400/30 to-emerald-600/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-gradient-to-br from-emerald-400/25 to-teal-600/25 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-br from-white/40 to-green-200/30 rounded-full blur-3xl animate-pulse delay-500"></div>
        <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-green-300/20 to-white/30 rounded-full blur-3xl animate-pulse delay-1500"></div>
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-emerald-300/25 to-green-300/25 rounded-full blur-2xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative container py-8 z-10">
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

        {/* Enhanced Beautiful Tabs */}
        <Card className="mb-8 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border-0 shadow-2xl">
          <CardContent className="p-8">
            <nav className="flex flex-wrap gap-4 justify-center">
              {[
                { 
                  id: 'dashboard', 
                  label: 'Dashboard', 
                  icon: TrendingUp, 
                  color: 'from-cyan-500 via-blue-500 to-indigo-600',
                  bgColor: 'from-cyan-50 via-blue-50 to-indigo-50 dark:from-cyan-900/20 dark:via-blue-900/20 dark:to-indigo-900/20',
                  iconBg: 'from-cyan-400 via-blue-500 to-indigo-600',
                  iconColor: 'text-cyan-500',
                  description: 'Overview & Analytics',
                  accent: 'bg-gradient-to-r from-cyan-400 to-blue-500'
                },
                { 
                  id: 'users', 
                  label: 'Users', 
                  icon: Users, 
                  color: 'from-emerald-500 via-green-500 to-teal-600',
                  bgColor: 'from-emerald-50 via-green-50 to-teal-50 dark:from-emerald-900/20 dark:via-green-900/20 dark:to-teal-900/20',
                  iconBg: 'from-emerald-400 via-green-500 to-teal-600',
                  iconColor: 'text-emerald-500',
                  description: 'User Management',
                  accent: 'bg-gradient-to-r from-emerald-400 to-green-500'
                },
                { 
                  id: 'stores', 
                  label: 'Stores', 
                  icon: Store, 
                  color: 'from-violet-500 via-purple-500 to-pink-600',
                  bgColor: 'from-violet-50 via-purple-50 to-pink-50 dark:from-violet-900/20 dark:via-purple-900/20 dark:to-pink-900/20',
                  iconBg: 'from-violet-400 via-purple-500 to-pink-600',
                  iconColor: 'text-violet-500',
                  description: 'Store Management',
                  accent: 'bg-gradient-to-r from-violet-400 to-purple-500'
                }
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <Button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    variant="ghost"
                    className={`group relative flex flex-col items-center gap-3 py-6 px-8 rounded-2xl font-semibold text-lg transition-all duration-500 hover:scale-105 ${
                      isActive
                        ? `bg-gradient-to-r ${tab.color} text-white shadow-2xl hover:shadow-3xl transform scale-105`
                        : `hover:bg-gradient-to-r ${tab.bgColor} text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:shadow-xl`
                    }`}
                  >
                    {/* Icon Container */}
                    <div className={`relative p-5 rounded-3xl transition-all duration-500 group-hover:scale-110 ${
                      isActive 
                        ? 'bg-white/20 shadow-xl' 
                        : `bg-gradient-to-br ${tab.iconBg} text-white shadow-xl group-hover:shadow-2xl`
                    }`}>
                      <Icon className={`w-10 h-10 transition-all duration-300 ${
                        isActive ? 'text-white' : 'text-white group-hover:rotate-12'
                      }`} />
                      
                      {/* Colorful Animated Ring */}
                      {isActive && (
                        <div className={`absolute inset-0 rounded-3xl border-3 ${tab.accent} animate-ping opacity-60`}></div>
                      )}
                      
                      {/* Hover Glow Effect */}
                      <div className={`absolute inset-0 rounded-3xl ${tab.accent} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>
                    </div>
                    
                    {/* Label */}
                    <div className="text-center">
                      <div className="font-bold text-lg">{tab.label}</div>
                      <div className={`text-xs mt-1 transition-colors duration-300 ${
                        isActive 
                          ? 'text-white/80' 
                          : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200'
                      }`}>
                        {tab.description}
                      </div>
                    </div>
                    
                    {/* Active Indicator */}
                    {isActive && (
                      <div className="absolute -bottom-2 w-12 h-1 bg-white rounded-full animate-pulse"></div>
                    )}
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
            {/* Active Users Card */}
            <Card className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-gradient-to-br from-cyan-500/15 via-blue-500/10 to-indigo-600/5 dark:from-cyan-400/25 dark:via-blue-400/20 dark:to-indigo-500/10 border-0 shadow-lg overflow-hidden">
              <CardContent className="p-6 relative">
                {/* Vibrant Background Pattern */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-cyan-400/30 via-blue-500/20 to-indigo-600/20 rounded-full -translate-y-20 translate-x-20 animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-cyan-300/20 to-blue-400/20 rounded-full translate-y-12 -translate-x-12"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div className="p-6 bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 rounded-3xl shadow-2xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 relative">
                      <Users className="w-12 h-12 text-white drop-shadow-lg" />
                      {/* Colorful Sparkles */}
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
                      <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-cyan-300 rounded-full animate-ping delay-300"></div>
                    </div>
                    <div className="text-right">
                      <div className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                        {dashboardData.statistics.totalUsers}
                      </div>
                      <div className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Active Users</div>
                    </div>
                  </div>
                  
                  {/* Colorful Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400 flex items-center gap-1">
                        <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></div>
                        Platform Growth
                      </span>
                      <span className="text-xs font-bold bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">+12%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 shadow-inner">
                      <div className="bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-1000 group-hover:w-full shadow-lg" style={{width: '75%'}}></div>
                    </div>
                  </div>
                  
                  {/* Colorful Status Indicator */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse shadow-lg"></div>
                      <span className="text-xs font-bold text-green-600 dark:text-green-400">Online</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-100"></div>
                      <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce delay-200"></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Registered Stores Card */}
            <Card className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-gradient-to-br from-emerald-500/15 via-green-500/10 to-teal-600/5 dark:from-emerald-400/25 dark:via-green-400/20 dark:to-teal-500/10 border-0 shadow-lg overflow-hidden">
              <CardContent className="p-6 relative">
                {/* Vibrant Background Pattern */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-emerald-400/30 via-green-500/20 to-teal-600/20 rounded-full -translate-y-20 translate-x-20 animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-green-300/20 to-emerald-400/20 rounded-full translate-y-12 -translate-x-12"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div className="p-6 bg-gradient-to-br from-emerald-400 via-green-500 to-teal-600 rounded-3xl shadow-2xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 relative">
                      <Store className="w-12 h-12 text-white drop-shadow-lg" />
                      {/* Colorful Sparkles */}
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-lime-400 rounded-full animate-ping"></div>
                      <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-emerald-300 rounded-full animate-ping delay-300"></div>
                    </div>
                    <div className="text-right">
                      <div className="text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                        {dashboardData.statistics.totalStores}
                      </div>
                      <div className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Registered Stores</div>
                    </div>
                  </div>
                  
                  {/* Colorful Store Types Distribution */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                        Store Types
                      </span>
                      <span className="text-xs font-bold bg-gradient-to-r from-emerald-500 to-green-500 bg-clip-text text-transparent">+8%</span>
                    </div>
                    <div className="flex gap-1">
                      <div className="h-3 bg-gradient-to-r from-emerald-400 via-green-500 to-teal-500 rounded-full flex-1 shadow-lg"></div>
                      <div className="h-3 bg-gradient-to-r from-green-400 via-emerald-500 to-lime-500 rounded-full w-1/3 shadow-lg"></div>
                      <div className="h-3 bg-gradient-to-r from-teal-400 via-green-400 to-emerald-400 rounded-full w-1/4 shadow-lg"></div>
                    </div>
                  </div>
                  
                  {/* Colorful Status Indicator */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full animate-pulse shadow-lg"></div>
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Active</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce delay-100"></div>
                      <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce delay-200"></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Customer Feedback Card */}
            <Card className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-gradient-to-br from-amber-500/15 via-yellow-500/10 to-orange-500/5 dark:from-amber-400/25 dark:via-yellow-400/20 dark:to-orange-500/10 border-0 shadow-lg overflow-hidden">
              <CardContent className="p-6 relative">
                {/* Vibrant Background Pattern */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-amber-400/30 via-yellow-500/20 to-orange-600/20 rounded-full -translate-y-20 translate-x-20 animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-yellow-300/20 to-amber-400/20 rounded-full translate-y-12 -translate-x-12"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div className="p-6 bg-gradient-to-br from-amber-400 via-yellow-500 to-orange-600 rounded-3xl shadow-2xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 relative">
                      <Star className="w-12 h-12 text-white drop-shadow-lg" />
                      {/* Colorful Sparkles */}
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-300 rounded-full animate-ping"></div>
                      <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-orange-300 rounded-full animate-ping delay-300"></div>
                    </div>
                    <div className="text-right">
                      <div className="text-5xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent mb-2">
                        {dashboardData.statistics.totalRatings}
                      </div>
                      <div className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Customer Feedback</div>
                    </div>
                  </div>
                  
                  {/* Colorful Rating Distribution */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                        <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                        Rating Quality
                      </span>
                      <span className="text-xs font-bold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">+15%</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <div key={star} className={`w-4 h-4 rounded-full shadow-lg group-hover:scale-110 transition-all duration-300 ${
                          star <= 4 ? 'bg-gradient-to-r from-amber-400 to-yellow-500' : 'bg-gradient-to-r from-yellow-400 to-orange-500'
                        }`} style={{animationDelay: `${star * 100}ms`}}></div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Colorful Status Indicator */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full animate-pulse shadow-lg"></div>
                      <span className="text-xs font-bold text-amber-600 dark:text-amber-400">Engaged</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce delay-100"></div>
                      <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce delay-200"></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Platform Quality Card */}
            <Card className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-gradient-to-br from-violet-500/15 via-purple-500/10 to-pink-500/5 dark:from-violet-400/25 dark:via-purple-400/20 dark:to-pink-500/10 border-0 shadow-lg overflow-hidden">
              <CardContent className="p-6 relative">
                {/* Vibrant Background Pattern */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-violet-400/30 via-purple-500/20 to-pink-600/20 rounded-full -translate-y-20 translate-x-20 animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-300/20 to-violet-400/20 rounded-full translate-y-12 -translate-x-12"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div className="p-6 bg-gradient-to-br from-violet-400 via-purple-500 to-pink-600 rounded-3xl shadow-2xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 relative">
                      <TrendingUp className="w-12 h-12 text-white drop-shadow-lg" />
                      {/* Colorful Sparkles */}
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-pink-300 rounded-full animate-ping"></div>
                      <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-violet-300 rounded-full animate-ping delay-300"></div>
                    </div>
                    <div className="text-right">
                      <div className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                        {dashboardData.statistics.averageRating.toFixed(1)}
                      </div>
                      <div className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Platform Quality</div>
                    </div>
                  </div>
                  
                  {/* Colorful Quality Score */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-violet-600 dark:text-violet-400 flex items-center gap-1">
                        <div className="w-2 h-2 bg-violet-500 rounded-full animate-pulse"></div>
                        Quality Score
                      </span>
                      <span className="text-xs font-bold bg-gradient-to-r from-violet-500 to-purple-500 bg-clip-text text-transparent">+3%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 shadow-inner">
                      <div className="bg-gradient-to-r from-violet-400 via-purple-500 to-pink-500 h-4 rounded-full transition-all duration-1000 group-hover:w-full shadow-lg" style={{width: `${(dashboardData.statistics.averageRating / 5) * 100}%`}}></div>
                    </div>
                  </div>
                  
                  {/* Colorful Status Indicator */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-gradient-to-r from-violet-400 to-purple-500 rounded-full animate-pulse shadow-lg"></div>
                      <span className="text-xs font-bold text-violet-600 dark:text-violet-400">Excellent</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-100"></div>
                      <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce delay-200"></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Recent Users and Stores */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-br from-cyan-50/80 via-blue-50/60 to-indigo-50/40 dark:from-cyan-900/20 dark:via-blue-900/15 dark:to-indigo-900/10 backdrop-blur-sm border-0 shadow-xl overflow-hidden relative">
              {/* Background Pattern */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-400/20 to-blue-500/20 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-300/20 to-indigo-400/20 rounded-full translate-y-12 -translate-x-12"></div>
              
              <CardHeader className="pb-4 relative z-10">
                <CardTitle className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl shadow-lg">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">Recent Users</span>
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

            <Card className="bg-gradient-to-br from-emerald-50/80 via-green-50/60 to-teal-50/40 dark:from-emerald-900/20 dark:via-green-900/15 dark:to-teal-900/10 backdrop-blur-sm border-0 shadow-xl overflow-hidden relative">
              {/* Background Pattern */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-400/20 to-green-500/20 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-green-300/20 to-emerald-400/20 rounded-full translate-y-12 -translate-x-12"></div>
              
              <CardHeader className="pb-4 relative z-10">
                <CardTitle className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl shadow-lg">
                    <Store className="w-6 h-6 text-white" />
                  </div>
                  <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">Recent Stores</span>
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
          <Card className="bg-gradient-to-br from-amber-50/80 via-yellow-50/60 to-orange-50/40 dark:from-amber-900/20 dark:via-yellow-900/15 dark:to-orange-900/10 backdrop-blur-sm border-0 shadow-xl overflow-hidden relative">
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-400/20 to-yellow-500/20 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-yellow-300/20 to-orange-400/20 rounded-full translate-y-12 -translate-x-12"></div>
            
            <CardHeader className="pb-4 relative z-10">
              <CardTitle className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-xl shadow-lg">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <span className="bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">Top Rated Stores</span>
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
            <Card className="bg-gradient-to-br from-violet-50/80 via-purple-50/60 to-pink-50/40 dark:from-violet-900/20 dark:via-purple-900/15 dark:to-pink-900/10 backdrop-blur-sm border-0 shadow-xl overflow-hidden relative">
              {/* Background Pattern */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-violet-400/20 to-purple-500/20 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-300/20 to-pink-400/20 rounded-full translate-y-12 -translate-x-12"></div>
              
              <CardHeader className="pb-4 relative z-10">
                <CardTitle className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl shadow-lg">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">User Role Distribution</span>
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
            <Card className="bg-gradient-to-br from-emerald-50/80 via-green-50/60 to-teal-50/40 dark:from-emerald-900/20 dark:via-green-900/15 dark:to-teal-900/10 backdrop-blur-sm border-0 shadow-xl overflow-hidden relative">
              {/* Background Pattern */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-400/20 to-green-500/20 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-green-300/20 to-emerald-400/20 rounded-full translate-y-12 -translate-x-12"></div>
              
              <CardHeader className="pb-4 relative z-10">
                <CardTitle className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl shadow-lg">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">Platform Growth</span>
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
          {/* Enhanced Users Header */}
          <Card className="bg-gradient-to-br from-emerald-50/80 via-green-50/60 to-teal-50/40 dark:from-emerald-900/20 dark:via-green-900/15 dark:to-teal-900/10 backdrop-blur-sm border-0 shadow-xl overflow-hidden relative">
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-emerald-400/20 to-green-500/20 rounded-full -translate-y-20 translate-x-20"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-green-300/20 to-emerald-400/20 rounded-full translate-y-16 -translate-x-16"></div>
            
            <CardHeader className="relative z-10">
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl shadow-lg">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">User Management</span>
              </CardTitle>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Manage user accounts, roles, and permissions across the platform.
              </p>
            </CardHeader>
          </Card>
          
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
          {/* Enhanced Stores Header */}
          <Card className="bg-gradient-to-br from-violet-50/80 via-purple-50/60 to-pink-50/40 dark:from-violet-900/20 dark:via-purple-900/15 dark:to-pink-900/10 backdrop-blur-sm border-0 shadow-xl overflow-hidden relative">
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-violet-400/20 to-purple-500/20 rounded-full -translate-y-20 translate-x-20"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-purple-300/20 to-pink-400/20 rounded-full translate-y-16 -translate-x-16"></div>
            
            <CardHeader className="relative z-10">
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl shadow-lg">
                  <Store className="w-8 h-8 text-white" />
                </div>
                <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">Store Management</span>
              </CardTitle>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Manage store listings, verify ownership, and monitor store performance.
              </p>
            </CardHeader>
          </Card>
          
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
