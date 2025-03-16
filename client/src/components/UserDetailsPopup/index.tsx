"use client"
import React, { useState } from 'react';
import Image from 'next/image';
import { User } from '@/state/api';

type Props = {
  user: User;
  onClose: () => void;
  onSave: (updatedUser: User) => Promise<void>;
};

const UserDetailsPopup = ({ user, onClose, onSave }: Props) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState(user);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await onSave(formData);
      setIsEditMode(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-dark-secondary rounded-lg p-6 shadow-lg relative max-w-2xl w-full mx-4">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-200">
          &times;
        </button>
        
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-20 h-20 relative">
            <Image
              src={`/${formData.profilePictureUrl}`}
              alt={formData.username}
              width={80}
              height={80}
              className="rounded-full object-cover"
            />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isEditMode ? (
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="bg-transparent border-b border-gray-300 dark:border-gray-600"
                />
              ) : (
                formData.username
              )}
            </h2>
          </div>
        </div>

        <div className="space-y-4">
          {/* Add more user fields here */}
        </div>

        <div className="mt-6 flex justify-end space-x-2">
          {isEditMode ? (
            <>
              <button
                onClick={() => setIsEditMode(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
              >
                {isLoading ? 'Saving...' : 'Save'}
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditMode(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Edit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDetailsPopup;