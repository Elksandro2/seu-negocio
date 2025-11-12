import { createBrowserRouter } from "react-router-dom";
import RootLayout from "./routes/RootLayout";
import RoleProtectedRoute from "./components/RoleProtectedRoute";
//import ErrorPage from "./routes/ErrorPage";
import Login from "./routes/Login"; 
//import Home from "./routes/Home";
//import Profile from "./routes/Profile";
//import MyBusinesses from "./routes/Business/MyBusinesses";
//import BusinessDetail from "./routes/Business/BusinessDetail";
//import ItemForm from "./routes/Item/ItemForm";

const router = createBrowserRouter([
    {
        path: "/login",
        element: <Login />,
        //errorElement: <ErrorPage />,
    },
    {
        path: "/",
        element: <RootLayout />,
        //errorElement: <ErrorPage />,
        children: [
            /*{
                index: true,
                element: <Home />
            },
            
            {
                path: "business/:id", 
                element: <BusinessDetail /> 
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
            },*/
        ]
    }
]);

export default router;