import { createBrowserRouter } from "react-router-dom";
import RootLayout from "./routes/RootLayout";
import Login from "./routes/Login";
import Home from "./routes/Home";
import BusinessList from "./routes/Business/BusinessList";
import BusinessDetail from "./routes/Business/BusinessDetail";
import RegisterUser from "./routes/User/Register";
import BusinessForm from "./routes/Business/BusinessForm";
import RoleProtectedRoute from "./components/RoleProtectedRoute";
import MyBusinesses from "./routes/Business/MyBusinesses";
import ItemForm from "./routes/Item/ItemForm";
import ManageItems from "./routes/Item/ManageItems";
import ErrorPage from "./routes/ErrorPage";
import Profile from "./routes/User/Profile";
import ProfileEdit from "./routes/User/ProfileEdit";
import Cart from "./routes/Cart";
import Favorites from "./routes/Favorites";
import Inventory from "./routes/Invetory";
import Purchases from "./routes/Purchases";
import OrderConfirmation from "./routes/OrderConfirmation";
import SellerDashboard from "./routes/SellerDashboard";
import ItemDetail from "./routes/ItemDetail";
import AdminBusinesses from "./routes/AdminBusinesses";

const router = createBrowserRouter([
    {
        path: "/login",
        element: <Login />,
        errorElement: <ErrorPage />,
    },
    {
        path: "/register",
        element: <RegisterUser />,
        errorElement: <ErrorPage />,
    },
    {
        path: "/",
        element: <RootLayout />,
        errorElement: <ErrorPage />,
        children: [
            {
                index: true,
                element: <Home />
            },
            {
                path: "category/:categoryKey",
                element: <BusinessList />
            },
            {
                path: "business/:id",
                element: <BusinessDetail />
            },
            {
                path: "new-business",
                element: (
                    <RoleProtectedRoute>
                        <BusinessForm />
                    </RoleProtectedRoute>
                ),
            },
            {
                path: "profile",
                element: (
                    <RoleProtectedRoute>
                        <Profile />
                    </RoleProtectedRoute>
                ),
            },
            {
                path: "profile/edit",
                element: (
                    <RoleProtectedRoute>
                        <ProfileEdit />
                    </RoleProtectedRoute>
                ),
            },
            {
                path: "favorites",
                element: (
                    <RoleProtectedRoute>
                        <Favorites />
                    </RoleProtectedRoute>
                ),
            },
            {
                path: "my-businesses",
                element: (
                    <RoleProtectedRoute>
                        <MyBusinesses />
                    </RoleProtectedRoute>
                ),
            },
            {
                path: "edit-business/:businessId",
                element: (
                    <RoleProtectedRoute allowedRoles={['SELLER']}>
                        <BusinessForm isEditMode={true} />
                    </RoleProtectedRoute>
                ),
            },
            {
                path: "new-item",
                element: (
                    <RoleProtectedRoute allowedRoles={['SELLER']}>
                        <ItemForm />
                    </RoleProtectedRoute>
                ),
            },
            {
                path: "manage-items/:id",
                element: (
                    <RoleProtectedRoute allowedRoles={['SELLER']}>
                        <ManageItems />
                    </RoleProtectedRoute>
                ),
            },
            {
                path: "edit-item/:itemId",
                element: (
                    <RoleProtectedRoute allowedRoles={['SELLER']}>
                        <ItemForm isEditMode={true} />
                    </RoleProtectedRoute>
                ),
            },
            {
                path: "item/:id",
                element: <ItemDetail />
            },
            {
                path: "cart",
                element: (
                    <RoleProtectedRoute>
                        <Cart />
                    </RoleProtectedRoute>
                ),
            },
            {
                path: "estoque",
                element: (
                    <RoleProtectedRoute allowedRoles={['SELLER']}>
                        <Inventory />
                    </RoleProtectedRoute>
                )
            },
            {
                path: "dashboard-seller",
                element: (
                    <RoleProtectedRoute allowedRoles={['SELLER']}>
                        <SellerDashboard />
                    </RoleProtectedRoute>
                )
            },
            {
                path: "orders",
                element: (
                    <RoleProtectedRoute>
                        <Purchases />
                    </RoleProtectedRoute>
                ),
            },
            {
                path: "order-confirmation",
                element: (
                    <RoleProtectedRoute>
                        <OrderConfirmation />
                    </RoleProtectedRoute>
                )
            },
            {
                path: "admin/businesses",
                element: (
                    <RoleProtectedRoute allowedRoles={['ADMIN']}>
                        <AdminBusinesses />
                    </RoleProtectedRoute>
                )
            },
        ]
    }
]);

export default router;