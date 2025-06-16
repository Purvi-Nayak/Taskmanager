// const Tasks = () => {
//   // ... existing state and other code ...

//   const columns = [
//     {
//       id: "title",
//       label: "Task",
//       field_name: "title",
//       render: ({ row }) => (
//         <div className="px-6 py-4">{row.title}</div>
//       )
//     },
//     {
//       id: "status",
//       label: "Status",
//       field_name: "status",
//       render: ({ row }) => (
//         <div className="px-6 py-4">
//           <span
//             className={`px-2 py-1 text-xs font-semibold rounded-full ${
//               row.status === "Completed"
//                 ? "bg-green-100 text-green-800"
//                 : row.status === "In Progress"
//                 ? "bg-yellow-100 text-yellow-800"
//                 : row.status === "Pending"
//                 ? "bg-gray-100 text-gray-800"
//                 : row.status === "Approved"
//                 ? "bg-blue-100 text-blue-800"
//                 : row.status === "Rejected"
//                 ? "bg-red-100 text-red-800"
//                 : ""
//             }`}
//           >
//             {row.status}
//           </span>
//         </div>
//       )
//     },
//     // ... other columns ...
//   ];

//   // Modify fetchTasks to get user-specific tasks
//   const fetchTasks = async () => {
//     try {
//       setLoading(true);
//       const response = await api.TASKS.getUserTasks({
//         userId: currentUser.id
//       });
      
//       if (response.data) {
//         setTasks(response.data);
//       }
//     } catch (error) {
//       console.error('Error fetching tasks:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchTasks();
//   }, [currentUser.id]);
import { useDrawer } from '../context/DrawerContext';
import DrawerMenu from '../components/Drawer';
import { FaHome, FaTasks, FaSignOutAlt } from 'react-icons/fa';
import { URLS } from '../constant/urls';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../redux/slices/userSlice';

const DrawerLayout = ({ children }) => {
  const { isDrawerOpen, toggleDrawer } = useDrawer(); // <-- use the hook here
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigate(URLS.LOGIN);
  };

  const userMenuItems = [
    { icon: <FaHome className="w-5 h-5" />, label: 'Dashboard', path: URLS.DASHBOARD },
    { icon: <FaTasks className="w-5 h-5" />, label: 'Tasks', path: URLS.TASKS },
    { icon: <FaSignOutAlt className="w-5 h-5" />, label: 'Logout', onClick: handleLogout },
  ];

  return (
    <div className="min-h-screen">
      <DrawerMenu
        isOpen={isDrawerOpen}
        toggleDrawer={toggleDrawer}
        menuItems={userMenuItems}
        title="Menu"
      />
      <div className={`transition-all duration-300 ease-in-out ${isDrawerOpen ? 'ml-64' : 'ml-0'}`}>
        {children}
      </div>
    </div>
  );
};

export default DrawerLayout;