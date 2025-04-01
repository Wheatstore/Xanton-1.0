import React, { useState, useEffect } from 'react';

// Simple SVG icons as components to replace Heroicons
const DashboardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const UsersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const ContentIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const SettingsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const SecurityIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const BellIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);

function Admin() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({
    users: 0,
    revenue: 0,
    tickets: 0,
    conversion: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  // Simulating data fetch
  useEffect(() => {
    // In a real app, you would fetch this data from your API
    setTimeout(() => {
      setStats({
        users: 12564,
        revenue: 48659,
        tickets: 36,
        conversion: 15.3
      });
      setIsLoading(false);
    }, 1000);
  }, []);

  // Sample user data
  const recentUsers = [
    { id: 1, name: 'Alex Johnson', email: 'alex@example.com', role: 'Premium', date: '2 days ago' },
    { id: 2, name: 'Sarah Smith', email: 'sarah@example.com', role: 'Basic', date: '3 days ago' },
    { id: 3, name: 'Michael Brown', email: 'michael@example.com', role: 'Admin', date: '1 week ago' },
    { id: 4, name: 'Emily Chen', email: 'emily@example.com', role: 'Premium', date: '2 weeks ago' },
  ];

  // Sample notifications
  const notifications = [
    { id: 1, message: 'New user registered', time: '10 minutes ago', type: 'user' },
    { id: 2, message: 'Server alert: High CPU usage', time: '1 hour ago', type: 'alert' },
    { id: 3, message: 'Payment processed', time: '3 hours ago', type: 'payment' },
    { id: 4, message: 'New support ticket', time: '1 day ago', type: 'support' },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white">
        <div className="p-4 border-b border-gray-800">
          <h2 className="text-xl font-bold">Admin Panel</h2>
        </div>
        
        <nav className="mt-4">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center w-full px-4 py-3 ${activeTab === 'dashboard' ? 'bg-blue-700' : 'hover:bg-gray-800'}`}
          >
            <DashboardIcon />
            <span>Dashboard</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('users')}
            className={`flex items-center w-full px-4 py-3 ${activeTab === 'users' ? 'bg-blue-700' : 'hover:bg-gray-800'}`}
          >
            <UsersIcon />
            <span>Users</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('content')}
            className={`flex items-center w-full px-4 py-3 ${activeTab === 'content' ? 'bg-blue-700' : 'hover:bg-gray-800'}`}
          >
            <ContentIcon />
            <span>Content</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('settings')}
            className={`flex items-center w-full px-4 py-3 ${activeTab === 'settings' ? 'bg-blue-700' : 'hover:bg-gray-800'}`}
          >
            <SettingsIcon />
            <span>Settings</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('security')}
            className={`flex items-center w-full px-4 py-3 ${activeTab === 'security' ? 'bg-blue-700' : 'hover:bg-gray-800'}`}
          >
            <SecurityIcon />
            <span>Security</span>
          </button>
        </nav>
        
        <div className="absolute bottom-0 w-64 p-4 bg-gray-800">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
              <UserIcon />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">Admin User</p>
              <p className="text-xs text-gray-400">admin@example.com</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="flex justify-between items-center px-8 py-4">
            <h1 className="text-2xl font-semibold text-gray-800">
              {activeTab === 'dashboard' && 'Dashboard'}
              {activeTab === 'users' && 'User Management'}
              {activeTab === 'content' && 'Content Management'}
              {activeTab === 'settings' && 'Settings'}
              {activeTab === 'security' && 'Security Settings'}
            </h1>
            
            <div className="flex items-center">
              <div className="relative mr-4">
                <BellIcon />
                <span className="absolute top-0 right-0 inline-block w-2 h-2 bg-red-500 rounded-full"></span>
              </div>
              
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                <UserIcon />
              </div>
            </div>
          </div>
        </div>
        
        {/* Dashboard Content */}
        {activeTab === 'dashboard' && (
          <div className="p-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mr-4">
                    <UsersIcon />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Users</p>
                    {isLoading ? (
                      <div className="h-6 w-20 bg-gray-200 animate-pulse rounded"></div>
                    ) : (
                      <p className="text-2xl font-semibold">{stats.users.toLocaleString()}</p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Revenue</p>
                    {isLoading ? (
                      <div className="h-6 w-20 bg-gray-200 animate-pulse rounded"></div>
                    ) : (
                      <p className="text-2xl font-semibold">${stats.revenue.toLocaleString()}</p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Support Tickets</p>
                    {isLoading ? (
                      <div className="h-6 w-16 bg-gray-200 animate-pulse rounded"></div>
                    ) : (
                      <p className="text-2xl font-semibold">{stats.tickets}</p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-lg bg-yellow-100 flex items-center justify-center mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Conversion Rate</p>
                    {isLoading ? (
                      <div className="h-6 w-16 bg-gray-200 animate-pulse rounded"></div>
                    ) : (
                      <p className="text-2xl font-semibold">{stats.conversion}%</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Recent Users & Notifications */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Recent Users */}
              <div className="lg:col-span-2 bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="font-semibold text-gray-800">Recent Users</h2>
                </div>
                <div className="p-6">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Name
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Role
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Joined
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {recentUsers.map((user) => (
                          <tr key={user.id}>
                            <td className="px-4 py-3">
                              <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                                  <span className="text-sm font-medium">{user.name.charAt(0)}</span>
                                </div>
                                <div className="ml-3">
                                  <p className="text-sm font-medium text-gray-800">{user.name}</p>
                                  <p className="text-xs text-gray-500">{user.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                ${user.role === 'Admin' ? 'bg-purple-100 text-purple-800' : 
                                 user.role === 'Premium' ? 'bg-green-100 text-green-800' : 
                                 'bg-gray-100 text-gray-800'}`}>
                                {user.role}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-500">
                              {user.date}
                            </td>
                            <td className="px-4 py-3 text-right text-sm font-medium">
                              <button className="text-blue-600 hover:text-blue-800">
                                Edit
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              
              {/* Notifications */}
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="font-semibold text-gray-800">Notifications</h2>
                </div>
                <div className="p-4">
                  <ul className="divide-y divide-gray-200">
                    {notifications.map((notification) => (
                      <li key={notification.id} className="py-3">
                        <div className="flex items-start">
                          <div className={`mt-1 w-8 h-8 rounded-full flex items-center justify-center
                            ${notification.type === 'user' ? 'bg-blue-100 text-blue-600' : 
                             notification.type === 'alert' ? 'bg-red-100 text-red-600' : 
                             notification.type === 'payment' ? 'bg-green-100 text-green-600' : 
                             'bg-purple-100 text-purple-600'}`}>
                            <BellIcon />
                          </div>
                          <div className="ml-3 flex-1">
                            <p className="text-sm text-gray-800">{notification.message}</p>
                            <p className="text-xs text-gray-500">{notification.time}</p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                  
                  <button className="mt-4 w-full text-center text-sm text-blue-600 hover:text-blue-800">
                    View all notifications
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Users Tab Content */}
        {activeTab === 'users' && (
          <div className="p-8">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="font-semibold text-gray-800">User Management</h2>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200">
                  Add User
                </button>
              </div>
              <div className="p-6">
                <p className="text-gray-600">User management interface will be displayed here</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Other tab content would go here */}
        {activeTab === 'content' && (
          <div className="p-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="font-semibold text-gray-800 mb-4">Content Management</h2>
              <p className="text-gray-600">Content management interface will be displayed here</p>
            </div>
          </div>
        )}
        
        {activeTab === 'settings' && (
          <div className="p-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="font-semibold text-gray-800 mb-4">Settings</h2>
              <p className="text-gray-600">Settings interface will be displayed here</p>
            </div>
          </div>
        )}
        
        {activeTab === 'security' && (
          <div className="p-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="font-semibold text-gray-800 mb-4">Security Settings</h2>
              <p className="text-gray-600">Security settings interface will be displayed here</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Admin;