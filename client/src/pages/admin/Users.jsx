import React, { useEffect, useState } from 'react';
import { FiUsers, FiMail, FiPhone, FiShield } from 'react-icons/fi';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      // Note: You'll need to create this endpoint in your backend
      const { data } = await axios.get(`${API_URL}/users/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(data.data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      // Mock data for demo
      setUsers([
        {
          _id: '1',
          firstName: 'Admin',
          lastName: 'User',
          email: 'admin@aurel.com',
          role: 'admin',
          createdAt: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-gold"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-playfair text-5xl font-bold text-navy">Manage Users</h1>
          <div className="flex items-center space-x-2 bg-white px-6 py-3 rounded-lg shadow-lg">
            <FiUsers className="w-6 h-6 text-gold" />
            <span className="font-bold text-navy">{users.length} Total Users</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-navy text-white">
                <tr>
                  <th className="text-left py-4 px-6">Name</th>
                  <th className="text-left py-4 px-6">Email</th>
                  <th className="text-left py-4 px-6">Phone</th>
                  <th className="text-left py-4 px-6">Role</th>
                  <th className="text-left py-4 px-6">Joined</th>
                  <th className="text-left py-4 px-6">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <img
                          src={user.profilePicture || 'https://via.placeholder.com/40'}
                          alt={user.firstName}
                          className="w-10 h-10 rounded-full border-2 border-gold"
                        />
                        <span className="font-semibold">
                          {user.firstName} {user.lastName}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <FiMail className="w-4 h-4 text-gray-400" />
                        <span>{user.email}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <FiPhone className="w-4 h-4 text-gray-400" />
                        <span>{user.phone || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          user.role === 'admin'
                            ? 'bg-gold text-navy'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        <FiShield className="inline w-4 h-4 mr-1" />
                        {user.role}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6">
                      <button className="px-4 py-2 rounded-lg border-2 border-navy text-navy hover:bg-navy hover:text-white transition-all font-semibold">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
