import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateProfile } from '../redux/slices/authSlice';
import { FiUser, FiMail, FiPhone, FiMapPin, FiCalendar, FiCamera, FiSave } from 'react-icons/fi';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    country: '',
    profilePicture: '',
  });

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split('T')[0] : '',
        country: user.country || '',
        profilePicture: user.profilePicture || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5000000) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    setUploading(true);

    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.post(`${API_URL}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      setFormData((prev) => ({
        ...prev,
        profilePicture: data.data.url,
      }));
      toast.success('Image uploaded successfully!');
    } catch (error) {
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await dispatch(updateProfile(formData)).unwrap();
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-playfair text-5xl font-bold text-navy mb-8">My Profile</h1>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <form onSubmit={handleSubmit}>
            {/* Profile Picture */}
            <div className="flex items-center justify-center mb-8">
              <div className="relative">
                <img
                  src={formData.profilePicture || 'https://via.placeholder.com/150'}
                  alt="Profile"
                  className="w-32 h-32 rounded-full border-4 border-gold object-cover"
                />
                <label
                  htmlFor="profile-upload"
                  className="absolute bottom-0 right-0 bg-gold text-navy p-3 rounded-full cursor-pointer hover:shadow-gold-glow transition-all"
                >
                  <FiCamera className="w-5 h-5" />
                  <input
                    id="profile-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
                {uploading && (
                  <div className="absolute inset-0 bg-navy bg-opacity-50 rounded-full flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gold"></div>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Name */}
              <div>
                <label className="block font-semibold text-navy mb-2">
                  First Name
                </label>
                <div className="relative">
                  <FiUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                </div>
              </div>

              {/* Last Name */}
              <div>
                <label className="block font-semibold text-navy mb-2">
                  Last Name
                </label>
                <div className="relative">
                  <FiUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block font-semibold text-navy mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    disabled
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block font-semibold text-navy mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <FiPhone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                </div>
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block font-semibold text-navy mb-2">
                  Date of Birth
                </label>
                <div className="relative">
                  <FiCalendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                </div>
              </div>

              {/* Country */}
              <div>
                <label className="block font-semibold text-navy mb-2">Country</label>
                <div className="relative">
                  <FiMapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                  >
                    <option value="">Select Country</option>
                    <option value="USA">United States</option>
                    <option value="UK">United Kingdom</option>
                    <option value="Canada">Canada</option>
                    <option value="Australia">Australia</option>
                    <option value="India">India</option>
                    <option value="Germany">Germany</option>
                    <option value="France">France</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="mt-8 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center space-x-2 bg-gradient-gold text-navy px-8 py-4 rounded-lg font-bold text-lg hover:shadow-gold-glow transition-all disabled:opacity-50"
              >
                <FiSave />
                <span>{saving ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
