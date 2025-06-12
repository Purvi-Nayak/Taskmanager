import React from "react";
import {
  FaBell,
  FaQuestionCircle,
  FaThumbtack,
  FaSignOutAlt,
} from "react-icons/fa";
import { useDrawer } from "../../context/DrawerContext";
import { IMAGES } from "../../assets";
import { logout } from "../../redux/slices/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Header = ({ userName = "Admin" }) => {
  const { toggleDrawer } = useDrawer();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.users.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate(URLS.LOGIN);
  };
  return (
    <header className="flex items-center justify-between bg-white px-6 py-3 shadow-sm font-roboto">
   

      <div
        className="flex items-center space-x-3 cursor-pointer group"
        onClick={toggleDrawer}
        role="button"
        tabIndex={0}
      >
        <FaThumbtack className="text-xl text-black" 
        onClick={toggleDrawer}
        role="button"
        aria-lable="Toggle Drawer"/>
        <div>
          <div className="font-bold text-3xl text-black">TaskMaster</div>
          <div className="text-xs text-blue-600">{userName}</div>
        </div>
        {/* Tooltip */}
        <span className="absolute left-10 top-10 z-10 whitespace-nowrap bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Open Drawer
        </span>
      </div>
      {/* Center: Title (optional, can remove if not needed) */}
      <div className="font-bold text-3xl text-black">
        TaskMaster
      </div>

      {/* Right: Search, Icons, Avatar */}
      <div className="flex items-center space-x-3">
        <div>
          <img src={IMAGES.Task} alt="Task Manager Logo" className="w-8 h-8 " />
        </div>
        <button className="relative group p-2 rounded hover:bg-gray-100 text-gray-500">
          <FaSignOutAlt size={18} onClick={handleLogout} />
          <span className="absolute left-1/2 -translate-x-1/2 top-10 z-10 whitespace-nowrap bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Logout
          </span>
        </button>

        <button className="p-2 rounded hover:bg-gray-100 text-gray-500">
          <FaQuestionCircle size={18} />
        </button>
        <div className="w-9 h-9 rounded-full flex items-center justify-center text-lg font-bold relative group p-2 hover:bg-gray-100 text-gray-500">
          <img
            src={IMAGES.Profile}
            alt="User Avatar"
            className="w-full h-full rounded-full cursor-pointer"
            onClick={() => {
              if (currentUser?.role === "admin") {
                navigate("/admin/settings");
              }
            }}
            style={{
              cursor:
                currentUser?.role === "admin" ? "pointer" : "not-allowed",
              opacity: currentUser?.role === "admin" ? 1 : 0.5,
            }}
          />
          <span className="absolute left-1/2 -translate-x-1/2 top-10 z-10 whitespace-nowrap bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            {currentUser?.role === "admin"
              ? "Profile Settings"
              : "Only admin can change profile"}
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
