import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import FormGroup from '../../shared/formgroup';
import CustomButton from '../../shared/custombutton';
import { setUser } from '../../redux/slices/userSlice';
import { api } from '../../api/client';
import { useNavigate } from 'react-router-dom';
import { URLS } from '../../constant/urls';

// Admin Profile Validation Schema
const adminProfileSchema = Yup.object().shape({
  name: Yup.string()
    .required('Admin name is required')
    .min(2, 'Name must be at least 2 characters'),
  email: Yup.string()
    .required('Email is required')
    .email('Please enter a valid email'),
  currentPassword: Yup.string()
    .required('Current password is required'),
  newPassword: Yup.string()
    .min(8, 'New password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Password must contain uppercase, lowercase, number and special character'
    ),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword')], 'Passwords must match')
});

const AdminSettings = () => {
  const currentUser = useSelector(state => state.users.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Redirect if not admin
  React.useEffect(() => {
    if (currentUser?.role !== 'admin') {
      navigate(URLS.DASHBOARD);
    }
  }, [currentUser, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm({
    resolver: yupResolver(adminProfileSchema),
    defaultValues: {
      name: currentUser?.name || '',
      email: currentUser?.email || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  });

  const onSubmit = async (data) => {
    try {
      setError('');
      
      // Verify current password first
      const verifyResponse = await api.ADMIN.verifyPassword({
        adminId: currentUser.id,
        password: data.currentPassword
      });

      if (!verifyResponse.success) {
        setError('Current password is incorrect');
        return;
      }

      // Update admin profile
      const response = await api.ADMIN.updateProfile({
        adminId: currentUser.id,
        data: {
          name: data.name,
          email: data.email,
          password: data.newPassword,
          updatedAt: new Date().toISOString()
        }
      });

      if (response.data) {
        dispatch(setUser({
          ...currentUser,
          ...response.data
        }));

        setSuccess('Admin profile updated successfully');
        setTimeout(() => setSuccess(''), 2000);

        reset({
          name: response.data.name,
          email: response.data.email,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      }
    } catch (err) {
      console.error('Error updating admin profile:', err);
      setError(err.message || 'Failed to update admin profile');
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white rounded-lg shadow-lg p-8 mt-10">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Admin Settings</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Admin Profile Section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Profile Information</h3>
          <FormGroup
            label="Admin Name"
            name="name"
            register={register}
            error={errors.name}
            type="text"
            placeholder="Enter admin name"
          />

          <FormGroup
            label="Admin Email"
            name="email"
            register={register}
            error={errors.email}
            type="email"
            placeholder="Enter admin email"
          />
        </div>

        {/* Password Update Section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Update Password</h3>
       

          <FormGroup
            label="New Password"
            name="newPassword"
            register={register}
            error={errors.newPassword}
            type="password"
            placeholder="Enter new password"
          />
        </div>

        <CustomButton
          label={isSubmitting ? 'Updating...' : 'Update Admin Profile'}
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-primary hover:bg-primary-dark text-white py-2 rounded-lg"
        />
      </form>
    </div>
  );
};

export default AdminSettings;