import Header from "../components/Header";
import { Outlet } from "react-router-dom";
import withAuth from "../hoc/with-auth";

const PublicLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* <Header /> */}
      <header className="flex items-center justify-between bg-primarylight px-6 py-3 shadow-sm font-roboto">
            <div className="flex items-center space-x-3">
              <div className="font-bold text-3xl text-white-pure hidden md:block">
                TaskMaster
              </div>
            </div>
        </header>
        <div className="flex-1">
          <Outlet />
        </div>
  
    </div>
  );
};

export default withAuth(PublicLayout);