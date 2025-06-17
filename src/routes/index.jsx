import { Route, Routes } from "react-router-dom";
import PublicLayout from "../layout/public-layout";
import PrivateLayout from "../layout/private-layout";
import useRoute from "../hooks/useroutes";
import NotFoundPage from "../pages/NotFoundPages"

const Routing = () => {
  const { privateRoutes, publicRoutes } = useRoute();
  
  return (
    <>
      <Routes>

        {role === "admin" && <Route path="/" element={<Navigate to="/dashboard" replace />} />}
        <Route path="*" element={<NotFoundPage />} />

        <Route element={<PublicLayout />}>
          {publicRoutes.map(({ id, element: Element, ...other }) => (
            <Route key={id} element={<Element />} {...other} />
          ))}
        </Route>

        <Route element={<PrivateLayout />}>
          {privateRoutes.map(({ id, element: Element, ...other }) => (
            <Route key={id} element={<Element />} {...other} />
          ))}
        </Route>
      </Routes>
    </>
  );
};

export default Routing;