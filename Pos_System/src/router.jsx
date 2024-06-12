import {createBrowserRouter} from 'react-router-dom'
import UserLayout from './Layout/UserLayout'
import GuestLayout from './Layout/GuestLayout'
import Login from './Views/LoginView/Login'
import Register from './Views/RegisterView/Register'
import MainPos from './Views/MainPosView/MainPos'
import NotFound from './NotFound'
import Products from './Views/ProductsView/Products'
import Reports from './Views/ReportsView/Reports'
import Account from './Views/AccountView/Account'

const router = createBrowserRouter([
    {
        path: '/',
        element: <UserLayout />,
        children: [
            {
                path: '/',
                element: <MainPos />
            },
            {
                path: '/home',
                element: <MainPos />
            },
            {
                path: '/products',
                element: <Products />
            },
            {
                path: '/reports',
                element: <Reports />
            },
            {
                path: '/account',
                element: <Account />
            },
        ]
    },
    {
        path: '/',
        element: <GuestLayout />,
        children: [
            {
                path: '/login',
                element: <Login />
            },
            {
                path: '/register',
                element: <Register />
            }
        ]
    },
    {
        path: '*',
        element: <NotFound />
    },
])

export default router;