
import Header from "../components/Header";
import { Outlet } from "react-router-dom";
import withUser from "../hoc/with-user";
import DrawerLayout from "./drawer-layout";

import { useSelector } from "react-redux";


const PrivateLayout = () => {
  const user = useSelector(state => state.users.user);




  // const Layout = isAdmin ? AdminDrawerLayout : DrawerLayout;

  return (
    <div className="flex flex-col min-h-screen">

      <Header />
      
      {/* <Layout> */}
      <DrawerLayout>
        <div className="flex-1">
          <Outlet />
        </div>
      </DrawerLayout>
      {/* </Layout> */}
    </div>
  );
};

export default withUser(PrivateLayout);