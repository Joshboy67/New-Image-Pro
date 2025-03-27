'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { UserCircle, Camera, Save, X } from 'lucide-react';
import Image from 'next/image';

export default function ProfilePage() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.user_metadata?.full_name || '',
    email: user?.email || '',
    avatar: user?.user_metadata?.avatar_url || '',
  });
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
        setFormData(prev => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Here you would typically make an API call to update the user profile
      // For now, we'll simulate a successful update
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      setError('Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.user_metadata?.full_name || '',
      email: user?.email || '',
      avatar: user?.user_metadata?.avatar_url || '',
    });
    setAvatarPreview(null);
    setIsEditing(false);
    setError(null);
    setSuccess(null);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Profile Settings</h1>

        {error && (
          <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-50 text-green-700 rounded-md">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar Section */}
          <div className="flex items-center space-x-6">
            <div className="relative">
              {avatarPreview || formData.avatar ? (
                <div className="relative w-24 h-24 rounded-full overflow-hidden">
                  <Image
                    src={avatarPreview || formData.avatar}
                    alt="Profile"
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <UserCircle className="w-24 h-24 text-gray-400" />
              )}
              {isEditing && (
                <label className="absolute bottom-0 right-0 bg-white rounded-full p-1.5 shadow-lg cursor-pointer">
                  <Camera className="w-4 h-4 text-gray-600" />
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleAvatarChange}
                  />
                </label>
              )}
            </div>
            <div>
              <h2 className="text-lg font-medium text-gray-900">Profile Picture</h2>
              <p className="text-sm text-gray-500">
                Upload a new profile picture or keep the current one
              </p>
            </div>
          </div>

          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100"
            />
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              disabled
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100"
            />
            <p className="mt-1 text-sm text-gray-500">
              Email cannot be changed. Please contact support if you need to update your email.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            {isEditing ? (
              <>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <X className="w-4 h-4 inline-block mr-2" />
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  <Save className="w-4 h-4 inline-block mr-2" />
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Edit Profile
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
} 