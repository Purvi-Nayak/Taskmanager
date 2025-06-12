import { Route, Routes } from "react-router-dom";
import PublicLayout from "../layout/PublicLayout";
import PrivateLayout from "../layout/PrivateLayout";
import useRoute from "../hooks/useRoutes";
import NotFoundPage from "../pages/NotFoundPages"

const Routing = () => {
  const { privateRoutes, publicRoutes } = useRoute();
  
  return (
    <>
      <Routes>
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