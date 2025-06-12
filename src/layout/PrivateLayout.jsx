
import Header from "../components/Header";
import { Outlet } from "react-router-dom";
import withUser from "../hoc/Withuser";
import DrawerLayout from "./DrawerLayout";
import AdminDrawerLayout from "./AdminDrawerLayout";
import { useSelector } from "react-redux";

const PrivateLayout = () => {
  const user = useSelector(state => state.users.user);

  // Show admin drawer for admin, user drawer for others
  const isAdmin = user?.role === 'admin';

  const Layout = isAdmin ? AdminDrawerLayout : DrawerLayout;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Layout>
        <div className="flex-1">
          <Outlet />
        </div>
      </Layout>
    </div>
  );
};

export default withUser(PrivateLayout);