import React from 'react';
import { useSelector } from 'react-redux';

const UserDashboard = () => {
  const usersList = useSelector(state => state.users.usersList);
  const currentUser = useSelector(state => state.users.user);
  const tasks = useSelector(state => state.tasks.tasks);

  // Total users
  const totalUsers = usersList.length;

  // Total tasks for the logged-in user
  const userTasks = tasks.filter(task => task.userId === currentUser?.id);
  const totalUserTasks = userTasks.length;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-blue-300 rounded-md shadow p-6 flex flex-col items-center">
          <span className="text-gray-500 text-lg mb-2">Total Users</span>
          <span className="text-4xl font-bold text-blue-600">{totalUsers}</span>
        </div>
        <div className="bg-blue-300 rounded-lg shadow p-6 flex flex-col items-center">
          <span className="text-gray-500 text-lg mb-2">Your Total Login user's Tasks</span>
          <span className="text-4xl font-bold text-blue-600">{totalUserTasks}</span>
        </div>
      </div>
  
       <div className="mt-10">
  <p className="text-gray-700">
    {currentUser?.role === 'admin' ? 'Welcome to your Admin dashboard!' : 'Welcome to your User dashboard!'}
  </p>

      </div>
    </div>
  );
};

export default UserDashboard;