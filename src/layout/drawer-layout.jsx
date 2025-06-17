
// import React from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import { FaHome, FaTasks, FaUser, FaCog, FaSignOutAlt } from 'react-icons/fa';
// import { useDrawer } from '../context/DrawerContext';
// import { logout } from '../redux/slices/userSlice';
// import { URLS } from '../constant/urls';
// import DrawerMenu from '../components/Drawer';

// const DrawerLayout = ({ children }) => {
//   const { isDrawerOpen, toggleDrawer } = useDrawer();
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const user = useSelector(state => state.users.user);
//   const isAdmin = user?.role === 'admin';

//   const handleLogout = () => {
//     dispatch(logout());
//     navigate(URLS.LOGIN);
//   };

//   // Define menu items based on user role
//   const menuItems = isAdmin 
//     ? [
//         { icon: <FaHome className="w-5 h-5" />, label: 'Dashboard', path: URLS.ADMIN },
//         { icon: <FaUser className="w-5 h-5" />, label: 'Users', path: URLS.USERS },
//         { icon: <FaCog className="w-5 h-5" />, label: 'Settings', path: URLS.SETTINGS },
//         { icon: <FaSignOutAlt className="w-5 h-5" />, label: 'Logout', onClick: handleLogout }
//       ]
//     : [
//         { icon: <FaHome className="w-5 h-5" />, label: 'Dashboard', path: URLS.DASHBOARD },
//         { icon: <FaTasks className="w-5 h-5" />, label: 'Tasks', path: URLS.TASKS },
//         { icon: <FaSignOutAlt className="w-5 h-5" />, label: 'Logout', onClick: handleLogout }
//       ];

//   return (
//     <div className="min-h-screen">
//       <DrawerMenu
//         isOpen={isDrawerOpen}
//         toggleDrawer={toggleDrawer}
//         menuItems={menuItems}
//         title={isAdmin ? "Admin Menu" : "Menu"}
//       />
//       <div className={`transition-all duration-300 ease-in-out ${isDrawerOpen ? 'ml-64' : 'ml-0'}`}>
//         {children}
//       </div>
//     </div>
//   );
// };

// export default DrawerLayout;
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaHome, FaTasks, FaUser, FaCog, FaSignOutAlt, FaThumbtack } from 'react-icons/fa';
import { useDrawer } from '../context/DrawerContext';
import { logout } from '../redux/slices/userSlice';
import { URLS } from '../constant/urls';
import DrawerMenu from '../components/Drawer';

const DrawerLayout = ({ children }) => {
  const { isDrawerOpen, toggleDrawer } = useDrawer();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(state => state.users.user);
  const isAdmin = user?.role === 'admin';

  const handleLogout = () => {
    dispatch(logout());
    navigate(URLS.LOGIN);
  };

  const menuItems = isAdmin 
    ? [
        { icon: <FaHome className="w-5 h-5" />, label: 'Dashboard', path: URLS.ADMIN },
        { icon: <FaUser className="w-5 h-5" />, label: 'Users', path: URLS.USERS },
        { icon: <FaCog className="w-5 h-5" />, label: 'Settings', path: URLS.SETTINGS },
        { icon: <FaSignOutAlt className="w-5 h-5" />, label: 'Logout', onClick: handleLogout },
    
      ]
    : [
        { icon: <FaHome className="w-5 h-5" />, label: 'Dashboard', path: URLS.INITIAL },
        { icon: <FaTasks className="w-5 h-5" />, label: 'Tasks', path: URLS.TASKS },
        { icon: <FaSignOutAlt className="w-5 h-5" />, label: 'Logout', onClick: handleLogout }
      ];

  return (
    <div className="min-h-screen relative">
      {/* Drawer Toggle Button */}
    

      {/* Drawer Menu */}
      <DrawerMenu
        isOpen={isDrawerOpen}
        toggleDrawer={toggleDrawer}
        menuItems={menuItems}
        title={isAdmin ? "Admin Menu" : "Menu"}
      />

      {/* Main Content */}
      <div 
        className={`transition-all duration-300 ease-in-out ${
          isDrawerOpen ? 'ml-64' : 'ml-0'
        }`}
      >
        {children}
      </div>
    </div>
  );
};

export default DrawerLayout;