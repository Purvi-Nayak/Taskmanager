import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaHome, FaLandmark, FaSignOutAlt, FaTasks, FaUsers } from 'react-icons/fa';
import { useDrawer } from '../context/DrawerContext';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/slices/userSlice';

const DrawerLayout = ({ children }) => {
  const { isDrawerOpen, toggleDrawer } = useDrawer();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const menuItems = [
    { icon: <FaHome className="w-5 h-5" />, label: 'Dashboard', path: '/' },
    { icon: <FaTasks className="w-5 h-5" />, label: 'Tasks', path: '/tasks' },
    { icon: <FaUsers className="w-5 h-5" />, label: 'Users', path: '/users' },
    {
      icon: <FaSignOutAlt className="w-5 h-5" />,
      label: 'Logout',
      onClick: handleLogout
    },
   
  ];

  return (
    <div className="flex h-7 bg-gray-100">
      {/* Drawer */}
      <div 
        className={`fixed inset-y-0 left-0 transform ${
          isDrawerOpen ? 'translate-x-0' : '-translate-x-full'
        } w-64 bg-white shadow-lg transition-transform duration-300 ease-in-out z-20`}
      >
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Menu</h2>
          <nav className="space-y-2">
            {menuItems.map((item, index) => (
              item.onClick ? (
                <button
                  key={index}
                  onClick={item.onClick}
                  className="flex items-center space-x-3 px-4 py-3 w-full text-left text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                >
                  {item.icon}
                  <span className="font-medium">{item.label}</span>
                </button>
              ) : (
                <Link
                  key={index}
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors ${
                    location.pathname === item.path ? 'bg-blue-50 text-blue-600' : ''
                  }`}
                >
                  {item.icon}
                  <span className="font-medium">{item.label}</span>
                </Link>
              )
            ))}
          </nav>
        </div>
      </div>

      {/* Overlay */}
      {isDrawerOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-10"
          onClick={toggleDrawer}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 pl-0 lg:pl-64">
        {children}
      </div>
    </div>
  );
};

export default DrawerLayout;