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

const router = createBrowserRouter([
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/register",
        element: <RegisterUser />,
    },
    {
        path: "/",
        element: <RootLayout />,
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
            /*
            {
                path: "profile",
                element: (
                    <RoleProtectedRoute>
                        <Profile />
                    </RoleProtectedRoute>
                ),
            },*/
            {
                path: "my-businesses",
                element: (
                    <RoleProtectedRoute>
                        <MyBusinesses />
                    </RoleProtectedRoute>
                ),
            },
            {
                path: "new-item",
                element: (
                    <RoleProtectedRoute>
                        <ItemForm />
                    </RoleProtectedRoute>
                ),
            },
            {
                path: "manage-items/:id",
                element: (
                    <RoleProtectedRoute>
                        <ManageItems />
                    </RoleProtectedRoute>
                ),
            },
            /*
            {
                path: "edit-item/:itemId",
                element: (
                    <RoleProtectedRoute allowedRoles={["SELLER"]}>
                        <ItemForm isEditMode={true} /> 
                    </RoleProtectedRoute>
                ),
            },*/
        ]
    }
]);

export default router;