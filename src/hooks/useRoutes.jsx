import { useMemo } from 'react';
import { URLS } from '../constant/urls';
import Home from '../pages/UserDashboard';
import Login from '../container/auth/login';
import Register from '../container/auth/Registration';
import Tasks from '../pages/Task';
import Users from '../pages/Users';
import ForgotPasswod from '../container/auth/ForgetPassword';
import AdminDashboard from '../pages/AdminDashboard';
import Setting from '../pages/AdminSetting';


const useRoute = () => {
    const allRoutes = useMemo(() => [
        {
            id: 'login',
            path: URLS.LOGIN,
            element: Login,
            isPublic: true
        },
        {
            id: 'register',
            path: URLS.REGISTER,
            element: Register,
            isPublic: true
        },
        {
            id: 'forgotPassword',
            path: URLS.FORGOTPASSWORD,
            element: ForgotPasswod,
            isPublic: true
        },
        {
            id: 'root',
            path: URLS.INITIAL,
            element: Home,
            isPrivate: true
        },
            {
            id: 'admin-dashboard',
            path: URLS.ADMIN,
            element: AdminDashboard,
            isPrivate: true
        },
        {
            id: 'tasks',
            path: URLS.TASKS,
            element: Tasks,
            isPrivate: true
        },
        {
            id: 'users',
            path: URLS.USERS,
            element: Users,
            isPrivate: true
        },
        {
            id: 'settings',
            path: URLS.SETTING,
            element:Setting,
            isPrivate: true
        }
    ], []);

    const privateRoutes = useMemo(() => allRoutes.filter(route => route.isPrivate), [allRoutes]);

    const publicRoutes = useMemo(() => allRoutes.filter(route => route.isPublic), [allRoutes]);

    return { privateRoutes, publicRoutes };
};

export default useRoute;