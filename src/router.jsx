import { createBrowserRouter } from "react-router-dom";
import RootLayout from "./routes/RootLayout";
import Login from "./routes/Login"; 
import Register from "./routes/User/Register";
import Home from "./routes/Home";
import BusinessList from "./routes/Business/BusinessList";
import BusinessDetail from "./routes/Business/BusinessDetail";

const router = createBrowserRouter([
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/register",
        element: <Register />,
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
            },/*
            {
                path: "profile",
                element: (
                    <RoleProtectedRoute>
                        <Profile />
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
                path: "new-item",
                element: (
                    <RoleProtectedRoute allowedRoles={["SELLER"]}>
                        <ItemForm />
                    </RoleProtectedRoute>
                ),
            },
            
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