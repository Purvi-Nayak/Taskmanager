import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { FaEye } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { URLS } from '../../constant/urls';
import CustomModal from '../../components/Modal';
import useDebounce from '../../hooks/useDebounce';
import SearchBox from '../../shared/SearchText';

const Users = () => {
  const { usersList } = useSelector(state => state.users);
  const currentUser = useSelector(state => state.users.user);
  const { tasks } = useSelector(state => state.tasks);
  const navigate = useNavigate();

  const isAdmin = currentUser?.role === 'admin';

  // State for alert modal
  const [alertOpen, setAlertOpen] = useState(false);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 400);

  // Filter users by debounced search
  const filteredUsers = usersList.filter(user =>
    user.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
    user.email.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  const handleViewTasks = (userId) => {
    if (isAdmin) {
      // For admin, navigate to a filtered tasks page or show tasks below (see below)
      // Option 1: Show all tasks below (no navigation needed)
      // Option 2: If you want navigation, you can pass userId as state or query param
    } else {
      // Only allow viewing if it's the current user
      if (userId === currentUser.id) {
        navigate(URLS.TASKS);
      } else {
        setAlertOpen(true);
      }
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Users</h1>
        <p className="text-sm text-gray-600">Manage user accounts and permissions.</p>
      </div>

      {/* Search Box */}
      <div className="mb-4 max-w-xs">
        <SearchBox
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search users..."
        />
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-lg font-medium text-gray-600">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {user.name}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{user.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    user.role === 'admin' 
                      ? 'bg-purple-100 text-purple-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleViewTasks(user.id)}
                    className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium ${
                      isAdmin || user.id === currentUser.id
                        ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <FaEye className="mr-2" />
                    View Tasks
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* For admin: Show all users' tasks below */}
      {isAdmin && (
        <div>
          <h2 className="text-lg font-semibold mb-2">All User Tasks</h2>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Task</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map(task => {
                  const user = usersList.find(u => u.id === task.userId);
                  return (
                    <tr key={task.id}>
                      <td className="px-6 py-4">{task.title}</td>
                      <td className="px-6 py-4">{user?.name || 'Unknown'}</td>
                      <td className="px-6 py-4">{task.status}</td>
                      <td className="px-6 py-4">{task.dueDate}</td>
                    </tr>
                  );
                })}
                {tasks.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-gray-400">No tasks found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <CustomModal
        open={alertOpen}
        title="Access Denied"
        message="You can only view your own tasks."
        onConfirm={() => setAlertOpen(false)}
        confirmText="OK"
        showCancel={false}
      />
    </div>
  );
};

export default Users;