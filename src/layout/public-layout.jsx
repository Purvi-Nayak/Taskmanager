import Header from "../components/Header";
import { Outlet } from "react-router-dom";
import withAuth from "../hoc/with-auth";

const PublicLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
};

export default withAuth(PublicLayout);