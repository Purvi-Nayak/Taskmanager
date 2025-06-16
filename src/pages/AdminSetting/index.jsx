import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import InputText from '../../shared/inputText';
import CustomButton from '../../shared/custombutton';
import { setUser } from '../../redux/slices/userSlice';

const AdminSettings = () => {
  const currentUser = useSelector(state => state.users.user);
  const usersList = useSelector(state => state.users.usersList);
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    password: currentUser?.password || '',
  });
  const [success, setSuccess] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();

    // Update user in usersList
    const updatedUsersList = usersList.map(user =>
      user.id === currentUser.id
        ? { ...user, ...form }
        : user
    );

    // Update Redux store
    dispatch(setUser({ ...currentUser, ...form }));
    dispatch({
      type: 'users/setUsersList',
      payload: updatedUsersList,
    });

    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  };

  return (
    <div className="max-w-xl mx-auto bg-white rounded-lg shadow p-8 mt-10">
      <h2 className="text-2xl font-bold mb-6">Admin Profile Settings</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <InputText
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Enter your email"
        />
        <InputText
          label="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Enter your Password"
        />
        <CustomButton text="Update Profile" type="submit" className="w-full" />
        {success && (
          <div className="text-blue-600 text-center font-semibold mt-2">
            Profile updated successfully!
          </div>
        )}
      </form>
    </div>
  );
};

export default AdminSettings;